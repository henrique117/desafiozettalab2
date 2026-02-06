import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { server, setupServer } from '../server';
import prisma from '../lib/prisma';
import jwt from 'jsonwebtoken';

describe('Integração - Tasks', () => {
    let token: string;
    let userId: number;
    const TEST_EMAIL_DOMAIN = '@zetta.com';

    beforeAll(async () => {
        await setupServer();
        await server.ready();

        await prisma.task.deleteMany({
            where: {
                OR: [
                    { nome: { contains: 'Teste' } },
                    { nome: { contains: 'Automação' } }
                ]
            }
        });

        await prisma.user.deleteMany({
            where: {
                email: { contains: TEST_EMAIL_DOMAIN }
            }
        });

        const testUser = await prisma.user.create({
            data: {
                nome: "Henrique Teste",
                email: `test-${Date.now()}${TEST_EMAIL_DOMAIN}`,
                senha: "password_hash_real" 
            }
        });

        userId = testUser.id;

        const secret = process.env.JWT_SECRET || 'zetta';
        token = jwt.sign({ id: userId }, secret);
    });

    afterAll(async () => {
        await prisma.task.deleteMany({
            where: { authorId: userId }
        });

        await prisma.user.deleteMany({
            where: { id: userId }
        });
        
        await prisma.$disconnect();
        await server.close();
    });

    it('Deve criar uma tarefa com sucesso e salvar no banco', async () => {
        const response = await request(server.server)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: "Teste de Integração",
                descricao: "Testando fluxo completo",
                status: "pendente"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.status).toBe("pendente");
    });

    it('Deve filtrar tarefas por status usando query params (1 para concluída)', async () => {
        await prisma.task.create({
            data: {
                nome: "Teste Concluido",
                status: true,
                authorId: userId
            }
        });

        const response = await request(server.server)
            .get('/tasks')
            .query({ status: '1' })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        
        expect(response.body.every((t: any) => t.status === "concluida")).toBe(true);
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
        
        expect(response.body.message).toContain('caracteres inválidos');
        expect(response.body.message).toContain('pelo menos 3 caracteres');
    });
});