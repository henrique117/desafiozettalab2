import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import userRoutes from './routes/user.route';
import { treeifyError, ZodError } from 'zod';

export const server = Fastify({ logger: true });

server.setErrorHandler((error: any, _, reply) => {
    server.log.error(error);

    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Erro de validação.',
            errors: treeifyError(error)
        });
    }

    if (error.validation) {
        return reply.status(400).send({
            message: 'Dados inválidos ou mal formatados.',
            details: error.validation
        });
    }

    reply.status(500).send({ 
        message: 'Ocorreu um erro interno. Tente novamente mais tarde.' 
    });
});

const start = async () => {

    await server.setValidatorCompiler(validatorCompiler);
    await server.setSerializerCompiler(serializerCompiler);

    await server.register(fastifyJwt, {
        secret: process.env.JWT_SECRET || 'zetta'
    });

    await server.register(cors, { 
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await server.register(userRoutes, { prefix: 'users' })

    try {
        await server.listen({
            port: Number(process.env.PORT) || 3000,
            host: '0.0.0.0'
        });

        console.log(`[INFO] 🚀 Servidor rodando na porta ${process.env.PORT}`);
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
}

start();