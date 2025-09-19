import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function findUserByUsername(username) {
  return await prisma.user.findUnique({
    where: { username },
  });
}

export async function findUserByEmail(email) { 
  return await prisma.user.findUnique({
    where: { useremail: email },
  });
}

export async function createUser({ username, email, hashedPassword }) {
  return await prisma.user.create({
    data: { username: username, useremail: email, userpassword: hashedPassword },
  });
}