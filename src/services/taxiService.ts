import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getTaxis = async (startIndex: number, limit: number, plate?: string) => {
  if (plate) {
    return await prisma.taxis.findMany({
      skip: startIndex,
      take: limit,
      where:{
        plate: {
          startsWith: plate,
        },
      }
    });
  } else {
    return await prisma.taxis.findMany({
      skip: startIndex,
      take: limit,
    });
  }
};