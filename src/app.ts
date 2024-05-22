import express, { Application, Request, Response } from 'express';
import { getAllTaxis } from './controller/taxis';
import { getTrajectoriesByIdDate, lastTrajectory } from './controller/trajectories';

const app: Application = express();

const PORT: number = 3001;
app.use(express.json());//middleware que transforma la req.body a un json

app.get('/taxis', getAllTaxis);
app.get('/taxis/:plate', getAllTaxis);
app.get('/taxi/trajectories', getTrajectoriesByIdDate);
app.get('/taxi/trajectories/last/:id', lastTrajectory);

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});

export default app;
