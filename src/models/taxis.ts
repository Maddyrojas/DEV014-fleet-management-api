import { Request, Response } from 'express';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const getTaxis = async() => {
    const taxisData = await prisma.taxis.findMany(
        {
            // cursor: {
            //     id: 6418,
            // },
            orderBy: {
                id: 'asc',
            },
        });
        return taxisData;
    
}

export {getTaxis}