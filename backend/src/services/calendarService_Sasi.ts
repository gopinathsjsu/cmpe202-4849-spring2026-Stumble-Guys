export class CalendarService {
  static generateICS(event: {
    title: string;
    description: string;
    start_date: Date;
    end_date: Date;
    venue_name?: string | null;
    address?: string | null;
    city?: string | null;
  }): string {
    const formatDate = (date: Date): string => {
      return date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
    };

    const escapeText = (text: string): string => {
      return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
    };

    const location = [event.venue_name, event.address, event.city]
      .filter(Boolean)
      .join(', ');

    const uid = `${Date.now()}-${Math.random().toString(36).substring(2)}@eventhub.com`;

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EventHub//EventHub//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTART:${formatDate(new Date(event.start_date))}`,
      `DTEND:${formatDate(new Date(event.end_date))}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.description)}`,
    ];

    if (location) {
      lines.push(`LOCATION:${escapeText(location)}`);
    }

    lines.push(
      `DTSTAMP:${formatDate(new Date())}`,
      'END:VEVENT',
      'END:VCALENDAR'
    );

    return lines.join('\r\n');
  }
}
