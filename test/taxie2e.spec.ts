import request  from "supertest";
import app from "../src/app";
import jwt from 'jsonwebtoken';

const generateAuthToken = (email: string, pass: string) => {
  return jwt.sign({ email, pass }, 'your_secret_key', { expiresIn: '1h' });
};

describe('GET /taxis', () => {
  const authToken = generateAuthToken('mmrojasmoya@gmail.com', '1234');
  it('should return all taxis', async () => {
    const response = await request(app).get('/taxis').set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
  });
  it('should return specific taxis', async () => {
    const response = await request(app).get('/taxis?plate=M&page=2&limit=10').set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toEqual(expect.stringContaining('application/json'));
  });
  it('should return error for missing when page and limit are less than 0', async () => {
    const response = await request(app).get("/taxis?page=-1&limit=-9").set('Authorization', `Bearer ${authToken}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("The page number and limit cannot be less than 0");
  })
  it('should return error for missing when not found plate', async () => {
    const response = await request(app).get('/taxis?plate=1000').set('Authorization', `Bearer ${authToken}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No taxis found, please change the license plate number");
  });
});