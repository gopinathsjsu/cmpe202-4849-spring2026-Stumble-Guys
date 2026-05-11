import { format, formatDistanceToNow, isSameYear, parseISO } from 'date-fns';

function toDate(date: string | Date): Date {
  return typeof date === 'string' ? parseISO(date) : date;
}

export function formatDate(date: string | Date): string {
  return format(toDate(date), 'MMM d, yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(toDate(date), "MMM d, yyyy 'at' h:mm a");
}

export function formatTime(date: string | Date): string {
  return format(toDate(date), 'h:mm a');
}

export function formatDateRange(
  start: string | Date,
  end: string | Date
): string {
  const startDate = toDate(start);
  const endDate = toDate(end);

  if (isSameYear(startDate, endDate)) {
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  }

  return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
}

export function getRelativeTime(date: string | Date): string {
  return formatDistanceToNow(toDate(date), { addSuffix: true });
}
