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
* `make restart`: Reinicia a aplicação (stop + run-bg).
* `make stop`: Para todos os serviços ativos.
* `make test`: Executa a suíte de testes unitários e de integração via Vitest.
* `make migrate`: Aplica as alterações de schema no banco de dados MySQL.
* `make logs`: Exibe os logs em tempo real da API.
* `make clean`: Remove containers e deleta os volumes do banco (reset total).

---

## 🔐 Autenticação

A maioria das rotas de tarefas requer autenticação via **JWT (JSON Web Token)**.

* **Header:** `Authorization: Bearer <seu_token>`
* O token é obtido através da rota de Login.

---

## 👤 Usuários (`/users`)

### `POST /users/register`
Cria uma nova conta de usuário.

**Parâmetros do Corpo (JSON):**
| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `nome` | string | Sim | Mín. 3 e Máx. 45 caracteres. |
| `email` | string | Sim | E-mail válido e único no sistema. |
| `senha` | string | Sim | Mín. 6 e Máx. 100 caracteres. |

**Exemplo de Uso:**
- **Request:** `POST /users/register`
- **Body:**
```json
{
  "nome": "Henrique Silva",
  "email": "henrique@ufla.br",
  "senha": "password123"
}
```
- **Response (201 Created):**
```json
{
  "id": 1,
  "nome": "Henrique Silva",
  "email": "henrique@ufla.br"
}
```

### `POST /users/login`
Autentica o usuário e retorna o token JWT.

**Parâmetros do Corpo (JSON):**
| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `email` | string | Sim | E-mail cadastrado. |
| `senha` | string | Sim | Senha do usuário. |

**Exemplo de Uso:**
- **Request:** `POST /users/login`
- **Body:**
```json
{
  "email": "henrique@ufla.br",
  "senha": "password123"
}
```
- **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Henrique Silva",
    "email": "henrique@ufla.br"
  }
}
```

---

## 📝 Tarefas (`/tasks`)

O sistema implementa isolamento de dados: você só interage com as tarefas que você mesmo criou.

### `POST /tasks`
Cria uma nova tarefa para o usuário logado.

**Parâmetros do Corpo (JSON):**
| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `nome` | string | Sim | Mín. 3 e Máx. 25 caracteres. Aceita acentos. |
| `descricao` | string | Não | Máx. 191 caracteres. |
| `status` | string/bool| Não | "pendente", "concluida" ou boolean. Padrão: "pendente". |

**Exemplo de Uso:**
- **Request:** `POST /tasks`
- **Body:**
```json
{
  "nome": "Estudar IHC",
  "descricao": "Revisar Heurísticas de Nielsen",
  "status": "pendente"
}
```
- **Response (201 Created):**
```json
{
  "id": 10,
  "nome": "Estudar IHC",
  "descricao": "Revisar Heurísticas de Nielsen",
  "status": "pendente",
  "authorId": 1
}
```

### `GET /tasks`
Lista as tarefas com suporte a filtros.

**Parâmetros de Busca (Query String):**
| Parâmetro | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | number | Não | Busca por um ID específico. |
| `search` | string | Não | Termo para busca no nome ou descrição. |
| `status` | string/num | Não | "pendente", "concluida", 0 ou 1. |

**Exemplo de Uso (Filtros):**
- **Request:** `GET /tasks?status=concluida&search=IHC`
- **Response (200 OK):**
```json
[
  {
    "id": 10,
    "nome": "Estudar IHC",
    "descricao": "Revisar Heurísticas de Nielsen",
    "status": "concluida",
    "authorId": 1
  }
]
```

### `PATCH /tasks/:id`
Atualiza campos específicos de uma tarefa existente.

**Parâmetros do Corpo (JSON):**
| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `nome` | string | Não | Novo nome da tarefa. |
| `descricao` | string | Não | Nova descrição. |
| `status` | string/bool| Não | Novo status (pendente/concluida). |

**Exemplo de Uso:**
- **Request:** `PATCH /tasks/10`
- **Body:**
```json
{
  "nome": "Estudar IHC - Revisado",
  "status": "concluida"
}
```
- **Response (200 OK):**
```json
{
  "id": 10,
  "nome": "Estudar IHC - Revisado",
  "descricao": "Revisar Heurísticas de Nielsen",
  "status": "concluida",
  "authorId": 1
}
```

### `DELETE /tasks/:id`
Remove uma tarefa e retorna o objeto deletado.

**Exemplo de Uso:**
- **Request:** `DELETE /tasks/10`
- **Response (200 OK):**
```json
{
  "id": 10,
  "nome": "Estudar IHC - Revisado",
  "descricao": "Revisar Heurísticas de Nielsen",
  "status": "concluida",
  "authorId": 1
}
```

---

## 🧪 Testes Automatizados

A API conta com testes robustos para garantir a qualidade da entrega:

* **Testes Unitários:** Validação de schemas Zod e transformações de dados.
* **Testes de Integração:** Testam o fluxo completo (Rota -> Middleware -> Controller -> Banco de Dados).

Para rodar a suíte de testes:
```bash
make test
```