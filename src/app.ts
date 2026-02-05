import { setupServer, server } from "./server";

const start = async () => {
    try {
        await setupServer();

        await server.listen({
            port: Number(process.env.PORT) || 3000,
            host: '0.0.0.0'
        });

        console.log(`[INFO] 🚀 Servidor rodando na porta ${process.env.PORT || 3000}`);
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
}

start();