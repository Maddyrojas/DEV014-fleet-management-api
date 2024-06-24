import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
interface TaxiLocation {
  id: number;
  taxis: {
    plate: string | null;
  };
  latitude: number | null;
  longitude: number | null;
  date: Date | null;
}
export const getTaxiLocations = async (id: number, date: Date): Promise<TaxiLocation[]> => {
  try {
    return  await prisma.trajectories.findMany({
      select:{
        id: true,
        taxis: {
          select: {
            plate: true,
          }
        },
        latitude: true,
        longitude: true,
        date: true,
      },
      where: {
        taxi_id: id,
        date: {
          gte: new Date(date.setHours(0, 0, 0, 0)), // Medianoche del día especificado
          lt: new Date(date.setHours(24, 0, 0, 0)),  // Medianoche del día siguiente
        }
      },
      orderBy: {
        date: 'asc'
      }
    });
  }
  catch (error) {
    throw new Error(`Error fetching taxi locations: `);
  }
}
export const getLastTaxisLocation = async () => {
  try {
    return  await prisma.trajectories.findMany({
      select:{
        taxi_id: true,
        taxis: {
          select: {
            plate: true,
          }
        },
        date: true,
        latitude: true,
        longitude: true,
      },
      orderBy: {
        date: 'desc',
      },
      distinct: ["taxi_id"],
    });
  }
  catch (error) {
    return error;
  }
}