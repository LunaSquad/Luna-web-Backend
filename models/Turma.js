import mongoose from "mongoose";

const turmaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome da turma é obrigatório"],
      trim: true,
    },
    escolaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Escola",
      required: [true, "A turma deve estar vinculada a uma escola"],
      index: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Professor",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Turma", turmaSchema);