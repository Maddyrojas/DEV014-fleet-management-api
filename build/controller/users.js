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
exports.deleteUser = exports.modifyUser = exports.createUser = exports.getUsers = void 0;
const userService_1 = require("../services/userService");
const bcrypt = require('bcrypt');
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const startIndex = (page - 1) * limit;
        const email = req.query.email;
        if (page < 0 || limit < 0) {
            return res.status(400).json({ message: "The page number and limit cannot be less than 0" });
        }
        const users = yield (0, userService_1.getAllUsers)(startIndex, limit, email);
        console.log(users);
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found, please change the email" });
        }
        else {
            return res.status(200).json(users);
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'error al obtener los usuarios' });
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, lastname, email, username, password, role } = req.body;
        if (!name || !lastname || !email || !username || !password || !role) {
            return res.status(400).json({ error: "The'name,lastName,email,userName,password,role' data are required" });
        }
        const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailFormat.test(email)) {
            return res.status(400).json({ error: "The email dont have correct format" });
        }
        const existingU = yield (0, userService_1.existingUser)(email, username);
        if (existingU) {
            return res.status(409).json({ error: "The user already exists" });
        }
        const salt = bcrypt.genSaltSync(10);
        const encriptPassword = bcrypt.hashSync(password, salt);
        const users = yield (0, userService_1.createUsers)(name, lastname, email, username, encriptPassword, role);
        return res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'error al crear los usuarios' });
    }
});
exports.createUser = createUser;
const modifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +(req.params.uid);
        const { name, lastname, role } = req.body;
        if (!id || id <= 0 || isNaN(id)) {
            return res.status(400).json({ error: "Error when typing the ID, please correct the ID" });
        }
        const existingU = yield (0, userService_1.existingUser)(id);
        if (!existingU) {
            return res.status(404).json({ error: "The user does not exist" });
        }
        if (!name || !lastname || !role) {
            return res.status(400).json({ error: "The'name,lastName,and role' data are required" });
        }
        const users = yield (0, userService_1.modifyUsers)(id, name, lastname, role);
        return res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'error al modificar los usuarios' });
    }
});
exports.modifyUser = modifyUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = +(req.params.uid);
        const { email } = req.body;
        const existingU = yield (0, userService_1.existingUser)(id);
        if (!existingU) {
            return res.status(404).json({ error: "The user does not exist" });
        }
        if (!id || id <= 0 || isNaN(id)) {
            return res.status(400).json({ error: "Error when typing the ID, please correct the ID" });
        }
        const users = yield (0, userService_1.deleteUsers)(id, email);
        return res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'error al eliminar los usuarios' });
    }
});
exports.deleteUser = deleteUser;
