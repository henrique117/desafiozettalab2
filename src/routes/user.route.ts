import { FastifyInstance } from 'fastify';
import { handleUserRegister, handleUserLogin } from '../controllers/user.controller';

const userRoutes = async (server: FastifyInstance) => {
    server.post('/register', handleUserRegister);
    server.post('/login', handleUserLogin);
}

export default userRoutes;