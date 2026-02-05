import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import authenticate from "../middlewares/auth.middleware";
import { 
    createTaskSchema, 
    getTasksQuerySchema, 
    listTasksResponseSchema, 
    taskResponseSchema,
    updateTaskSchema 
} from "../schemas/task.schema";
import { 
    handleTaskCreate, 
    handleTaskDelete, 
    handleTasksGet, 
    handleTaskUpdate 
} from "../controllers/task.controller";
import z from "zod";

const taskRoutes = async (server: FastifyInstance) => {
    const serverWithZod = server.withTypeProvider<ZodTypeProvider>();

    server.addHook('onRequest', authenticate);

    serverWithZod.post('/', {
        schema: {
            body: createTaskSchema,
            response: {
                201: taskResponseSchema
            }
        }
    }, handleTaskCreate);

    serverWithZod.delete('/:id', {
        schema: {
            params: z.object({
                id: z.coerce.number({ message: "O ID deve ser um número válido." })
            }),
            response: {
                200: z.object({ message: z.string() })
            }
        }
    }, handleTaskDelete);

    serverWithZod.patch('/:id', {
        schema: {
            params: z.object({
                id: z.coerce.number({ message: "O ID deve ser um número válido." })
            }),
            body: updateTaskSchema,
            response: {
                200: taskResponseSchema
            }
        }
    }, handleTaskUpdate);

    serverWithZod.get('/', {
        schema: {
            querystring: getTasksQuerySchema,
            response: {
                200: listTasksResponseSchema
            }
        }
    }, handleTasksGet);
}

export default taskRoutes;