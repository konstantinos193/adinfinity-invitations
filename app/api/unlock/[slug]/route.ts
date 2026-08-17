import { NextResponse } from 'next/server';
import { unlockInvitation } from '@/lib/api';
import { accessCookieName, accessCookieOptions } from '@/lib/access-cookie';

/**
 * Verifies a PIN through the backend and stores the resulting token in an
 * httpOnly cookie.
 *
 * This runs server-side so the token never passes through client JS, which
 * keeps it out of reach of XSS and browser extensions.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let pin: unknown;
  try {
    ({ pin } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Μη έγκυρο αίτημα.' }, { status: 400 });
  }

  if (typeof pin !== 'string' || pin.length < 4) {
    return NextResponse.json({ error: 'Λάθος κωδικός.' }, { status: 401 });
  }

  try {
    const token = await unlockInvitation(slug, pin);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(accessCookieName(slug), token, accessCookieOptions);
    return res;
  } catch (err: unknown) {
    // Mirror the backend's status so the rate limit (429) stays visible to the
    // user instead of being flattened into a generic "wrong PIN".
    const status =
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: { status?: number } }).response?.status ===
        'number'
        ? (err as { response: { status: number } }).response.status
        : 401;

    return NextResponse.json(
      {
        error:
          status === 429
            ? 'Πολλές προσπάθειες. Δοκιμάστε ξανά σε λίγο.'
            : 'Λάθος κωδικός.',
      },
      { status },
    );
  }
}
