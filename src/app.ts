import express, { Application, Request, Response } from 'express';
import { getAllTaxis } from './controller/taxis';
import { getTrajectoriesByIdDate, lastTrajectory, exportTrajectory } from './controller/trajectories';
import { createUser, getUsers, modifyUser, deleteUser } from './controller/users';
import { createAuth } from './controller/auth';
import { authenticateJWT } from './middleware/authMiddleware';

const app: Application = express();
app.use(express.json());//middleware que transforma la req.body a un json
//user
app.post('/users', createUser);
app.get('/users', getUsers);
app.patch('/users/:uid',authenticateJWT, modifyUser);
app.delete('/users/:uid',authenticateJWT, deleteUser);
//taxis
app.get('/taxis', authenticateJWT, getAllTaxis);
//trajectories
app.get('/trajectories', authenticateJWT, getTrajectoriesByIdDate);
app.get('/trajectories/latest',authenticateJWT, lastTrajectory);
app.get('/trajectories/export',authenticateJWT, exportTrajectory);
//auth
app.post('/auth/login', createAuth);
export default app;
