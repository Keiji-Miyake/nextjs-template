import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function seed() {
  const hashedPassword = await bcrypt.hash("Password0", 10);

  try {
    // Register a record for Member
    const member = await prisma.member.create({
      data: {
        id: 'member01',
        email: 'member01@example.com',
        name: 'Member 01',
      },
    });

    // Register a record for User
    const user = await prisma.user.create({
      data: {
        memberId: 'member01',
        name: 'User 01',
        email: 'member01@example.com',
        password: hashedPassword,
        role: 'ROOT',
      },
    });

    console.log('Records created successfully:', member, user);
  } catch (error) {
    console.error('Error creating records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
