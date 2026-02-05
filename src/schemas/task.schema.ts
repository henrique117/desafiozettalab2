import z from "zod";

export const createTaskSchema = z.object({
    nome: z.string({ message: "O nome da tarefa deve ser um texto." })
        .min(3, "O nome da tarefa deve ter pelo menos 3 caracteres.")
        .max(25, "O nome da tarefa deve conter no máximo 25 caracteres.")
        .regex(/^[a-zA-Z0-9_ ]+$/, "O nome contém caracteres inválidos."),

    descricao: z.string({ message: "A descrição da tarefa deve ser um texto." })
        .max(191, "A descrição da tarefa deve conter no máximo 191 caracteres.")
        .optional(),

    status: z.union([
        z.enum(["pendente", "concluida"]),
        z.boolean()
    ])
    .transform((valor) => {
        if (typeof valor === 'boolean') return valor;
        
        if (typeof valor === 'string') {
            return valor.toLowerCase() === "concluida";
        }
        
        return false;
    })
    .default(false)
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
    nome: z.string({ error: "O nome da tarefa deve ser um texto." })
        .min(3, "O nome da tarefa deve ter pelo menos 3 caracteres.")
        .max(25, "O nome da tarefa deve conter no máximo 25 caracteres.")
        .regex(/^[a-zA-Z0-9_ ]+$/, "O nome contém caracteres inválidos.")
        .optional(),

    descricao: z.string({ error: "A descrição da tarefa deve ser um texto." })
        .max(191, "A descrição da tarefa deve conter no máximo 191 caracteres.")
        .optional(),

    status: z.union([
        z.enum(["pendente", "concluida"]),
        z.boolean()
    ])
    .optional()
    .transform((valor: any) => {
        if (valor instanceof String && valor.toLocaleLowerCase("concluido") || valor == true) return true;
        return false;
    })
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;