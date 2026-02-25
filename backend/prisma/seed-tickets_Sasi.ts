import prisma from '../src/config/database_Preetam';

async function main() {
  const event = await prisma.event.findFirst();
  if (!event) {
    console.log('No events found; skipping ticket seed.');
    return;
  }

  await prisma.ticketType.createMany({
    data: [
      {
        event_id: event.id,
        name: 'General Admission',
        price: 0,
        quantity: 100,
        description: 'Standard entry ticket',
      },
      {
        event_id: event.id,
        name: 'VIP',
        price: 25,
        quantity: 25,
        description: 'VIP ticket with perks',
      },
    ],
    skipDuplicates: true,
  });

  console.log('Ticket types seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

