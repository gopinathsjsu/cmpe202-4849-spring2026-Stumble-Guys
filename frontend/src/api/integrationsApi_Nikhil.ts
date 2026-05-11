import axiosClient from './axiosClient_Pratham';

export interface GoogleCalendarStatus {
  connected: boolean;
  configured: boolean;
}

export interface PushGoogleCalendarResult {
  htmlLink: string | null;
}

export const integrationsApi = {
  getGoogleCalendarStatus: async () => {
    const response = await axiosClient.get('/integrations/google-calendar/status');
    return response.data as {
      success: boolean;
      data: GoogleCalendarStatus;
    };
  },

  getGoogleCalendarAuthUrl: async () => {
    const response = await axiosClient.get('/integrations/google-calendar/connect');
    return response.data as {
      success: boolean;
      data: { authUrl: string };
    };
  },

  disconnectGoogleCalendar: async () => {
    const response = await axiosClient.post('/integrations/google-calendar/disconnect');
    return response.data as { success: boolean };
  },

  pushEventToGoogleCalendar: async (eventId: string) => {
    const response = await axiosClient.post(
      `/integrations/google-calendar/events/${eventId}`
    );
    return response.data as {
      success: boolean;
      data: PushGoogleCalendarResult;
    };
  },
};
