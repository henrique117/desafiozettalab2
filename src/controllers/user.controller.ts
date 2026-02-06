import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput, LoginUserInput } from '../schemas/user.schema';
import { createUser, loginUser } from '../services/user.service';

export const handleUserRegister = async (
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
) => {
    try {
        const { senha, ...user } = await createUser(request.body);
        return reply.code(201).send(user);
    } catch (error) {
        return reply.code(401).send(error);
    }
}

export const handleUserLogin = async (
    request: FastifyRequest<{ Body: LoginUserInput }>, 
    reply: FastifyReply
) => {
    try {
        const { senha, ...user } = await loginUser(request.body);

        const token = request.server.jwt.sign({
            id: user.id,
            email: user.email,
            nome: user.nome
        }, {
            expiresIn: '7d'
        });

        return reply.send({ token, user: user });
    } catch (error) {
        return reply.code(401).send(error);
    }
}