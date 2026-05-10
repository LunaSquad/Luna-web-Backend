import mongoose from "mongoose";

const hiperfocoSchema = mongoose.Schema(
  {
    nome: {
      type: String,
      trim: true,
      default: null,
    },
    descricao: {
      type: String,
      trim: true,
      default: null,
    },
    urlFotoHiperfoco: {
      type: String,
      default: null,
    },
  },
  { _id: false },
);

const alunoSchema = mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "O aluno deve estar vinculado a um usuário"],
      index: true,
    },
    escolaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Escola",
      required: [true, "O aluno precisa estar vinculado a uma escola"],
      index: true,
    },
    turmaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turma",
      default: null,
    },
    nome: {
      type: String,
      required: [true, "O nome do aluno é obrigatório"],
      trim: true,
    },
    cpf: {
      type: String,
      required: [true, "O CPF é obrigatório"],
      unique: true,
      trim: true,
    },
    dataNasc: {
      type: Date,
      required: [true, "A data de nascimento é obrigatória"],
    },
    telefone: {
      type: String,
      trim: true,
      match: [
        /^\d{10,11}$/,
        "O telefone deve conter entre 10 e 11 dígitos numéricos (apenas números, com DDD)"
      ],
      required: [true, "O telefone de contato é obrigatório"],
    },
    email: {
      type: String,
      required: [true, "O email é obrigatório"],
      unique: true, // Garante que não haja emails duplicados
      lowercase: true,
      trim: true,
      match: [
        /.+\@.+\..+/,
        "Por favor, insira um email válido",
      ],
    },
    nomeResponsavel: {
      type: String,
      required: [true, "O nome do responsável é obrigatório"],
      trim: true,
    },
    cpfResponsavel: {
      type: String,
      required: [true, "O CPF do responsável é obrigatório"],
      trim: true,
    },
    urlFotoAluno: {
      type: String,
      default: "https://caminho-para-imagem-padrao.com/foto.png",
    },
    urlFotoLaudo: {
      type: String,
      default: "https://caminho-para-imagem-padrao.com/foto.png",
    },
    hiperfoco: {
      type: hiperfocoSchema,
      default: null, // Por padrão é NULO, pois é cadastrado via Mobile
    },
  },
  { timestamps: true },
);

export default mongoose.model("Aluno", alunoSchema);
