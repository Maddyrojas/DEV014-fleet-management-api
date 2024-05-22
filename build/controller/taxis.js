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
exports.getUniqueTaxisById = exports.getAllTaxis = void 0;
const taxiService_1 = require("../services/taxiService");
const getAllTaxis = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const startIndex = (page - 1) * limit;
        const taxis = yield (0, taxiService_1.getTaxis)(startIndex, limit);
        if (!taxis) {
            return res.status(400).json({ message: "Bad Request" });
        }
        else {
            console.log("successful operation");
            return res.status(200).json(taxis);
        }
        //return res.status(401).json({ message: "if there is no authentication header" });
        //return res.status(403).json({ message: "if the authentication token is not from an admin user" });
        //return res.status(404).json({ message: "No se encontraron usuarios" }); if (taxis.length === 0) 
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'error al obtener los taxis' });
    }
});
exports.getAllTaxis = getAllTaxis;
const getUniqueTaxisById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +req.params.id;
        const taxis = yield (0, taxiService_1.getTaxisById)(id);
        if (!taxis) {
            return res.status(400).json({ message: "Bad Request" });
        }
        else {
            console.log("successful operation");
            return res.status(200).json(taxis);
        }
        //return res.status(401).json({ message: "if there is no authentication header" });
        //return res.status(403).json({ message: "if the authentication token is not from an admin user" });
        //return res.status(404).json({ message: "No se encontraron usuarios" }); if (taxis.length === 0) 
    }
    catch (error) {
        return res.status(500).json({ error: 'error al obtener los taxis' });
    }
});
exports.getUniqueTaxisById = getUniqueTaxisById;
