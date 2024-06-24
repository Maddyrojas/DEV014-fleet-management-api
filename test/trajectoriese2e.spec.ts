import request  from "supertest";
import app from "../src/app";
import { sendEmail } from '../src/services/emailService';
import jwt from 'jsonwebtoken';

const generateAuthToken = (email: string, pass: string) => {
  return jwt.sign({ email, pass }, 'your_secret_key', { expiresIn: '1h' });
};
jest.mock('../src/services/emailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true), // Mock para resolver correctamente
}));

describe('GET /trajectories', ()=>{
    const authToken = generateAuthToken('mmrojasmoya@gmail.com', '1234');
    it('should return trajectories for a specific taxi and date', async () => {
        const response = await request(app).get(`/trajectories?taxiId=6418&date=02-02-2008`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });
    it('should return error for missing taxi ID or date', async () => {
        const response = await request(app).get(`/trajectories`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'The taxiId and date parameters are required in the query'});
    });
    it('should return error for missing in format of date', async () => {
        const response = await request(app).get(`/trajectories?taxiId=6418&date=mhu`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'The date format is invalid'});
    });
    it('should return error for missing in find trajectories', async () => {
        const response = await request(app).get(`/trajectories?taxiId=645210&date=02-02-2008`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(404);
        expect(response.body).toEqual({message: 'No routes found for this taxiId, please correct the taxiId'});
    });
});

describe ('GET /trajectories/latest', ()=>{
    const authToken = generateAuthToken('mmrojasmoya@gmail.com', '1234');
    it('should return latest trajectories for all taxis', async () =>{
        const response = await request(app).get('/trajectories/latest').set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
    });
});

describe('GET /trajectories/export', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Limpiar mocks después de cada prueba
    });
    const authToken = generateAuthToken('mmrojasmoya@gmail.com', '1234');
    it('should successfully export trajectories and send email', async () => {
       const validTaxiLocations = [
        {
          "id": 1,
          "taxis": {
              "plate": "GHGH-1458"
          },
          "latitude": 116.30508,
          "longitude": 39.96525,
          "date": "2008-02-02T14:22:40.000Z"
      },
      {
          "id": 2,
          "taxis": {
              "plate": "GHGH-1458"
          },
          "latitude": 116.3043,
          "longitude": 39.9622,
          "date": "2008-02-02T14:25:54.000Z"
      },
      {
          "id": 3,
          "taxis": {
              "plate": "GHGH-1458"
          },
          "latitude": 116.32259,
          "longitude": 39.96596,
          "date": "2008-02-02T14:30:55.000Z"
      }];
      // Mockear la función getTaxiLocations para devolver datos válidos
      jest.spyOn(require('../src/services/trajectoriesService'), 'getTaxiLocations').mockResolvedValue(validTaxiLocations);
      const response = await request(app).get(`/trajectories/export?taxiId=6418&date=2023-06-20&email=mmrojasmoya@gmail.com`).set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'The trajectories were sent correctly to your email' });
      expect(sendEmail).toHaveBeenCalledWith('mmrojasmoya@gmail.com', 6418, '2023-06-20', expect.any(String));//param
    });
    it('should return error for missing taxi ID or date', async () => {
      const response = await request(app).get(`/trajectories/export`).set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({message: 'The taxiId, email and date parameters are required in the query'});
    });
    it('should return error for missing in format of date', async () => {
        const response = await request(app).get(`/trajectories/export?taxiId=6418&date=mhu&email=mmrojasmoya@gmail.com`).set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'The date format is invalid'});
    });
  });