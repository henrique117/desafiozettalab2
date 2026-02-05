import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import authenticate from "../middlewares/auth.middleware";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";
import { handleTaskCreate, handleTaskDelete, handleTaskUpdate } from "../controllers/task.controller";
import z from "zod";

const taskRoutes = async (server: FastifyInstance) => {
    const serverWithZod = server.withTypeProvider<ZodTypeProvider>();

    server.addHook('onRequest', authenticate)

    serverWithZod.post('/', {
        schema: {
            body: createTaskSchema
        }
    }, handleTaskCreate);

    serverWithZod.delete('/:id', {
        schema: {
            params: z.object({
                id: z.coerce.number({ message: "O ID deve ser um número válido." })
            })
        }
    }, handleTaskDelete);

    serverWithZod.patch('/:id', {
        schema: {
            params: z.object({
                id: z.coerce.number({ message: "O ID deve ser um número válido." })
            }),
            body: updateTaskSchema
        }
    }, handleTaskUpdate);
}

export default taskRoutes;