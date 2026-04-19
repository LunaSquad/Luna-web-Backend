import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "O email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /.+\@.+\..+/,
        "Por favor, insira um email válido",
      ],
    },
    senha: {
      type: String,
      required: true
    },
    tipoUser: {
      type: String,
      enum: ["escola", "professor", "aluno"], // Restringe as opções aceitas
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Usuario", usuarioSchema);
