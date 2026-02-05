import { FastifyRequest, FastifyReply } from "fastify";
import { CreateTaskInput, GetTasksQuery, UpdateTaskInput } from "../schemas/task.schema";
import { createTask, deleteTask, getTasks, updateTask } from "../services/task.service";
import ITask from "../interfaces/Task.interface";

export const handleTaskCreate = async (
    request: FastifyRequest<{ Body: CreateTaskInput }>,
    reply: FastifyReply
) => {
    try {
        const { id: userId } = request.user as { id: number };

        const task: ITask = await createTask(request.body, userId);
        
        return reply.code(201).send(task);
    } catch (error: any) {
        const statusCode = error.message === 'Unauthorized' ? 403 : 400;
        return reply.code(statusCode).send(error);
    }
}

export const handleTaskDelete = async (
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
) => {
    try {
        const { id: taskId } = request.params;
        const { id: userId } = request.user as { id: number };

        const task: ITask = await deleteTask(taskId, userId);

        return reply.code(200).send(task);
    } catch (error: any) {
        const statusCode = error.message === 'Unauthorized' ? 403 : 400;
        return reply.code(statusCode).send({ message: error.message });
    }
}

export const handleTaskUpdate = async (
    request: FastifyRequest<{ 
        Params: { id: number }, 
        Body: UpdateTaskInput 
    }>,
    reply: FastifyReply
) => {
    try {
        const { id: taskId } = request.params;
        const { id: userId } = request.user as { id: number };

        const task = await updateTask(taskId, userId, request.body);

        return reply.code(200).send(task);
    } catch (error: any) {
        const statusCode = error.message === 'Unauthorized' ? 403 : 400;
        return reply.code(statusCode).send({ message: error.message });
    }
};

export const handleTasksGet = async (
    request: FastifyRequest<{ Querystring: GetTasksQuery }>,
    reply: FastifyReply
) => {
    try {
        const { id: userId } = request.user as { id: number };
        const tasks = await getTasks(userId, request.query);
        return reply.code(200).send(tasks);
    } catch (error: any) {
        const statusCode = error.message === 'Unauthorized' ? 403 : 400;
        return reply.code(statusCode).send({ message: "Erro ao listar tarefas." });
    }
};