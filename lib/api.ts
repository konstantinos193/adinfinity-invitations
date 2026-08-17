import axios from 'axios';
import type { CreateRsvpPayload, Invitation } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const api = axios.create({ baseURL: BASE });

// Uses native fetch so Next.js can cache + ISR-revalidate every 60 s
export async function getInvitation(slug: string): Promise<Invitation> {
  const res = await fetch(`${BASE}/invitations/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Invitation not found: ${slug}`);
  return res.json();
}

export async function submitRsvp(slug: string, payload: CreateRsvpPayload) {
  const { data } = await api.post(`/invitations/${slug}/rsvp`, payload);
  return data;
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
