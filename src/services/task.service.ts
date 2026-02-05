import ITask from "../interfaces/Task.interface";
import prisma from "../lib/prisma";
import { CreateTaskInput, UpdateTaskInput } from "../schemas/task.schema";

export const createTask = async (input: CreateTaskInput, userId: number): Promise<ITask> => {
    const { nome, descricao, status } = input;
    
    const tarefa: ITask = await prisma.task.create({
        data: {
            nome: nome,
            descricao: descricao ?? null,
            status: status,
            author: {
                connect: { id: userId }
            }
        }
    });

    return tarefa;
}

export const deleteTask = async (taskId: number, userId: number): Promise<ITask> => {
    const tarefa: ITask | null = await prisma.task.findFirst({
        where: {
            id: taskId,
            authorId: userId
        }
    });

    if (!tarefa) {
        throw new Error('Tarefa não encontrada ou permissão negada.');
    }

    await prisma.task.delete({
        where: { id: taskId }
    });

    return tarefa;
}

export const updateTask = async (taskId: number, userId: number, input: UpdateTaskInput): Promise<ITask> => {
    const tarefa: ITask | null = await prisma.task.findFirst({
        where: {
            id: taskId,
            authorId: userId
        }
    });

    if (!tarefa) {
        throw new Error('Tarefa não encontrada ou permissão negada.');
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
            nome: input.nome,
            descricao: input.descricao,
            status: input.status
        }
    });

    return updatedTask;
}