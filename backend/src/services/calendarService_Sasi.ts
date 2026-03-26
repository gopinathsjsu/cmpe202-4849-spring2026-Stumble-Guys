export class CalendarService {
  static createIcs(params: {
    title: string;
    description?: string;
    start: Date;
    end: Date;
    location?: string;
  }) {
    const dt = (d: Date) => d.toISOString().replaceAll(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EventHub//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${params.title}`,
      params.description ? `DESCRIPTION:${params.description}` : null,
      params.location ? `LOCATION:${params.location}` : null,
      `DTSTART:${dt(params.start)}`,
      `DTEND:${dt(params.end)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean);

    return lines.join('\r\n');
  }
}

