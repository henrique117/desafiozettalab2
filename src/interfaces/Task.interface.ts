export default interface IUser {
    id: number;
    nome: string;
    descricao: string | null;
    status: boolean;
    authorId: number;
}