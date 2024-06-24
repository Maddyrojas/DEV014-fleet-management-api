import request  from "supertest";
import app from "../src/app";
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const generateAuthToken = (email: string, pass: string) => {
    return jwt.sign({ email, pass }, 'your_secret_key', { expiresIn: '1h' });
};

jest.mock('@prisma/client', () => { // Crear un mock de PrismaClient
    const mPrismaClient = {
        users: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});
const prisma = new PrismaClient();

describe('GET /users', ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const authToken = generateAuthToken('mmrojasmoya@gmail.com', '1234');
    it('should return user for a specific email', async () => {
        const mockUser =[{id: 1, name: 'Denis', email: 'denis@gmail.com'}];
        (prisma.users.findMany as jest.Mock).mockResolvedValue(mockUser);
        const response = await request(app).get(`/users?id=1&&email=denis@gmail.com`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body).toEqual(mockUser);
    });
    it('should return error for an incorrect page or limit', async () => {
        const response = await request(app).get(`/users?limit=-1&page=-1`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'The page number and limit cannot be less than 0'});
    });
    it('should return error when no user exists', async () => {
        (prisma.users.findMany as jest.Mock).mockResolvedValue([]);
        const response = await request(app).get(`/users?email=developerno@gmail.com`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'No users found, please change the email'});
    });
});

describe('POST /users', ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const authToken = generateAuthToken('mmrojasmoya@gmail.com', '1234');
    it('should create a new user', async () => {
        const newUser = {
            name: "nam2",
            lastname: "nam2",
            email: "nam2@gmail.com",
            username: "nam2",
            password: "1234",
            role: "admin",
        };
        (prisma.users.create as jest.Mock).mockResolvedValue(newUser);
        const response = await request(app).post(`/users`).send(newUser).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(newUser);
    });

    it('should return error when not entry information required', async () => {
        const response = await request(app).post(`/users`).send({email: "nadi@gmail.com"}).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'The name,lastName,email,userName,password,role data are required'});
    });
    it('should return error when the email do not have correct format', async () => {
        const response = await request(app).post(`/users`).send({
            name: "Test",
            lastname: "Test",
            email: "testgmail",
            username: "test",
            password: "1234",
            role: "admin",
        }).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'The email dont have correct format'});
    });
    it('should return error when the user already exists', async () => {
        const mockUser = { id: 1, name: 'Denis', email: 'denis@gmail.com' };
        (prisma.users.findFirst as jest.Mock).mockResolvedValue(mockUser);
        const response = await request(app).post(`/users`).send({
            name: 'Denis',
            lastname: 'Denis',
            email: 'denis@gmail.com',
            username: 'denisolo',
            password: '1234',
            role: 'admin'
          }).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(409);
        expect(response.body).toEqual({message: 'The user already exists'});
    });
});

describe('DEL /users', ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const authToken = generateAuthToken('mmrojasmoya@gmail.com', '1234');
    it('should delete the user', async () => {
        (prisma.users.delete as jest.Mock).mockResolvedValue({ id: 14 });
        const response = await request(app).delete(`/users/14`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User deleted successfully" });
    });
    it('should return error for missing in format of ID', async () => {
        const response = await request(app).delete(`/users/-1`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Error when typing the ID, please correct the ID'});
    });
    it('should return error when user does not exist', async () => {
        (prisma.users.findFirst  as jest.Mock).mockResolvedValue(null);
        const response = await request(app).delete(`/users/9`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'The user does not exist'});
    });
});

describe('PATCH /users/:uid', ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const authToken = generateAuthToken('mmrojasmoya@gmail.com', '1234');
    it('should modify a user', async () => {
        const existingUser = { id: 1, name: "Denis", lastname: "Denis", role: "user" };
        const updatedUser = { id: 1, name: "Denis", lastname: "Denisy", role: "admin" };
        (prisma.users.findFirst as jest.Mock).mockResolvedValue(existingUser);
        (prisma.users.update as jest.Mock).mockResolvedValue(updatedUser);
        const response = await request(app).patch(`/users/1`).send(updatedUser).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedUser);
    });
    it('should return error when do not have a correct ID user', async () => {
        const response = await request(app).patch(`/users/-3`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'Error when typing the ID, please correct the ID'});
    });
    it('should return error when user does not exist', async () => {
        (prisma.users.findFirst  as jest.Mock).mockResolvedValue(null);
        const response = await request(app).patch(`/users/4`).send({
            name: "Denis",
            lastname: "Doe",
            role: "admin"
        }).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'The user does not exist'});
    });
    it('should return error when do not have information required', async () => {
        const existingUser = { id: 1, name: "Denis", lastname: "Denis", role: "user" };
        (prisma.users.findFirst as jest.Mock).mockResolvedValue(existingUser);
        const response = await request(app).patch(`/users/1`).send({name: "Denis"}).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'The name,lastName,and role data are required'});
    });
});