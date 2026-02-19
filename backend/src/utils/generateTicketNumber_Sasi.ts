import { randomUUID } from 'crypto';

export function generateTicketNumber(): string {
  // Short, unique-enough identifier for demo use.
  return `TKT-${randomUUID().replaceAll('-', '').slice(0, 12).toUpperCase()}`;
}

