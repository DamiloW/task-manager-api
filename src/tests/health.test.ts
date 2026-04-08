import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server.js';

describe('Health Check Route', () => {
  
  it('should return 200 and a success message on /ping', async () => {
    // Simulates a GET request to the /ping endpoint without starting the server
    const response = await request(app).get('/ping');

    // Assertions to guarantee the API is alive and returning the expected format
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'API is running smoothly 🚀');
  });

});