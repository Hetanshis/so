import request from 'supertest';
import express, { Express } from 'express';
import { AuthRoutes } from './src/routes/authRoutes';

// Mock AuthController to isolate the testing of AuthRoutes
jest.mock('./src/controller/authController', () => {
  const actualAuthController = jest.requireActual('./src/controller/authController');
  return {
    AuthController: jest.fn(() => ({
      signUp: actualAuthController.signUp,
      signIn: actualAuthController.signIn,
    })),
  };
});

describe('AuthRoutes', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    const authRoutes = new AuthRoutes();
    app.use('/auth', authRoutes.getRouter());
  });

  it('should handle POST /auth/signUp', async () => {
    const response = await request(app).post('/auth/signUp').send({
      // Add your signUp request payload here
    });

    expect(response.status).toBe(200); // Adjust status code based on your implementation
    // Add more assertions based on your implementation
  });

  it('should handle POST /auth/signIn', async () => {
    const response = await request(app).post('/auth/signIn').send({
      // Add your signIn request payload here
    });

    expect(response.status).toBe(200); // Adjust status code based on your implementation
    // Add more assertions based on your implementation
  });
});
