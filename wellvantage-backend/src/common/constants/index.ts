export const COUNTRY_CODES = {
  IN: '+91',
  US: '+1',
  GB: '+44',
} as const;

export const JWT_CONSTANTS = {
  EXPIRATION: '7d',
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};