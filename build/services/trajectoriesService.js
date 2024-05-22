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
exports.getLastTaxiLocations = exports.getTaxiLocations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTaxiLocations = (id, searchDate, startIndex, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.trajectories.findMany({
            skip: startIndex,
            take: limit,
            where: {
                taxiId: parseInt(id),
                date: {
                    gte: searchDate, // Fecha mayor o igual a la fecha especificada // todas las ubis que sean >= a la fecha
                    lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000) // Fecha menor a 24 horas después de la fecha especificada
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
});
exports.getTaxiLocations = getTaxiLocations;
const getLastTaxiLocations = (id, searchDate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.trajectories.findMany({
            select: {
                latitude: true,
                longitude: true,
                date: true,
                taxiId: true,
                id: true
            },
            where: {
                taxiId: parseInt(id),
                date: searchDate,
            },
        });
    }
    catch (error) {
        return error;
    }
});
exports.getLastTaxiLocations = getLastTaxiLocations;
