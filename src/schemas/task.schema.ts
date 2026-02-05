import z from "zod";

const statusErrorMap = {
    error: "Status inválido. Use 'pendente' ou 'concluida'."
};

export const createTaskSchema = z.object({
    nome: z.string({ error: "O nome é obrigatório e deve ser um texto." })
        .min(3, "O nome da tarefa deve ter pelo menos 3 caracteres.")
        .max(25, "O nome da tarefa deve conter no máximo 25 caracteres.")
        .regex(/^[a-zA-Z0-9_ a-zA-ZÀ-ÿ ]+$/, "O nome contém caracteres inválidos."),

    descricao: z.string({ error: "A descrição deve ser um texto." })
        .max(191, "A descrição deve conter no máximo 191 caracteres.")
        .optional(),

    status: z.union([
        z.enum(["pendente", "concluida"], statusErrorMap),
        z.boolean({ error: "O status deve ser verdadeiro ou falso." })
    ], { error: "O formato do status está incorreto." })
        .transform((valor) => {
            if (typeof valor === 'boolean') return valor;
            if (typeof valor === 'string') return valor.toLowerCase() === "concluida";
            return false;
        })
        .default(false)
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z.object({
    nome: z.string({ error: "O nome deve ser um texto." })
        .min(3, "O nome deve ter pelo menos 3 caracteres.")
        .max(25, "O nome deve ter no máximo 25 caracteres.")
        .regex(/^[a-zA-Z0-9_ ]+$/, "O nome contém caracteres inválidos.")
        .optional(),

    descricao: z.string({ error: "A descrição deve ser um texto." })
        .max(191, "A descrição deve ter no máximo 191 caracteres.")
        .optional(),

    status: z.union([
        z.enum(["pendente", "concluida"], statusErrorMap),
        z.boolean({ error: "O status deve ser verdadeiro ou falso." })
    ], { error: "O formato do status está incorreto." })
        .optional()
        .transform((valor) => {
            if (valor === undefined) return undefined;
            if (typeof valor === 'boolean') return valor;
            if (typeof valor === 'string') return valor.toLowerCase() === "concluida";
            return false;
        })
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const getTasksQuerySchema = z.object({
    id: z.coerce.number({ message: "O ID na busca deve ser um número válido." }).optional(),

    search: z.string({ message: "O termo de busca deve ser um texto." }).optional(),

    status: z.union([
        z.enum(["pendente", "concluida"], statusErrorMap),
        z.coerce.number({ message: "O status numérico deve ser 0 ou 1." })
    ], { message: "O formato do status está incorreto." })
        .optional()
        .transform((valor) => {
            if (valor === undefined) return undefined;

            if (typeof valor === 'number') {
                return valor > 0;
            }

            if (typeof valor === 'string') {
                const v = valor.toLowerCase();
                if (v === "concluida" || v === "true") return true;
                if (v === "pendente" || v === "false") return false;
            }

            return false;
        })
});

export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;

export const taskResponseSchema = z.object({
    id: z.number(),
    nome: z.string(),
    descricao: z.string().nullable(),
    status: z.boolean().transform((val) => (val ? 'concluida' : 'pendente')),
    authorId: z.number()
});

export const listTasksResponseSchema = z.array(taskResponseSchema);