import { faker } from '@faker-js/faker';
import { PrismaClient, Role } from "@prisma/client";
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
        name: 'Root 01',
        email: 'member01@example.com',
        password: hashedPassword,
        role: 'ROOT',
      },
    });


    // ユーザーを150件作成
    // roleは、ROOT, ADMIN, USERの3種類
    // createdAtはfakerをつかってランダムな日時で。
    for (let i = 0; i < 150; i++) {
      await prisma.user.create({
        data: {
          memberId: 'member01',
          name: `User ${i}`,
          email: `user${i}@example.com`,
          password: hashedPassword,
          role: i < 10 ? Role.ROOT : i < 50 ? Role.ADMIN : Role.USER,
          createdAt: faker.date.past(),
        }
      });
    }

    console.log('Records created successfully:', member, user);
  } catch (error) {
    console.error('Error creating records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
