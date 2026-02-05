import { getTasksQuerySchema } from '../schemas/task.schema';
import { describe, it, expect } from 'vitest';

describe("Zod schema - Get Task", () => {
    it("Deve transformar a string \"concluida\" em true", () => {
        const result = getTasksQuerySchema.parse({ status: 'concluida' });
        expect(result.status).toBe(true);
    });

    it('Deve transformar o numérico "0" em false', () => {
        const result = getTasksQuerySchema.parse({ status: '0' });
        expect(result.status).toBe(false);
    });

    it('Deve retornar uma mensagem de erro por status inválido', () => {
        const result = getTasksQuerySchema.safeParse({ status: 'invalid' });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.message).toContain('formato do status está incorreto');
        }
    });
})