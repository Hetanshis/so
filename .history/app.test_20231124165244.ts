import request from 'supertest';
import express, { Express } from 'express';
import { AuthRoutes } from './src/routes/authRoutes';

import server from "./server"
// Mock AuthController to isolate the testing of AuthRoutes
describe("Test the root path", () => {
    test("It should response the GET method", done => {
      request(server)
        .get("/")
        .then(response => {
           
          expect(response.statusCode).toBe(200);
          done();
        });
    });
  });
