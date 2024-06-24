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
exports.createAuth = void 0;
const createAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const taxis = yield (0, authService_1.createToken)(email, password);
        console.log(taxis);
        if (taxis.length === 0) {
            return res.status(404).json({ message: "No taxis found, please change the license plate number" });
        }
        else {
            return res.status(200).json(taxis);
        }
        //return res.status(401).json({ message: "if there is no authentication header" });
        //return res.status(403).json({ message: "if the authentication token is not from an admin user" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'error al obtener los taxis' });
    }
});
exports.createAuth = createAuth;
const authService_1 = require("../services/authService");
