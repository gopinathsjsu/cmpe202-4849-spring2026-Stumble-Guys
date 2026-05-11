import { create } from 'zustand';
import { ticketApi, type PurchaseTicketData } from '../api/ticketApi_Sasi';

export interface UserRsvp {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  approval_status?: string;
  created_at: string;
  updated_at: string;
  event?: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    start_date: string;
    end_date: string;
    venue_name: string | null;
    city: string | null;
    image_url: string | null;
    is_free: boolean;
  };
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  sold_count: number;
  max_per_order?: number;
  sale_start?: string | null;
  sale_end?: string | null;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  event_id: string;
  ticket_type_id: string;
  status: string;
  payment_status?: string;
  qr_code: string | null;
  ticket_number?: string;
  purchase_date?: string;
  amount_paid?: number | string;
  checked_in_at: string | null;
  created_at: string;
  event?: {
    id: string;
    title: string;
    slug?: string;
    description?: string | null;
    start_date: string;
    end_date: string;
    venue_name: string | null;
    address?: string | null;
    city: string | null;
    cover_image: string | null;
    image_url?: string | null;
  };
  ticket_type?: TicketType;
}

interface TicketState {
  myTickets: Ticket[];
  myRsvps: UserRsvp[];
  ticketTypes: TicketType[];
  currentTicket: Ticket | null;
  isLoading: boolean;

  fetchMyTickets: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => Promise<void>;
  fetchTicketTypes: (eventId: string) => Promise<void>;
  purchaseTicket: (
    eventId: string,
    data: PurchaseTicketData
  ) => Promise<Ticket>;
  cancelTicket: (id: string) => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  fetchMyRsvps: () => Promise<void>;
}

const useTicketStore = create<TicketState>((set) => ({
  myTickets: [],
  myRsvps: [],
  ticketTypes: [],
  currentTicket: null,
  isLoading: false,

  fetchMyTickets: async (params) => {
    set({ isLoading: true });
    try {
      const data = await ticketApi.getMyTickets(params);
      set({ myTickets: data.data.tickets ?? data.data.data ?? data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchTicketTypes: async (eventId) => {
    set({ isLoading: true });
    try {
      const data = await ticketApi.getTicketTypes(eventId);
      set({ ticketTypes: data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  purchaseTicket: async (eventId, purchaseData) => {
    set({ isLoading: true });
    try {
      const data = await ticketApi.purchaseTicket(eventId, purchaseData);
      const raw = data.data;
      const newTickets = Array.isArray(raw) ? raw : raw ? [raw] : [];
      set((state) => ({
        myTickets: [...newTickets, ...state.myTickets],
        isLoading: false,
      }));
      return newTickets.length === 1 ? newTickets[0] : newTickets;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  cancelTicket: async (id) => {
    set({ isLoading: true });
    try {
      await ticketApi.cancelTicket(id);
      set((state) => ({
        myTickets: state.myTickets.map((t) =>
          t.id === id ? { ...t, status: 'cancelled' } : t
        ),
        currentTicket:
          state.currentTicket?.id === id
            ? { ...state.currentTicket, status: 'cancelled' }
            : state.currentTicket,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchTicketById: async (id) => {
    set({ isLoading: true });
    try {
      const data = await ticketApi.getTicketById(id);
      set({ currentTicket: data.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchMyRsvps: async () => {
    try {
      const data = await ticketApi.getMyRsvps();
      const raw = data.data;
      const list = Array.isArray(raw) ? raw : [];
      set({ myRsvps: list as UserRsvp[] });
    } catch (error) {
      throw error;
    }
  },
}));

export default useTicketStore;
