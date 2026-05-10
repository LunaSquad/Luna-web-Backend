import mongoose from "mongoose";

const professorSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "O professor deve estar vinculado a um usuário"],
      index: true,
    },
    escolaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Escola",
      required: [true, "O professor precisa estar vinculado a uma escola"],
      index: true,
    },
    turmaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turma",
      default: null,
    },
    nome: {
      type: String,
      required: [true, "O nome do professor é obrigatório"],
      trim: true,
    },
    sobrenome: {
      type: String,
      required: [true, "O sobrenome do professor é obrigatório"],
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
    rg: {
      type: String,
      required: [true, "O RG é obrigatório"],
      unique: true,
    },
    cidade: {
      type: String,
      required: [true, "A cidade é obrigatória"],
      trim: true,
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
    urlFotoProfessor: {
      type: String,
      default: "https://caminho-para-imagem-padrao.com/foto.png",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Professor", professorSchema, "professores");
