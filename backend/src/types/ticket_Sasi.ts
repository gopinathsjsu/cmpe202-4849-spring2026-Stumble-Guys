export type TicketStatus = 'confirmed' | 'cancelled' | 'refunded';

export interface PurchaseTicketInput {
  ticket_type_id: string;
  quantity: number;
}

export interface CancelTicketInput {
  reason?: string;
}

