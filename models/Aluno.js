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
    sobrenome: {
      type: String,
      required: [true, "O sobrenome do aluno é obrigatório"],
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
    ra: {
      type: Number,
      required: [true, "O RA é obrigatório"],
      unique: true,
    },
    nomeResponsavel: {
      type: String,
      required: [true, "O nome do responsável é obrigatório"],
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
