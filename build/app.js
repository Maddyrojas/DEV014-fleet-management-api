"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taxis_1 = require("./models/taxis");
const app = (0, express_1.default)();
const PORT = 3001;
// app.use('/', (req: Request, res: Response): void => {
//     res.send('Hello world!');
// });
app.get('/taxis', (req, res) => {
    console.log("Hola");
    res.json((0, taxis_1.getTaxis)());
});
app.listen(PORT, () => {
    console.log('SERVER IS UP ON PORT:', PORT);
});
