import { FastifyInstance } from 'fastify';
import { handleUserRegister, handleUserLogin } from '../controllers/user.controller';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

const userRoutes = async (server: FastifyInstance) => {
    const serverWithZod = server.withTypeProvider<ZodTypeProvider>();

    serverWithZod.post('/register', {
        schema: {
            body: createUserSchema
        }
    }, handleUserRegister);

    serverWithZod.post('/login', {
        schema: {
            body: loginUserSchema
        }
    }, handleUserLogin);
}

export default userRoutes;