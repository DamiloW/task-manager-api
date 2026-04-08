import request from 'supertest';
import { app } from '../server.js';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Task Routes API (E2E Authenticated)', () => {
    let token = '';
    let testUserId = '';
    const testEmail = `vitest_${Date.now()}@example.com`; 

    // Setup: Creates a temporary user and logs in to get the JWT token before tests run
    beforeAll(async () => {
        const createRes = await request(app).post('/users').send({
            name: 'Test Robot',
            email: testEmail,
            password: 'strongpassword123'
        });
        
        testUserId = createRes.body.data.id;

        const loginRes = await request(app).post('/login').send({
            email: testEmail,
            password: 'strongpassword123'
        });

        token = loginRes.body.token;
    });

    // Teardown: Cleans up the database by deleting the temporary user
    afterAll(async () => {
        // FIXED: Added the Authorization header so the server allows the deletion
        await request(app)
            .delete(`/users/${testUserId}`)
            .set('Authorization', `Bearer ${token}`);
    });

    it('should block access to tasks if JWT token is NOT provided (401 Unauthorized)', async () => {
        const response = await request(app).get(`/users/${testUserId}/tasks`);
        expect(response.status).toBe(401); 
    });

    it('should successfully create a task using a valid JWT token', async () => {
        const response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Vitest Test Task',
                description: 'Testing the E2E flow',
                userId: testUserId
            });

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data.title).toBe('Vitest Test Task');
    });

    it('should retrieve a paginated list of tasks for the authenticated user', async () => {
        const response = await request(app)
            .get(`/users/${testUserId}/tasks`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should block task creation with invalid data (Zod Validation Shield)', async () => {
        const response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({}); // Sending empty body to trigger Zod validation

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
    });
});