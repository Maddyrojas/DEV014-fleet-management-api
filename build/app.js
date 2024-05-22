"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taxis_1 = require("./controller/taxis");
const trajectories_1 = require("./controller/trajectories");
const app = (0, express_1.default)();
const PORT = 3001;
app.use(express_1.default.json()); //middleware que transforma la req.body a un json
app.get('/taxis', taxis_1.getAllTaxis);
app.get('/taxis/:id', taxis_1.getUniqueTaxisById);
app.get('/trajectories/:id', trajectories_1.getTrajectoriesById);
app.get('/trajectories/search/:id', trajectories_1.lastTrajectory);
app.listen(PORT, () => {
    console.log('SERVER IS UP ON PORT:', PORT);
});
exports.default = app;
