import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllUsers = async (startIndex: number, limit: number, email?: string) => {
  if (email) {
    return await prisma.users.findMany({
      skip: startIndex,
      take: limit,
      where:{
        email: {
          startsWith: email,
        },
      }
    });
  } else {
    return await prisma.users.findMany({
      skip: startIndex,
      take: limit,
    });
  }
};
export const createUsers = async (name: string, lastName: string, email: string, userName: string, password: string, role: string) => {
  try{
    return await prisma.users.create({
      data: {
        name: name,
        lastname: lastName,
        email: email,
        username: userName,
        password: password,
        role: role,
      },
      select: {
        id:true,
        name: true,
        lastname: true,
        email: true,
        username: true,
        password: true,
        role: true,
      }
    });
  }catch(error) {
    return error;
  }
};
export const existingUser = async(uid: number, email?: string) => {
  return await prisma.users.findFirst({
    where: {
      OR: [
        { email: email },
        { id: uid },
      ]
    }
  });
}
export const modifyUsers = async (uid: number, name: string, lastName: string, role: string) => {
  return await prisma.users.update({
    where: {
      id: uid,
    },
    data: {
      name: name,
      lastname: lastName,
      role: role,
    },
    select: {
      id:true,
      name: true,
      lastname: true,
      email: true,
      username: true,
      password: true,
      role: true,
    },
  });
 };
export const deleteUsers = async (uid: number, email?: string) => {
  if (email) {
    try{
      return await prisma.users.delete({
        where:{
          email: email,
        }
      });
    }catch (error){
      return {error: "email no correct"}
    }
  } else {
    try{
      return await prisma.users.delete({
        where:{
          id: uid,
        }
      });
    }catch (error) {
      return {error: "id no correct"}
    }
  }
};