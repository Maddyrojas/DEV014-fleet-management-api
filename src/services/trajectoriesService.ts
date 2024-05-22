import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getTaxiLocations = async (id: number, date: Date) => {
  try {
    return  await prisma.trajectories.findMany({
      select:{ //id, placa, latitud, longitud y timestamp (fecha y hora).
        id: true,
        taxis: {// como convertirlo a plate OJO
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
    return error;
  }
}
export const getLastTaxiLocations = async (id: string, searchDate: Date) => {
    try {
      return  await prisma.trajectories.findMany({
        select:{
            latitude: true,
            longitude: true,
            date: true,
            taxi_id: true,
            id: true
        },
        where: {
              taxi_id: parseInt(id),
              date: searchDate,
        },
      });
    }
    catch (error) {
        return error;
    }
}