// Database seed file for initial data
import { PrismaClient } from './generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create POCs (Points of Care)
  const poc1 = await prisma.pOC.upsert({
    where: { pocId: 'POC001' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      pocId: 'POC001',
      name: 'Community Health Center A'
    }
  });

  const poc2 = await prisma.pOC.upsert({
    where: { pocId: 'POC002' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      pocId: 'POC002',
      name: 'Mobile Clinic B'
    }
  });

  const poc3 = await prisma.pOC.upsert({
    where: { pocId: 'POC003' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      pocId: 'POC003',
      name: 'Rural Health Post C'
    }
  });

  // Create Doctors
  const doctor1 = await prisma.doctor.upsert({
    where: { hospitalId: 'HOSP001' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      hospitalId: 'HOSP001',
      name: 'Dr. Sarah Johnson'
    }
  });

  const doctor2 = await prisma.doctor.upsert({
    where: { hospitalId: 'HOSP002' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      hospitalId: 'HOSP002',
      name: 'Dr. Michael Chen'
    }
  });

  const doctor3 = await prisma.doctor.upsert({
    where: { hospitalId: 'HOSP003' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      hospitalId: 'HOSP003',
      name: 'Dr. Priya Sharma'
    }
  });

  // Create Migrants
  const migrant1 = await prisma.migrant.upsert({
    where: { athidhiId: 'ATH001' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      athidhiId: 'ATH001',
      phoneNumber: '+919876543210',
      name: 'Rajesh Kumar',
      gender: 'Male',
      dob: new Date('1985-03-15'),
      address: 'Village A, District B, State C',
      pocId: poc1.id
    }
  });

  const migrant2 = await prisma.migrant.upsert({
    where: { athidhiId: 'ATH002' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      athidhiId: 'ATH002',
      phoneNumber: '+919876543211',
      name: 'Priya Singh',
      gender: 'Female',
      dob: new Date('1990-07-22'),
      address: 'Village D, District E, State F',
      pocId: poc2.id
    }
  });

  const migrant3 = await prisma.migrant.upsert({
    where: { athidhiId: 'ATH003' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      athidhiId: 'ATH003',
      phoneNumber: '+919876543212',
      name: 'Amit Patel',
      gender: 'Male',
      dob: new Date('1988-11-08'),
      address: 'Village G, District H, State I',
      pocId: poc3.id
    }
  });

  // Create Health Records
  await prisma.healthRecord.upsert({
    where: { id: 'HR001' },
    update: {},
    create: {
      id: 'HR001',
      migrantId: migrant1.id,
      pocId: poc1.id,
      doctorId: doctor1.id,
      symptoms: 'Fever, cough, body ache',
      diagnosis: 'Viral infection',
      prescription: 'Paracetamol 500mg, rest for 3 days',
      isNotifiable: false
    }
  });

  await prisma.healthRecord.upsert({
    where: { id: 'HR002' },
    update: {},
    create: {
      id: 'HR002',
      migrantId: migrant2.id,
      pocId: poc2.id,
      doctorId: doctor2.id,
      symptoms: 'Severe headache, nausea, high fever',
      diagnosis: 'Suspected dengue',
      prescription: 'Blood test required, hospitalization advised',
      isNotifiable: true
    }
  });

  await prisma.healthRecord.upsert({
    where: { id: 'HR003' },
    update: {},
    create: {
      id: 'HR003',
      migrantId: migrant3.id,
      pocId: poc3.id,
      doctorId: doctor3.id,
      symptoms: 'Chest pain, shortness of breath',
      diagnosis: 'Cardiac evaluation needed',
      prescription: 'ECG, chest X-ray, cardiologist consultation',
      isNotifiable: false
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${await prisma.pOC.count()} POCs`);
  console.log(`Created ${await prisma.doctor.count()} Doctors`);
  console.log(`Created ${await prisma.migrant.count()} Migrants`);
  console.log(`Created ${await prisma.healthRecord.count()} Health Records`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
