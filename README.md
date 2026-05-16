# 🦋 Luna — Back-end Web

API REST do sistema web voltado para escolas e professores, com foco em gestão humanizada de alunos, turmas e corpo docente, com suporte à neurodiversidade.

---

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/)
- [JWT (JSON Web Token)](https://jwt.io/) para autenticação segura
- [Zod](https://zod.dev/) para validação rigorosa de dados
- [Cloudinary](https://cloudinary.com/) + [Multer](https://github.com/expressjs/multer) para upload de imagens (fotos de perfil e laudos)
- [Bcrypt](https://www.npmjs.com/package/bcrypt) para criptografia de senhas

---

## 📋 Funcionalidades

- Autenticação baseada em JWT com controle de acesso (acesso restrito para perfis de Escola e Professor na plataforma web).
- CRUD completo de Instituições (Escolas), Professores, Alunos e Turmas.
- Gestão de mídias com upload direto para o Cloudinary, com sistema de rollback em caso de falha de validação.
- Validação de regras de negócio e tipagem de entrada de ponta a ponta através de middlewares.
- Endpoint de estatísticas para o dashboard da escola (total de alunos, professores e turmas ativas).
- Integração facilitada de banco de dados via script de seed para matérias padrão.

---

## ⚙️ Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no MongoDB Atlas (ou cluster local rodando)
- Conta no Cloudinary (para armazenamento dos arquivos)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/LunaSquad/Luna-web-Backend.git

# Entre na pasta
cd Luna-web-Backend

# Instale as dependências
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto. Você pode usar as chaves indicadas no código como base:

```env
# Conexão com o MongoDB
DB_URL=mongodb+srv://<usuario>:<senha>@<cluster>.<dominio>.mongodb.net/<database>?appName=<nome_do_app>

# Chave de assinatura para o JWT
JWT_SECRET=CHAVE_SECRETA_PARA_JWT_AQUI

# Credenciais do Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

### Rodando

Antes de iniciar o servidor pela primeira vez, rode o script de seed para popular as matérias básicas (como Matemática, História, etc):

```bash
npm run seed
```

Inicie o servidor em modo de desenvolvimento (com auto-reload):

```bash
npm start
```

A API estará rodando em `http://localhost:4000`

---

## 🔗 Integração das Rotas da API

Abaixo estão os principais endpoints expostos pelo Back-end para o consumo do front:

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/login` | Autenticação do usuário (retorna o Token JWT) |
| GET | `/escolas/estatisticas` | Retorna totais de alunos, professores e turmas |
| GET/POST/PUT/DELETE | `/escolas` | CRUD da instituição escolar |
| GET/POST/PUT/DELETE | `/professores` | CRUD do corpo docente |
| GET | `/professores/turma` | Retorna as métricas da turma do professor autenticado |
| GET/POST/PUT/DELETE | `/alunos` | CRUD de alunos (suporta upload de `foto` e `laudo`) |
| GET/POST/PUT/DELETE | `/turmas` | CRUD de turmas escolares |
| GET | `/materias` | Listagem das matérias cadastradas |

> **Nota:** Todas as rotas (exceto o `/login`) são protegidas e exigem a passagem do token JWT no header: `Authorization: Bearer <token>`

---

## 📁 Estrutura de pastas

```text
/
├── controllers/    # Lógica que processa as requisições e respostas
├── middlewares/    # Interceptadores (Uploads com Multer, Auth e Validação com Zod)
├── models/         # Esquemas do banco de dados (Mongoose)
├── routes/         # Arquivos de definição de endpoints
├── scripts/        # Scripts utilitários (ex: seedMaterias.js)
├── services/       # Regras de negócio, consultas e integrações
└── index.js        # Arquivo principal que sobe o servidor
```

---

## 👥 Time

Desenvolvido por **Luminous**.
