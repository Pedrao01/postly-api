# Postly API

API RESTful para gerenciamento de usuários e posts, desenvolvida com Node.js, Express, TypeScript e Prisma ORM.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express 5**
- **Prisma ORM** com **PostgreSQL**
- **JWT** (jsonwebtoken) — autenticação via Access Token + Refresh Token
- **bcrypt** — hash de senhas
- **Zod** — validação de dados
- **dotenv** — gerenciamento de variáveis de ambiente
- **cors**

## 📁 Estrutura do Projeto

```
src/
├── database/
│   └── prismaClient.ts          # Instância singleton do Prisma
├── errors/
│   └── AppError.ts              # Classe de erros customizados
├── middlewares/
│   ├── auth.middleware.ts        # Verificação do JWT
│   ├── authorization.middleware.ts  # Controle de acesso por role
│   └── errorMiddleware.ts       # Handler global de erros
├── modules/
│   ├── auth/                    # Login e refresh token
│   └── users/                   # CRUD de usuários
│       ├── controllers/
│       ├── repositories/
│       ├── routes/
│       ├── schemas/
│       └── services/
├── providers/
│   ├── hash/                    # Abstração do bcrypt
│   └── token/                   # Abstração do JWT
├── routes/
│   └── index.ts                 # Roteador principal
└── server.ts                    # Entry point
```

## ⚙️ Pré-requisitos

- Node.js 18+
- PostgreSQL em execução
- npm ou yarn

## 🔧 Instalação e Configuração

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/postly-api.git
   cd postly-api
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/postly"
   PORT=3000
   JWT_SECRET="sua_chave_secreta"
   ```

4. **Execute as migrations do banco de dados:**

   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o servidor em modo desenvolvimento:**

   ```bash
   npm run dev
   ```

   O servidor estará disponível em `http://localhost:3000`.

## 🗄️ Modelos do Banco de Dados

### User
| Campo       | Tipo      | Descrição                         |
|-------------|-----------|-----------------------------------|
| id          | String    | UUID gerado automaticamente       |
| name        | String    | Nome do usuário                   |
| email       | String    | E-mail único                      |
| password    | String    | Senha (armazenada com hash)       |
| role        | Role      | `USER` ou `ADMIN` (padrão: USER)  |
| createdAt   | DateTime  | Data de criação                   |

### Post
| Campo     | Tipo     | Descrição                  |
|-----------|----------|----------------------------|
| id        | String   | UUID gerado automaticamente |
| titel     | String   | Título do post             |
| content   | String?  | Conteúdo (opcional)        |
| authorId  | String   | Referência ao User         |
| createdAt | DateTime | Data de criação            |

### RefreshToken
| Campo     | Tipo     | Descrição                      |
|-----------|----------|--------------------------------|
| id        | String   | UUID gerado automaticamente    |
| token     | String   | Token único                    |
| userId    | String   | Referência ao User             |
| expiresAt | DateTime | Data de expiração (7 dias)     |

## 🔐 Autenticação

A API utiliza autenticação via **JWT** com suporte a **Refresh Token**.

- O **Access Token** é enviado no header `Authorization: Bearer <token>`.
- O **Refresh Token** expira em **7 dias** e é rotacionado a cada uso (o token antigo é deletado e um novo é gerado).

## 📡 Endpoints

### Auth — `/auth`

| Método | Rota            | Descrição                                   | Autenticação |
|--------|-----------------|---------------------------------------------|--------------|
| POST   | `/auth/login`   | Realiza login e retorna access + refresh token | Não          |
| POST   | `/auth/refresh-token` | Gera novo access token a partir do refresh token | Não    |

**POST `/auth/login`**
```json
// Request Body
{
  "email": "usuario@email.com",
  "password": "senha123"
}

// Response 200
{
  "token": "<access_token>",
  "refreshToken": "<refresh_token>"
}
```

**POST `/auth/refresh-token`**
```json
// Request Body
{
  "refreshToken": "<refresh_token>"
}

// Response 200
{
  "accessToken": "<novo_access_token>",
  "newRefreshToken": "<novo_refresh_token>"
}
```

---

### Users — `/users`

| Método | Rota                         | Descrição                          | Role exigida |
|--------|------------------------------|------------------------------------|--------------|
| POST   | `/users`                     | Cria um novo usuário               | Pública      |
| GET    | `/users`                     | Lista todos os usuários            | USER         |
| GET    | `/users/:id`                 | Retorna um usuário pelo ID         | USER         |
| PUT    | `/users/:id`                 | Atualiza nome e/ou e-mail          | USER         |
| PUT    | `/users/update-password/:id` | Atualiza a senha de um usuário     | ADMIN        |
| DELETE | `/users/:id`                 | Remove um usuário                  | ADMIN        |

**POST `/users`**
```json
// Request Body
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**PUT `/users/:id`**
```json
// Request Body (campos opcionais)
{
  "name": "Novo Nome",
  "email": "novoemail@email.com"
}
```

**PUT `/users/update-password/:id`**
```json
// Request Body
{
  "password": "novaSenha456"
}
```

## 🛡️ Controle de Acesso (Roles)

| Role    | Permissões                                                  |
|---------|-------------------------------------------------------------|
| `USER`  | Listar usuários, visualizar e editar o próprio perfil       |
| `ADMIN` | Todas as permissões de USER + deletar usuários e alterar senhas |

## 🔴 Tratamento de Erros

Todos os erros são padronizados pelo middleware global e retornam o seguinte formato:

```json
{
  "message": "Descrição do erro",
  "status": 400
}
```

Códigos de status utilizados:

| Código | Situação                            |
|--------|-------------------------------------|
| 400    | Requisição inválida                 |
| 401    | Não autenticado / token inválido    |
| 403    | Sem permissão de acesso             |
| 404    | Recurso não encontrado              |
| 409    | Conflito (ex: e-mail já cadastrado) |

## 📜 Scripts Disponíveis

| Script      | Descrição                                 |
|-------------|-------------------------------------------|
| `npm run dev` | Inicia o servidor com hot-reload via ts-node-dev |

## 📄 Licença

Este projeto está licenciado sob a licença **CC BY-NC-ND 4.0.**.
