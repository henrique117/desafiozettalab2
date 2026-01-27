import Fastify from 'fastify';
import cors from '@fastify/cors';
import userRoutes from './routes/user.route';

export const server = Fastify({ logger: true });

server.setErrorHandler((error, request, reply) => {
    server.log.error(error);

    reply.status(500).send({ message: 'Erro interno do servidor.' });
});

const start = async () => {

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