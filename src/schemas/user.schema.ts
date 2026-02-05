import z from "zod";

export const createUserSchema = z.object({
    nome: z.string({ error: "O nome do usuário deve ser um texto." })
        .min(3, "O nome do usuário deve ter pelo menos 3 caracteres.")
        .max(45, "O nome do usuário deve conter no máximo 45 caracteres.")
        .regex(/^[a-zA-Z0-9_ ]+$/, "O nome contém caracteres inválidos."),

    email: z.email({ error: "Por favor, digite um endereço de e-mail válido." }),

    senha: z.string({ error: "A senha deve ser um texto." })
        .min(6, "A senha deve ter pelo menos 6 caracteres.")
        .max(100, "A senha é muito longa.")
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const loginUserSchema = z.object({
    email: z.email({ error: "Por favor, digite um endereço de e-mail válido." }),

    senha: z.string({ error: "A senha deve ser um texto." })
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;