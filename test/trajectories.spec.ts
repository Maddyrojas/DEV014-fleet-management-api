const request = require('supertest');
import app from "../src/app";

describe('GET /taxis', ()=>{
    it('should return trajectories for a specific taxi and date', async () => {
        const id = '6418';
        const date = '2008-02-02';
        const response = await request(app).get(`/trajectories/${id}?date=${date}`);
        expect(response.status).toBe(200);
        expect(response.Handler['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(Array.isArray(response.body)).toBeTruthy();

    });
    it('should return error for missing taxi ID or date', async () => {
        const id = '6418';
        const response = await request(app).get(`/trajectories/${id}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({message: 'tanto id como Date son obligatorios'});
    })
});