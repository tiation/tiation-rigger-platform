import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function main() {
  try {
    logger.info('🌱 Starting database seeding...');

    // Create default skills
    const skills = await Promise.all([
      prisma.skill.upsert({
        where: { name: 'Tower Crane Operation' },
        update: {},
        create: {
          name: 'Tower Crane Operation',
          description: 'Operation of tower cranes for construction projects',
          category: 'CRANE_OPERATIONS',
          verificationRequired: true,
        },
      }),
      prisma.skill.upsert({
        where: { name: 'Mobile Crane Operation' },
        update: {},
        create: {
          name: 'Mobile Crane Operation',
          description: 'Operation of mobile and crawler cranes',
          category: 'CRANE_OPERATIONS',
          verificationRequired: true,
        },
      }),
      prisma.skill.upsert({
        where: { name: 'Rigging & Slinging' },
        update: {},
        create: {
          name: 'Rigging & Slinging',
          description: 'Load rigging and slinging techniques',
          category: 'RIGGING_TECHNIQUES',
          verificationRequired: true,
        },
      }),
      prisma.skill.upsert({
        where: { name: 'Scaffolding Installation' },
        update: {},
        create: {
          name: 'Scaffolding Installation',
          description: 'Installation and dismantling of scaffolding systems',
          category: 'TECHNICAL_SKILLS',
          verificationRequired: true,
        },
      }),
      prisma.skill.upsert({
        where: { name: 'Height Safety' },
        update: {},
        create: {
          name: 'Height Safety',
          description: 'Working safely at heights and fall protection',
          category: 'SAFETY_PROTOCOLS',
          verificationRequired: true,
        },
      }),
    ]);

    logger.info(`✅ Created ${skills.length} skills`);

    // Create default certifications
    const certifications = await Promise.all([
      prisma.certification.upsert({
        where: { id: '1' },
        update: {},
        create: {
          name: 'High Risk Work Licence - Crane Operation',
          description: 'Australian high risk work licence for crane operation',
          issuingAuthority: 'Safe Work Australia',
          validityPeriod: 1825, // 5 years
        },
      }),
      prisma.certification.upsert({
        where: { id: '2' },
        update: {},
        create: {
          name: 'Construction Induction Training (White Card)',
          description: 'General construction induction training',
          issuingAuthority: 'Safe Work Australia',
          validityPeriod: null, // No expiry
        },
      }),
      prisma.certification.upsert({
        where: { id: '3' },
        update: {},
        create: {
          name: 'Working at Height Certification',
          description: 'Certification for working at heights safely',
          issuingAuthority: 'Safe Work Australia',
          validityPeriod: 1095, // 3 years
        },
      }),
      prisma.certification.upsert({
        where: { id: '4' },
        update: {},
        create: {
          name: 'Rigging Intermediate',
          description: 'Intermediate level rigging certification',
          issuingAuthority: 'Safe Work Australia',
          validityPeriod: 1825, // 5 years
        },
      }),
    ]);

    logger.info(`✅ Created ${certifications.length} certifications`);

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123!', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@riggerplatform.com' },
      update: {},
      create: {
        email: 'admin@riggerplatform.com',
        username: 'admin',
        firstName: 'Platform',
        lastName: 'Administrator',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        emailVerified: new Date(),
      },
    });

    logger.info('✅ Created admin user (email: admin@riggerplatform.com, password: admin123!)');

    // Create sample worker user
    const workerPassword = await bcrypt.hash('worker123!', 12);
    
    const workerUser = await prisma.user.upsert({
      where: { email: 'worker@riggerplatform.com' },
      update: {},
      create: {
        email: 'worker@riggerplatform.com',
        username: 'sampleworker',
        firstName: 'John',
        lastName: 'Rigger',
        passwordHash: workerPassword,
        role: 'WORKER',
        status: 'ACTIVE',
        emailVerified: new Date(),
        phoneNumber: '+61400123456',
        bio: 'Experienced rigger with 10+ years in construction industry',
        address: {
          street: '123 Construction Ave',
          suburb: 'Industrial Estate',
          city: 'Perth',
          state: 'WA',
          postcode: '6000',
          country: 'Australia',
        },
      },
    });

    // Connect worker with skills
    await prisma.user.update({
      where: { id: workerUser.id },
      data: {
        skills: {
          connect: [
            { id: skills[0].id }, // Tower Crane Operation
            { id: skills[2].id }, // Rigging & Slinging
            { id: skills[4].id }, // Height Safety
          ],
        },
        certifications: {
          connect: [
            { id: certifications[0].id }, // Crane Licence
            { id: certifications[1].id }, // White Card
            { id: certifications[2].id }, // Working at Height
          ],
        },
      },
    });

    logger.info('✅ Created sample worker user (email: worker@riggerplatform.com, password: worker123!)');

    // Create sample employer user
    const employerPassword = await bcrypt.hash('employer123!', 12);
    
    const employerUser = await prisma.user.upsert({
      where: { email: 'employer@riggerplatform.com' },
      update: {},
      create: {
        email: 'employer@riggerplatform.com',
        username: 'constructco',
        firstName: 'Construction',
        lastName: 'Manager',
        passwordHash: employerPassword,
        role: 'EMPLOYER',
        status: 'ACTIVE',
        emailVerified: new Date(),
        phoneNumber: '+61400654321',
        bio: 'Construction company manager seeking skilled riggers',
        address: {
          street: '456 Business Rd',
          suburb: 'CBD',
          city: 'Perth',
          state: 'WA',
          postcode: '6000',
          country: 'Australia',
        },
      },
    });

    logger.info('✅ Created sample employer user (email: employer@riggerplatform.com, password: employer123!)');

    // Create sample jobs
    const sampleJobs = await Promise.all([
      prisma.job.create({
        data: {
          title: 'Tower Crane Operator - High Rise Project',
          description: 'Seeking experienced tower crane operator for major high-rise construction project in Perth CBD. Must have current HRWL and minimum 5 years experience.',
          requirements: [
            'Current High Risk Work Licence for Crane Operation',
            'Minimum 5 years tower crane experience',
            'Construction White Card',
            'Excellent communication skills',
            'Ability to work at heights',
          ],
          location: {
            street: '789 Tower St',
            suburb: 'Perth CBD',
            city: 'Perth',
            state: 'WA',
            postcode: '6000',
            country: 'Australia',
            coordinates: {
              latitude: -31.9505,
              longitude: 115.8605,
            },
          },
          jobType: 'CRANE_OPERATION',
          urgencyLevel: 'HIGH',
          estimatedDuration: '6 months',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-08-01'),
          payType: 'DAILY',
          payAmount: 650,
          currency: 'AUD',
          safetyRequirements: [
            'Hard hat and safety boots mandatory',
            'High visibility clothing required',
            'Safety harness for heights',
            'Daily safety briefings attendance',
          ],
          status: 'OPEN',
          maxApplicants: 3,
          posterId: employerUser.id,
          requiredSkills: {
            connect: [{ id: skills[0].id }], // Tower Crane Operation
          },
          requiredCertifications: {
            connect: [
              { id: certifications[0].id }, // Crane Licence
              { id: certifications[1].id }, // White Card
            ],
          },
          publishedAt: new Date(),
        },
      }),
      prisma.job.create({
        data: {
          title: 'Rigger - Infrastructure Project',
          description: 'Join our team for a major infrastructure project. Looking for skilled riggers with load lifting and slinging experience.',
          requirements: [
            'Rigging certification (Intermediate or higher)',
            'Minimum 3 years rigging experience',
            'Construction White Card',
            'Physical fitness for manual work',
          ],
          location: {
            street: '321 Infrastructure Blvd',
            suburb: 'Midland',
            city: 'Perth',
            state: 'WA',
            postcode: '6056',
            country: 'Australia',
            coordinates: {
              latitude: -31.8957,
              longitude: 115.9936,
            },
          },
          jobType: 'RIGGING',
          urgencyLevel: 'MEDIUM',
          estimatedDuration: '3 months',
          startDate: new Date('2024-02-15'),
          payType: 'HOURLY',
          payAmount: 45,
          currency: 'AUD',
          safetyRequirements: [
            'PPE provided and mandatory',
            'Safety induction required',
            'Regular safety inspections',
          ],
          status: 'OPEN',
          maxApplicants: 5,
          posterId: employerUser.id,
          requiredSkills: {
            connect: [{ id: skills[2].id }], // Rigging & Slinging
          },
          requiredCertifications: {
            connect: [
              { id: certifications[1].id }, // White Card
              { id: certifications[3].id }, // Rigging Intermediate
            ],
          },
          publishedAt: new Date(),
        },
      }),
    ]);

    logger.info(`✅ Created ${sampleJobs.length} sample jobs`);

    // Create sample job application
    await prisma.jobApplication.create({
      data: {
        jobId: sampleJobs[0].id,
        applicantId: workerUser.id,
        coverLetter: 'I am an experienced tower crane operator with over 10 years in the construction industry. I have worked on several high-rise projects in Perth and am familiar with all safety protocols. I am available to start immediately.',
        proposedRate: 650,
        availability: 'Available immediately, flexible with overtime',
        status: 'PENDING',
      },
    });

    logger.info('✅ Created sample job application');

    // Create sample experience for worker
    await prisma.experience.create({
      data: {
        userId: workerUser.id,
        jobTitle: 'Senior Tower Crane Operator',
        company: 'ABC Construction Pty Ltd',
        description: 'Operated tower cranes on multiple high-rise residential and commercial projects. Maintained excellent safety record and coordinated with ground crews.',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2023-12-31'),
        location: 'Perth, WA',
        verified: true,
      },
    });

    logger.info('✅ Created sample work experience');

    logger.info('🎉 Database seeding completed successfully!');
    logger.info('');
    logger.info('=== DEFAULT USERS CREATED ===');
    logger.info('Admin: admin@riggerplatform.com / admin123!');
    logger.info('Worker: worker@riggerplatform.com / worker123!');
    logger.info('Employer: employer@riggerplatform.com / employer123!');
    logger.info('');

  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});