import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { submitRsvp } from '@/lib/api';
import { accessCookieName } from '@/lib/access-cookie';

/**
 * Proxies an RSVP so the unlock token stays server-side.
 *
 * The token lives in an httpOnly cookie, so the client can't attach it itself.
 * Without this hop we'd have to hand the token to client JS and lose the
 * httpOnly protection.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Μη έγκυρο αίτημα.' }, { status: 400 });
  }

  const jar = await cookies();
  const token = jar.get(accessCookieName(slug))?.value;

  try {
    const data = await submitRsvp(slug, payload, token);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const status =
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as { response?: { status?: number } }).response?.status ===
        'number'
        ? (err as { response: { status: number } }).response.status
        : 500;

    return NextResponse.json(
      {
        error:
          status === 401
            ? 'Απαιτείται κωδικός πρόσκλησης.'
            : 'Δεν στάλθηκε η απάντηση. Δοκιμάστε ξανά.',
      },
      { status },
    );
  }
}
