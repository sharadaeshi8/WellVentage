export function resolveCountryFromCode(countryCode: string): string | undefined {
  if (countryCode.startsWith('+91')) return 'IN';
  if (countryCode.startsWith('+1')) return 'US';
  if (countryCode.startsWith('+44')) return 'GB';
  return undefined;
}

export function formatPhoneNumber(countryCode: string, phoneNumber: string): string {
  return `${countryCode} ${phoneNumber}`.trim();
}