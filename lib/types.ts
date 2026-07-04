export type EventType = 'CEREMONY' | 'RECEPTION';
export type ContactRole = 'BRIDE' | 'GROOM' | 'BEST_MAN' | 'MAID_OF_HONOR' | 'FATHER' | 'MOTHER' | 'GODFATHER' | 'GODMOTHER' | 'HOST';
export type InvitationStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED';
export type InvitationType = 'MINI_WEBSITE' | 'VIDEO' | 'VIDEO_PROSKLITIRIO';
export type EventCategory = 'WEDDING' | 'BAPTISM' | 'WEDDING_BAPTISM' | 'ANNIVERSARY' | 'BIRTHDAY' | 'EVENT';
export type DietaryType = 'NONE' | 'VEGAN' | 'VEGETARIAN';

export interface Event {
  id: string;
  type: EventType;
  name: string;
  date: string;
  address: string | null;
  mapsUrl: string | null;
}

export interface Contact {
  id: string;
  role: ContactRole;
  name: string;
  phone: string | null;
  email: string | null;
}

export interface GiftRegistry {
  id: string;
  ownerName: string;
  bankName: string | null;
  iban: string;
}

export interface Invitation {
  id: string;
  slug: string;
  eventCategory: EventCategory;
  // Wedding fields
  brideName: string | null;
  groomName: string | null;
  // Baptism fields
  childName: string | null;
  fatherName: string | null;
  motherName: string | null;
  // Anniversary/Birthday/Event fields
  eventTitle: string | null;
  honoreeName: string | null;
  hostName: string | null;
  yearsCount: number | null;
  // Shared event date
  weddingDate: string | null;
  story: string | null;
  videoUrl: string | null;
  coverImageUrl: string | null;
  coverImages: string[];
  galleryImages: string[];
  primaryColor: string | null;
  fontFamily: string | null;
  fontColor: string | null;
  backgroundStyle: string | null;
  musicUrl: string | null;
  status: InvitationStatus;
  invitationType: InvitationType;
  rsvpDeadline: string | null;
  createdAt: string | null;
  events: Event[];
  contacts: Contact[];
  giftRegistries: GiftRegistry[];
}

export interface CreateRsvpPayload {
  guestName: string;
  phone?: string;
  attending: boolean;
  adultCount?: number;
  hasChildren?: boolean;
  childCount?: number;
  dietary?: DietaryType;
  hasAllergy?: boolean;
  allergyNote?: string;
  message?: string;
}
