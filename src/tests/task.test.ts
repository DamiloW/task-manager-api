import request from 'supertest';
import { app } from '../server.js'
import { describe, it, expect } from 'vitest';

describe('Task Routes API', () => {
    it('Deve retornar uma lista vazia para um usuário sem tarefas', async () => {
        const response = await request(app).get('/users/id-falso-123/tasks');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toEqual([]);

    });
});