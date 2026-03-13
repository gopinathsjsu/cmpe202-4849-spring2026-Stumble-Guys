import { create } from 'zustand';
import { ticketApi, type PurchaseTicketsPayload } from '../api/ticketApi_Sasi';

interface TicketState {
  isLoading: boolean;
  lastPurchase: unknown | null;
  purchaseTickets: (eventId: string, payload: PurchaseTicketsPayload) => Promise<void>;
  rsvp: (eventId: string, status?: 'going' | 'interested' | 'not_going') => Promise<void>;
}

const useTicketStore = create<TicketState>((set) => ({
  isLoading: false,
  lastPurchase: null,

  purchaseTickets: async (eventId, payload) => {
    set({ isLoading: true });
    try {
      const data = await ticketApi.purchase(eventId, payload);
      set({ lastPurchase: data.data ?? data, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  rsvp: async (eventId, status) => {
    set({ isLoading: true });
    try {
      await ticketApi.rsvp(eventId, status);
      set({ isLoading: false });
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },
}));

export default useTicketStore;

