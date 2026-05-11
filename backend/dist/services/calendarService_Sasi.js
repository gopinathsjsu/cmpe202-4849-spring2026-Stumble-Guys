"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarService = void 0;
class CalendarService {
    static generateICS(event) {
        const formatDate = (date) => {
            return date
                .toISOString()
                .replace(/[-:]/g, '')
                .replace(/\.\d{3}/, '');
        };
        const escapeText = (text) => {
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
        lines.push(`DTSTAMP:${formatDate(new Date())}`, 'END:VEVENT', 'END:VCALENDAR');
        return lines.join('\r\n');
    }
}
exports.CalendarService = CalendarService;
