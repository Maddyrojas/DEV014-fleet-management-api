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
exports.deleteUsers = exports.modifyUsers = exports.existingUser = exports.createUsers = exports.getAllUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllUsers = (startIndex, limit, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield prisma.users.findMany({
            skip: startIndex,
            take: limit,
            where: {
                email: {
                    startsWith: email,
                },
            }
        });
    }
    else {
        return yield prisma.users.findMany({
            skip: startIndex,
            take: limit,
        });
    }
});
exports.getAllUsers = getAllUsers;
const createUsers = (name, lastName, email, userName, password, role) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.users.create({
            data: {
                name: name,
                lastname: lastName,
                email: email,
                username: userName,
                password: password,
                role: role,
            },
            select: {
                id: true,
                name: true,
                lastname: true,
                email: true,
                username: true,
                password: true,
                role: true,
            }
        });
    }
    catch (error) {
        return error;
    }
});
exports.createUsers = createUsers;
const existingUser = (uid, email, userName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.users.findFirst({
        where: {
            OR: [
                { id: uid },
                { email: email },
                { username: userName }
            ]
        }
    });
});
exports.existingUser = existingUser;
const modifyUsers = (uid, name, lastName, role) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.users.update({
        where: {
            id: uid,
        },
        data: {
            name: name,
            lastname: lastName,
            role: role,
        },
        select: {
            id: true,
            name: true,
            lastname: true,
            email: true,
            username: true,
            password: true,
            role: true,
        },
    });
});
exports.modifyUsers = modifyUsers;
const deleteUsers = (uid, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        try {
            return yield prisma.users.delete({
                where: {
                    email: email,
                }
            });
        }
        catch (error) {
            return { error: "email no correct" };
        }
    }
    else {
        try {
            return yield prisma.users.delete({
                where: {
                    id: uid,
                }
            });
        }
        catch (error) {
            return { error: "id no correct" };
        }
    }
});
exports.deleteUsers = deleteUsers;
