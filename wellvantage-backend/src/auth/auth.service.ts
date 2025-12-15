import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../users/schemas/user.schema';
import { IGym } from '../gyms/schemas/gym.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('User') private userModel: Model<IUser>,
    @InjectModel('Gym') private gymModel: Model<IGym>,
  ) {}

  async validateOAuthLogin(googleProfile: any) {
    const { googleId, email, firstName, lastName, profilePicture } = googleProfile;
    // Try to find existing user either by googleId or by email (to prevent duplicate email errors)
    let user = await this.userModel.findOne({ $or: [{ googleId }, { email }] });
    let isNew = false;
    if (!user) {
      // Create placeholder gym for new user until registration completes
      const gym = new this.gymModel({
        name: 'My Gym',
        ownerFirstName: firstName || 'Owner',
        ownerLastName: lastName || 'Name',
        addressLine1: 'TBD',
        city: 'TBD',
        state: 'TBD',
        country: 'TBD',
        phone: '0000000000',
        phoneVerified: false,
      });
      const savedGym = await gym.save();
      user = await this.userModel.create({
        email,
        googleId,
        firstName,
        lastName,
        profilePicture,
        gymId: savedGym._id,
        role: 'owner',
      });
      isNew = true;
    } else if (!user.googleId) {
      // Link Google account to existing email-based user
      user.googleId = googleId;
      if (!user.profilePicture) user.profilePicture = profilePicture;
      if (!user.firstName) user.firstName = firstName;
      if (!user.lastName) user.lastName = lastName;
      await user.save();
    }
    const tokens = this.issueTokens(user);
    return { ...tokens, isNew, user };
  }

  issueTokens(user: any) {
    const payload = { sub: String(user._id), gymId: String(user.gymId), role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken, user };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
