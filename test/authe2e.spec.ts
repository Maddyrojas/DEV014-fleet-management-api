import request from 'supertest';
import app from "../src/app";

describe('POST /auth', () => {
  it('should authenticate user and return JWT token', async () => {
    const response = await request(app).post('/auth/login').send({
        email: 'mmrojasmoya@gmail.com',
        password: '1234',
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
  it('should return 404 when user does not exist', async () => {
    const response = await request(app).post('/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password'
    });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found, please check your credentials');
  });
  it('should return 401 when password is incorrect', async () => {
    const response = await request(app).post('/auth/login').send({
        email: 'denis@gmail.com',
        password: 'wrongpassword'
    });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });
  it('should return 400 when email or password is missing', async () => {
    const response = await request(app).post('/auth/login').send({
        email: 'test@gmail.com'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Email and password are required');
  });
});