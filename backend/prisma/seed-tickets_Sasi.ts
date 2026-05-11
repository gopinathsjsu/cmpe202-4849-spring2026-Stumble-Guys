import { PrismaClient, Event, User } from '@prisma/client';

const prisma = new PrismaClient();

interface TicketTypeTemplate {
  name: string;
  priceMultiplier: number;
  quantityRatio: number;
  description: string;
}

const ticketTypeTemplates: TicketTypeTemplate[] = [
  {
    name: 'General Admission',
    priceMultiplier: 1.0,
    quantityRatio: 0.6,
    description: 'Standard entry with full access to the event.',
  },
  {
    name: 'VIP',
    priceMultiplier: 2.5,
    quantityRatio: 0.15,
    description: 'Premium access with reserved seating, priority entry, and exclusive perks.',
  },
  {
    name: 'Early Bird',
    priceMultiplier: 0.7,
    quantityRatio: 0.25,
    description: 'Limited discounted tickets for early registrants.',
  },
];

function generateTicketNumber(index: number): string {
  return `EVT-2026-${String(index).padStart(5, '0')}`;
}

async function seedTicketTypes(events: Event[]) {
  console.log('🎫 Seeding ticket types...');

  const createdTypes = [];

  for (const event of events) {
    const isFree = event.is_free;
    const basePrice = Number(event.price);

    for (const template of ticketTypeTemplates) {
      if (isFree && template.name !== 'General Admission') continue;

      const price = isFree ? 0 : basePrice * template.priceMultiplier;
      const quantity = Math.max(
        5,
        Math.floor(event.capacity * template.quantityRatio)
      );

      const ticketType = await prisma.ticketType.create({
        data: {
          event_id: event.id,
          name: template.name,
          price,
          quantity,
          sold_count: 0,
          description: template.description,
        },
      });
      createdTypes.push(ticketType);
    }
  }

  console.log(`🎫 Created ${createdTypes.length} ticket types.\n`);
  return createdTypes;
}

async function seedPurchasedTickets(events: Event[], users: User[]) {
  console.log('🎟️  Seeding purchased tickets...');

  const attendees = users.filter((u) => u.role === 'attendee');
  const organizers = users.filter((u) => u.role === 'organizer');
  const allBuyers = [...attendees, ...organizers];

  const eligibleEvents = events.filter((e) =>
    ['approved', 'completed'].includes(e.status)
  );

  const createdTickets = [];
  let ticketCounter = 1;

  for (const event of eligibleEvents) {
    const ticketTypes = await prisma.ticketType.findMany({
      where: { event_id: event.id },
    });

    if (ticketTypes.length === 0) continue;

    const isCompleted = event.status === 'completed';
    const buyerCount = isCompleted
      ? Math.min(allBuyers.length, Math.floor(Math.random() * 4) + 2)
      : Math.min(allBuyers.length, Math.floor(Math.random() * 5) + 1);

    const shuffledBuyers = [...allBuyers].sort(() => Math.random() - 0.5);
    const selectedBuyers = shuffledBuyers.slice(0, buyerCount);

    for (const buyer of selectedBuyers) {
      const ticketType =
        ticketTypes[Math.floor(Math.random() * ticketTypes.length)];

      const isCancelled = Math.random() < 0.1;
      const status = isCancelled ? 'cancelled' : 'confirmed';
      const paymentStatus = isCancelled ? 'refunded' : 'completed';

      const purchaseDate = new Date(event.created_at);
      purchaseDate.setDate(
        purchaseDate.getDate() + Math.floor(Math.random() * 14) + 1
      );

      const ticket = await prisma.ticket.create({
        data: {
          ticket_type_id: ticketType.id,
          event_id: event.id,
          user_id: buyer.id,
          ticket_number: generateTicketNumber(ticketCounter),
          status,
          qr_code: `qr_${event.slug}_${buyer.id.slice(0, 8)}_${ticketCounter}`,
          purchase_date: purchaseDate,
          amount_paid: Number(ticketType.price),
          payment_status: paymentStatus,
        },
      });

      if (status === 'confirmed') {
        await prisma.ticketType.update({
          where: { id: ticketType.id },
          data: { sold_count: { increment: 1 } },
        });
      }

      createdTickets.push(ticket);
      ticketCounter++;
    }
  }

  // Ensure we hit 50+ tickets by adding extra purchases for popular events
  const popularEvents = eligibleEvents.filter(
    (e) => e.capacity >= 200 && !e.is_free
  );

  while (createdTickets.length < 55 && popularEvents.length > 0) {
    const event =
      popularEvents[Math.floor(Math.random() * popularEvents.length)];
    const buyer = attendees[Math.floor(Math.random() * attendees.length)];

    const ticketTypes = await prisma.ticketType.findMany({
      where: { event_id: event.id },
    });

    if (ticketTypes.length === 0) continue;

    const ticketType =
      ticketTypes[Math.floor(Math.random() * ticketTypes.length)];

    const existing = await prisma.ticket.findFirst({
      where: {
        event_id: event.id,
        user_id: buyer.id,
        ticket_type_id: ticketType.id,
      },
    });

    if (existing) continue;

    const purchaseDate = new Date(event.created_at);
    purchaseDate.setDate(
      purchaseDate.getDate() + Math.floor(Math.random() * 14) + 1
    );

    const ticket = await prisma.ticket.create({
      data: {
        ticket_type_id: ticketType.id,
        event_id: event.id,
        user_id: buyer.id,
        ticket_number: generateTicketNumber(ticketCounter),
        status: 'confirmed',
        qr_code: `qr_${event.slug}_${buyer.id.slice(0, 8)}_${ticketCounter}`,
        purchase_date: purchaseDate,
        amount_paid: Number(ticketType.price),
        payment_status: 'completed',
      },
    });

    await prisma.ticketType.update({
      where: { id: ticketType.id },
      data: { sold_count: { increment: 1 } },
    });

    createdTickets.push(ticket);
    ticketCounter++;
  }

  const confirmed = createdTickets.filter((t) => t.status === 'confirmed').length;
  const cancelled = createdTickets.filter((t) => t.status === 'cancelled').length;

  console.log(
    `🎟️  Created ${createdTickets.length} tickets (${confirmed} confirmed, ${cancelled} cancelled).\n`
  );
  return createdTickets;
}

export async function seedTickets(events: Event[], users: User[]) {
  // Make the seed re-runnable in dev without unique collisions.
  // Tickets reference ticket types, so delete tickets first.
  await prisma.ticket.deleteMany({});
  await prisma.ticketType.deleteMany({});

  await seedTicketTypes(events);
  await seedPurchasedTickets(events, users);
}

export default seedTickets;
