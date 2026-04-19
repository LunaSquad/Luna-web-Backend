import mongoose from "mongoose";

const planoDeAulaSchema = new mongoose.Schema(
  {
    escolaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Escola",
      required: [true, "O plano de aula deve estar vinculado a uma escola"],
      index: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: [true, "O plano de aula deve estar vinculado a um professor"],
      index: true,
    },
    materiaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Materia",
      required: [true, "O plano de aula deve estar vinculado a uma matéria"],
      index: true,
    },
    titulo: {
      type: String,
      required: [true, "O título do plano de aula é obrigatório"],
      trim: true,
    },
    descricao: {
      type: String,
      required: [true, "A descrição do plano de aula é obrigatória"],
      trim: true,
    },
    urlPlanoDeAula: {
      type: String,
      default: "https://caminho-para-plano-de-aula-padrao.com/plano.pdf",
    },
  },
  { timestamps: true }
);

export default mongoose.model("PlanoDeAula", planoDeAulaSchema);
