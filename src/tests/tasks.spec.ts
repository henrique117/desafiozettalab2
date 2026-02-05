import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { server, setupServer } from '../server';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

describe('Integração - Tasks', () => {
    let token: string;

    beforeAll(async () => {
        await setupServer()
        await server.ready();
        const secret = process.env.JWT_SECRET || 'zetta';
        token = jwt.sign({ id: 1 }, secret);
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await server.close();
    });

    it('Deve criar uma tarefa com sucesso e salvar no banco', async () => {
        const response = await request(server.server)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: "Tarefa de Integração",
                descricao: "Testando fluxo completo",
                status: "pendente"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');

        const taskNoBanco = await prisma.task.findUnique({
            where: { id: response.body.id }
        });

        expect(taskNoBanco).not.toBeNull();
        expect(taskNoBanco?.nome).toBe("Tarefa de Integração");
    });

    it('Deve filtrar tarefas por status usando query params (1 para concluída)', async () => {
        await prisma.task.create({
            data: {
                nome: "Tarefa Concluida",
                status: true,
                authorId: 1
            }
        });

        const response = await request(server.server)
            .get('/tasks')
            .query({ status: '1' })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.every((t: any) => t.status === true)).toBe(true);
    });

    it('Deve retornar 400 ao tentar criar tarefa com nome inválido', async () => {
        const response = await request(server.server)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: "!",
                status: "pendente"
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('nome contém caracteres inválidos');
    });
});