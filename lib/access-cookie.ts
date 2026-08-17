/**
 * Naming and options for the per-invitation unlock cookie.
 *
 * One cookie per slug so unlocking one invitation never grants access to
 * another, and httpOnly so the token can't be read by client JS.
 */
export function accessCookieName(slug: string) {
  // Slugs are URL path segments; strip anything that isn't cookie-name-safe.
  return `inv_${slug.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const accessCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: ACCESS_COOKIE_MAX_AGE,
};
