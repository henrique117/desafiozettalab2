import bcrypt from "bcryptjs";
import { CreateUserInput, LoginUserInput } from "../schemas/user.schema";
import prisma from "../lib/prisma";
import IUser from "../interfaces/User.interface";

const hashSenha = async (senha: string): Promise<string> => {
    const saltRounds = await bcrypt.genSalt();
    const hash = await bcrypt.hash(senha, saltRounds);

    return hash;
}

export const createUser = async (input: CreateUserInput): Promise<IUser> => {
    const { nome, email, senha } = input;
    const hash = await hashSenha(senha);

    const user: IUser = await prisma.user.create({
        data: {
            nome: nome,
            email: email,
            senha: hash
        }
    });

    return user;
}

export const loginUser = async (input: LoginUserInput): Promise<IUser> => {
    const { email, senha } = input;
    
    const user: IUser | null = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) throw new Error("Usuário ou senha inválido.");

    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) throw new Error("Usuário ou senha inválido.");

    return user;
}