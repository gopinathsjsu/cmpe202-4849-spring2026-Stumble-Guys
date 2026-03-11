import axiosClient from './axiosClient_Pratham';

export interface PurchaseTicketsPayload {
  ticket_type_id: string;
  quantity: number;
}

export const ticketApi = {
  purchase: async (eventId: string, payload: PurchaseTicketsPayload) => {
    const response = await axiosClient.post(`/events/${eventId}/tickets/purchase`, payload);
    return response.data;
  },

  rsvp: async (eventId: string, status: 'going' | 'interested' | 'not_going' = 'going') => {
    const response = await axiosClient.post(`/events/${eventId}/rsvp`, { status });
    return response.data;
  },
};

