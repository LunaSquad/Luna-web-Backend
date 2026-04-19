import mongoose from "mongoose";

const materiaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome da matéria é obrigatório"],
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Materia", materiaSchema);
