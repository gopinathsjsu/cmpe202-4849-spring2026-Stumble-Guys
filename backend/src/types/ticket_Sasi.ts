export interface CreateTicketTypeInput {
  name: string;
  price?: number;
  quantity: number;
  description?: string;
}

export interface PurchaseTicketInput {
  ticket_type_id: string;
  quantity: number;
}

export interface TicketResponse {
  id: string;
  ticket_number: string;
  event: {
    id: string;
    title: string;
    start_date: Date;
    venue_name: string | null;
  };
  ticket_type: {
    id: string;
    name: string;
    price: number;
  };
  status: string;
  qr_code: string | null;
  purchase_date: Date;
  amount_paid: number;
  payment_status: string;
}

export interface RsvpInput {
  status: 'going' | 'maybe' | 'not_going';
}

export interface NotificationResponse {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  event_id?: string;
  sent_at: Date;
}
