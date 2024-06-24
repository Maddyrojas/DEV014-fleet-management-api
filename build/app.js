"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taxis_1 = require("./controller/taxis");
const trajectories_1 = require("./controller/trajectories");
const users_1 = require("./controller/users");
const auth_1 = require("./controller/auth");
const app = (0, express_1.default)();
app.use(express_1.default.json()); //middleware que transforma la req.body a un json
//user
app.post('/users', users_1.createUser);
app.get('/users', users_1.getUsers);
app.patch('/users/:uid', users_1.modifyUser);
app.delete('/users/:uid', users_1.deleteUser);
//taxis
app.get('/taxis', taxis_1.getAllTaxis);
//trajectories
app.get('/trajectories', trajectories_1.getTrajectoriesByIdDate);
app.get('/trajectories/latest', trajectories_1.lastTrajectory);
//auth
app.post('/auth/login', auth_1.createAuth);
exports.default = app;
