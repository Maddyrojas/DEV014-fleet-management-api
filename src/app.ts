import express, { Application, Request, Response } from 'express';
import { getTaxis } from './models/taxis';

const app: Application = express();

const PORT: number = 3001;

// app.use('/', (req: Request, res: Response): void => {
//     res.send('Hello world!');
// });

app.get('/taxis', (req: Request, res: Response): void => {
    console.log("Hola");
    res.json(getTaxis());
});

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});

