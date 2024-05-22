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
exports.lastTrajectory = exports.getTrajectoriesById = void 0;
const trajectoriesService_1 = require("../services/trajectoriesService");
const getTrajectoriesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { date } = req.query;
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const startIndex = (page - 1) * limit;
        const searchDate = new Date(date);
        const taxiLocation = yield (0, trajectoriesService_1.getTaxiLocations)(id, searchDate, startIndex, limit);
        if (!taxiLocation) {
            return res.status(400).json({ message: 'los parametros taxiId y date son obligatorios en la consulta' });
        }
        else {
            return res.status(200).json(taxiLocation);
        }
        //return res.status(401).json({ message: "if there is no authentication header" });
        //return res.status(403).json({ message: "if the authentication token is not from an admin user" });
        //return res.status(404).json({ message: "No se encontraron usuarios" }); if (taxis.length === 0) 
    }
    catch (error) {
        return res.status(500).json({ message: 'Error en el servidor', error });
    }
});
exports.getTrajectoriesById = getTrajectoriesById;
const lastTrajectory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // muestra las ultimas localizaciones de todos los taxis
    /*{
        "taxiId": 7249,
        "plate": "CNCJ-2997",
        "date": "2008-02-08 17:36:33",
        "latitude": 116.291,
        "longitude": 39.88672
      },*/
    try {
        const { date } = req.query;
        const { id } = req.params;
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1);
        const trajectory = yield (0, trajectoriesService_1.getLastTaxiLocations)(id, endDate);
        if (!trajectory) {
            return res.status(404).json({ message: 'no se encontró ninguna trayectoria con el id proporcionado ' });
        }
        else {
            return res.status(200).json(trajectory);
        }
        //return res.status(401).json({ message: "if there is no authentication header" });
        //return res.status(403).json({ message: "if the authentication token is not from an admin user" });
        //return res.status(404).json({ message: "No se encontraron usuarios" }); if (taxis.length === 0) 
    }
    catch (error) {
        return res.status(500).json({ error: 'Error al obtener la ultima ubicacion de los taxis' });
    }
});
exports.lastTrajectory = lastTrajectory;
