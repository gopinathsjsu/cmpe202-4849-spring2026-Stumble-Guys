/** Compact UTC datetime for Google Calendar URL `dates` parameter (YYYYMMDDTHHmmssZ). */
function toGoogleCalendarUtcPart(d: Date): string {
  return d.toISOString().replace(/\.\d{3}/, '').replace(/[:-]/g, '');
}

export function defaultEventEnd(startIso: string | Date, endIso?: string | Date | null): Date {
  if (endIso) return new Date(endIso);
  const s = new Date(startIso);
  return new Date(s.getTime() + 2 * 60 * 60 * 1000);
}

/**
 * Opens Google Calendar “create event” with fields prefilled (no OAuth).
 * Works for any user without server configuration.
 */
export function buildGoogleCalendarTemplateUrl(opts: {
  title: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  location?: string;
}): string {
  const start = new Date(opts.startDate);
  const end = new Date(opts.endDate);
  const dates = `${toGoogleCalendarUtcPart(start)}/${toGoogleCalendarUtcPart(end)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates,
    details: opts.description.slice(0, 8000),
  });
  if (opts.location?.trim()) {
    params.set('location', opts.location.trim());
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
