import axios from 'axios';
import type { CreateRsvpPayload, InvitationResponse } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const api = axios.create({ baseURL: BASE });

/**
 * Fetches an invitation, optionally with a guest's unlock token.
 *
 * Without a token the request is shared across visitors, so it keeps the 60 s
 * ISR cache. With a token the response is specific to that guest and must
 * never be cached — a cached unlocked payload would be served to visitors who
 * never entered the PIN.
 */
export async function getInvitation(
  slug: string,
  accessToken?: string,
): Promise<InvitationResponse> {
  const res = await fetch(`${BASE}/invitations/${slug}`, {
    ...(accessToken
      ? {
          cache: 'no-store',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      : { next: { revalidate: 60 } }),
  });
  if (!res.ok) throw new Error(`Invitation not found: ${slug}`);
  return res.json();
}

export async function submitRsvp(
  slug: string,
  payload: CreateRsvpPayload,
  accessToken?: string,
) {
  const { data } = await api.post(`/invitations/${slug}/rsvp`, payload, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  return data;
}

/** Exchanges a PIN for a slug-scoped access token. */
export async function unlockInvitation(slug: string, pin: string) {
  const { data } = await api.post<{ token: string }>(
    `/invitations/${slug}/unlock`,
    { pin },
  );
  return data.token;
}

export interface CreateLeadPayload {
  coupleName: string;
  email: string;
  phone?: string;
  eventDate?: string;
  invitationType: 'MINI_WEBSITE' | 'VIDEO_PROSKLITIRIO' | 'VIDEO' | 'UNSURE';
  message?: string;
  /** Honeypot — must stay empty for real submissions. */
  website?: string;
}

export async function submitLead(payload: CreateLeadPayload) {
  const { data } = await api.post('/leads', payload);
  return data;
}

export async function adminLogin(email: string, password: string) {
  const { data } = await api.post<{ access_token: string }>('/auth/login', {
    email,
    password,
  });
  return data.access_token;
}

export function adminApi(token: string) {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
    headers: { Authorization: `Bearer ${token}` },
  });
}
