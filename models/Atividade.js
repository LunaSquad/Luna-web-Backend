import mongoose from "mongoose";

const corSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      trim: true,
      required: [true, "O título da cor é obrigatório"],
    },
    corHex: {
      type: String,
      trim: true,
      required: [true, "O código hexadecimal da cor é obrigatório"],
    },
  },
  { _id: false },
);

const imagemSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      trim: true,
      required: [true, "O título da imagem é obrigatório"],
    },
    urlImage: {
      type: String,
      required: [true, "A URL da imagem é obrigatória"],
    },
  },
  { _id: false },
);

const exercicioSchema = new mongoose.Schema({
  questao: {
    type: String,
    required: [true, "A questão é obrigatória"],
  },
  resposta: {
    type: String,
    required: [true, "A resposta correta é obrigatória"],
  },
});

const comentarioSchema = new mongoose.Schema(
  {
    comentario: {
      type: String,
      required: [true, "O texto do comentário é obrigatório"],
    },
    data: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const respostaAlunoSchema = new mongoose.Schema(
  {
    exercicioID: {
      type: mongoose.Schema.Types.ObjectId, // Em vez de String
      required: [true, "O ID da questão respondida é obrigatório"],
    },
    resposta: {
      type: String,
      required: [true, "O conteúdo da resposta é obrigatório"],
    },
    comentarios: [comentarioSchema], // Array de comentários (pode ser vazio inicialmente)
  },
  { _id: false },
);

const atividadeSchema = new mongoose.Schema(
  {
    escolaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Escola",
      required: [true, "A atividade deve estar vinculada a uma escola"],
      index: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      required: [true, "A atividade deve estar vinculada a um professor"],
      index: true,
    },
    alunoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aluno",
      required: [true, "A atividade deve estar vinculada a um aluno"],
      index: true,
    },
    planoDeAulaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlanoDeAula",
      required: [true, "A atividade deve estar vinculada a um plano de aula"],
      index: true,
    },
    status: {
      type: String,
      enum: ["pendente", "entregue", "corrigida", "atrasada"], // Restringe as opções aceitas
      required: true,
    },
    dataFinal: {
      type: Date,
      required: [true, "A data final da atividade é obrigatória"],
    },
    cores: {
      type: [corSchema],
      default: [],
    },
    imagens: {
      type: [imagemSchema],
      default: [],
    },
    exerciciosRespostas: {
      type: [exercicioSchema],
      required: [true, "A atividade deve conter pelo menos uma questão"],
    },
    respostasAluno: {
      type: [respostaAlunoSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Atividade", atividadeSchema);
