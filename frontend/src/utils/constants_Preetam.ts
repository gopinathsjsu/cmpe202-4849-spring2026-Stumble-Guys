/**
 * In dev, default to same-origin `/api/v1` so Vite proxies to the backend (see vite.config.ts).
 * That avoids CORS issues when the app is opened as http://127.0.0.1:5173 vs http://localhost:5173.
 * Set VITE_API_URL to override (e.g. production backend URL).
 */
export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1');

export const APP_NAME = 'EventHub';

export const ROLES = {
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
  ATTENDEE: 'attendee',
} as const;

export const EVENT_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending_approval',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export const TICKET_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  CHECKED_IN: 'checked_in',
} as const;

export const RSVP_STATUS = {
  GOING: 'going',
  MAYBE: 'maybe',
  NOT_GOING: 'not_going',
} as const;

export const DEFAULT_PAGE_SIZE = 20;

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];
export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS];
export type RsvpStatus = (typeof RSVP_STATUS)[keyof typeof RSVP_STATUS];
