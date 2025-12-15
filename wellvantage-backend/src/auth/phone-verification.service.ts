import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
import twilio, { Twilio } from 'twilio';

// Uses Twilio Verify v2. Requires env vars:
// TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SID
// Numbers must be in E.164 (+<country><number>)

let twilioClient: Twilio | undefined;

@Injectable()
export class PhoneVerificationService {
  private verifySid: string | undefined;

  constructor(private readonly config: ConfigService) {
    const sid = this.config.get<string>('TWILIO_ACCOUNT_SID');
    const token = this.config.get<string>('TWILIO_AUTH_TOKEN');
    this.verifySid = this.config.get<string>('TWILIO_VERIFY_SID') || undefined;
    if (sid && token && this.verifySid) twilioClient = twilio(sid, token);
  }

  private ensureConfigured() {
    if (!twilioClient || !this.verifySid) {
      throw new BadRequestException('Phone verification not configured');
    }
  }

  private normalizeToE164(raw: string, country?: string): string {
    // Clean up the input: remove extra spaces and trim
    const cleaned = raw.replace(/\s+/g, '').trim();
    
    // Try parsing with country code first (if phone starts with +)
    let pn = parsePhoneNumberFromString(cleaned);
    
    // If that fails and we have a country, try with country
    if ((!pn || !pn.isValid()) && country) {
      pn = parsePhoneNumberFromString(cleaned, country as CountryCode);
    }
    
    if (!pn || !pn.isValid()) {
      throw new BadRequestException('Invalid phone number format');
    }
    
    return pn.number; // E.164 format
  }

  async sendCode(phoneRaw: string, country?: string) {
    this.ensureConfigured();
    const phone = this.normalizeToE164(phoneRaw, country);
    const res = await (twilioClient as Twilio).verify.v2
      .services(this.verifySid!)
      .verifications.create({ to: phone, channel: 'sms' });
    return { sid: res.sid, status: res.status };
  }

  async checkCode(phoneRaw: string, code: string, country?: string) {
    this.ensureConfigured();
    const phone = this.normalizeToE164(phoneRaw, country);
    if (!/^\d{4,8}$/.test(code)) {
      throw new BadRequestException('Invalid code');
    }
    const res = await (twilioClient as Twilio).verify.v2
      .services(this.verifySid!)
      .verificationChecks.create({ to: phone, code });
    return { status: res.status, valid: res.status === 'approved' };
  }
}
