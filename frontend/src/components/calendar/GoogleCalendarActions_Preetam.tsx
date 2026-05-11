import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, ExternalLink } from 'lucide-react';
import {
  buildGoogleCalendarTemplateUrl,
  defaultEventEnd,
} from '../../utils/googleCalendarUrl_Preetam';
import { integrationsApi } from '../../api/integrationsApi_Nikhil';
import { useAuth } from '../../hooks/useAuth_Preetam';
import { useToast } from '../shared/Toast_Sasi';
import Button from '../shared/Button_Preetam';

interface GoogleCalendarActionsProps {
  eventId: string;
  title: string;
  description: string;
  startDate: string | Date;
  endDate?: string | Date | null;
  location?: string;
}

const GoogleCalendarActions: React.FC<GoogleCalendarActionsProps> = ({
  eventId,
  title,
  description,
  startDate,
  endDate,
  location,
}) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [serverConfigured, setServerConfigured] = useState(false);
  const [pushing, setPushing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    integrationsApi
      .getGoogleCalendarStatus()
      .then((res) => {
        if (!cancelled) setServerConfigured(res.data?.configured ?? false);
      })
      .catch(() => {
        if (!cancelled) setServerConfigured(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const templateUrl = useMemo(() => {
    const end = defaultEventEnd(startDate, endDate);
    return buildGoogleCalendarTemplateUrl({
      title,
      description: description || title,
      startDate,
      endDate: end,
      location,
    });
  }, [title, description, startDate, endDate, location]);

  const connected = Boolean(user?.google_calendar_connected);

  const handlePush = async () => {
    setPushing(true);
    try {
      const res = await integrationsApi.pushEventToGoogleCalendar(eventId);
      const link = res.data?.htmlLink;
      toast.success('Event added to your Google Calendar');
      if (link) window.open(link, '_blank', 'noopener,noreferrer');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data
          ?.error?.message ?? 'Could not add to Google Calendar';
      toast.error(msg);
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
        <CalendarPlus className="h-4 w-4 text-orange-500" />
        Google Calendar
      </h3>
      <p className="mb-4 text-xs text-gray-500">
        Add this event to your calendar. Works without signing in (opens Google).
      </p>
      <div className="flex flex-col gap-2">
        <a
          href={templateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          Open in Google Calendar
        </a>

        {isAuthenticated && serverConfigured && connected && (
          <Button
            type="button"
            variant="primary"
            className="w-full"
            isLoading={pushing}
            onClick={handlePush}
          >
            Save to my Google Calendar
          </Button>
        )}

        {isAuthenticated && serverConfigured && !connected && (
          <p className="text-xs text-gray-600">
            <Link to="/profile" className="font-medium text-orange-600 hover:text-orange-700">
              Connect Google Calendar
            </Link>{' '}
            in your profile to save events with one click.
          </p>
        )}
      </div>
    </div>
  );
};

export default GoogleCalendarActions;
