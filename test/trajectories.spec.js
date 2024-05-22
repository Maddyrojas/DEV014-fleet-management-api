"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('supertest');
const app_1 = __importDefault(require("../src/app"));
describe('GET /taxis', () => {
    it('should return trajectories for a specific taxi and date', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = '6418';
        const date = '2008-02-02';
        const response = yield request(app_1.default).get(`/trajectories/${id}?date=${date}`);
        expect(response.status).toBe(200);
        expect(response.Handler['content-type']).toEqual(expect.stringContaining('application/json'));
        expect(Array.isArray(response.body)).toBeTruthy();
    }));
    it('should return error for missing taxi ID or date', () => __awaiter(void 0, void 0, void 0, function* () {
        const id = '6418';
        const response = yield request(app_1.default).get(`/trajectories/${id}`);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'tanto id como Date son obligatorios' });
    }));
});
