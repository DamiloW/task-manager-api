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

    it('Deve bloquear a criação de tarefa com dados inválidos (Escudo do Zod)', async () => {
        const response = await request(app).post('/tasks').send({});

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
    });

    it('Deve dar erro ao tentar atualizar uma tarefa que não existe', async () => {
        const response = await request(app).put('/tasks/id-falso-123').send({
            completed: true
        });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
    });

    it('Deve dar erro ao tentar excluir uma tarefa que não existe', async () => {
        const response = await request(app).delete('/tasks/id-falso-123');

        expect(response.status).not.toBe(200);
        expect(response.body.status).toBe('error');

    });
});