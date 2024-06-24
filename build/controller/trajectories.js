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
exports.lastTrajectory = exports.getTrajectoriesByIdDate = void 0;
const trajectoriesService_1 = require("../services/trajectoriesService");
const getTrajectoriesByIdDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.query.taxiId;
        const dateStr = req.query.date;
        if (!id || !dateStr) {
            return res.status(400).json({ message: 'The taxiId and date parameters are required in the query' });
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) { // Validar que la fecha es válida
            return res.status(400).json({ message: 'The date format is invalid' });
        }
        console.log(`Fecha recibida: ${date.toISOString()}`);
        const taxiLocation = yield (0, trajectoriesService_1.getTaxiLocations)(id, date);
        console.log(taxiLocation);
        if (taxiLocation.length === 0) {
            return res.status(404).json({ message: "No routes found for this taxiId, please correct the taxiId" });
        }
        else {
            return res.status(200).json(taxiLocation);
        }
        //return res.status(401).json({ message: "if there is no authentication header" });
        //return res.status(403).json({ message: "if the authentication token is not from an admin user" }); 
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
});
exports.getTrajectoriesByIdDate = getTrajectoriesByIdDate;
const lastTrajectory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trajectory = yield (0, trajectoriesService_1.getLastTaxisLocation)();
        return res.status(200).json(trajectory);
        //return res.status(401).json({ message: "if there is no authentication header" });
        //return res.status(403).json({ message: "if the authentication token is not from an admin user" });
        //return res.status(404).json({ message: "No se encontraron usuarios" }); if (taxis.length === 0) 
    }
    catch (error) {
        return res.status(500).json({ error: 'Error al obtener la ultima ubicacion de los taxis' });
    }
});
exports.lastTrajectory = lastTrajectory;
