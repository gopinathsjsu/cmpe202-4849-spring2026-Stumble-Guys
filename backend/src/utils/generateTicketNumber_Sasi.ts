export function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000).toString();
  return `EVT-${year}-${random}`;
}
