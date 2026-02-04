import { FastifyRequest, FastifyReply } from "fastify";

const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
    } catch (error) {
        return reply.status(401).send({ message: "Token inválido ou não fornecido" });
    }
}

export default authenticate;