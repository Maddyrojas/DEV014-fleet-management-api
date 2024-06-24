"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastTaxisLocation = exports.getTaxiLocations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTaxiLocations = (id, date) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.trajectories.findMany({
            select: {
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
                    lt: new Date(date.setHours(24, 0, 0, 0)), // Medianoche del día siguiente
                }
            },
            orderBy: {
                date: 'asc'
            }
        });
    }
    catch (error) {
        throw new Error(`Error fetching taxi locations: `); //tengo el problema que no me deja usar error unkonw
    }
});
exports.getTaxiLocations = getTaxiLocations;
const getLastTaxisLocation = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.trajectories.findMany({
            select: {
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
});
exports.getLastTaxisLocation = getLastTaxisLocation;
