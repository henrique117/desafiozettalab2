# coding: utf-8

"""
# 📚 API Zetta - Gerenciamento de Tarefas

Esta API foi desenvolvida para o Desafio 2 da **Zetta Lab**. A aplicação utiliza **Fastify** para o servidor, **Prisma** como ORM, **Zod** para validações e **MySQL** como banco de dados dentro de containers Docker.

---

## 🚀 Como Iniciar o Projeto

Para facilitar a execução e garantir que o ambiente esteja correto, utilize o **Makefile** incluído. Certifique-se de que você tem o Docker e o Docker Compose instalados.

### 1. Configuração Inicial (Primeira vez)
Execute o comando abaixo para subir os containers, rodar as migrations e preparar o banco de dados automaticamente:
```bash
make setup
```

### 2. Comandos Disponíveis
* `make run`: Inicia a aplicação e exibe os logs no terminal (Foreground).
* `make run-bg`: Inicia a aplicação em segundo plano (Background).
* `make stop`: Para todos os serviços ativos.
* `make test`: Executa a suíte de testes unitários e de integração via Vitest.
* `make migrate`: Aplica as alterações de schema no banco de dados MySQL.
* `make logs`: Exibe os logs em tempo real da API.
* `make clean`: Remove containers e deleta os volumes do banco de dados (reset total dos dados).

---

## 🔐 Autenticação

A maioria das rotas de tarefas requer autenticação via **JWT (JSON Web Token)**.

* **Header:** `Authorization: Bearer <seu_token>`
* O token é obtido através da rota de Login.

---

## 👤 Usuários (`/users`)

### `POST /users/register`
Cria uma nova conta de usuário.

**Body (JSON):**
```json
{
  "nome": "Henrique",
  "email": "henrique@ufla.br",
  "senha": "password123"
}
```

### `POST /users/login`
Autentica o usuário e retorna o token JWT.

**Body (JSON):**
```json
{
  "email": "henrique@ufla.br",
  "senha": "password123"
}
```

---

## 📝 Tarefas (`/tasks`)

Gerenciamento completo das tarefas. O sistema implementa isolamento de dados: apenas visualiza e edita o que você mesmo criou.

### `POST /tasks`
Cria uma nova tarefa.
**Autenticação:** Obrigatória.

**Body (JSON):**
```json
{
  "nome": "Estudar para IHC",
  "descricao": "Revisar heurísticas de Nielsen e acessibilidade",
  "status": "pendente"
}
```
> **Diferencial:** O campo `nome` aceita acentuação e cedilha (ex: "Organização"), e o campo `status` aceita `"pendente"`, `"concluida"`, `0/1` ou `true/false`.

### `GET /tasks`
Lista as tarefas do usuário autenticado.
**Autenticação:** Obrigatória.

**Query Parameters (Opcionais):**
* `status`: Filtra por status (pendente/concluida).
* `search`: Busca o termo no nome ou na descrição.

### `PATCH /tasks/:id`
Atualiza os dados de uma tarefa existente.
**Autenticação:** Obrigatória.

### `DELETE /tasks/:id`
Remove uma tarefa permanentemente do banco de dados.
**Autenticação:** Obrigatória.

---

## 🧪 Testes Automatizados

A API conta com testes robustos para garantir a qualidade da entrega:

* **Testes Unitários:** Validação de schemas Zod e transformações de dados.
* **Testes de Integração:** Testam o fluxo completo (Rota -> Middleware -> Controller -> Banco de Dados).

Para rodar a suíte de testes:
```bash
make test
```