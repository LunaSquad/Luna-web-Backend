import mongoose from "mongoose";

// Schema de Endereço
const enderecoSchema = new mongoose.Schema(
  {
    cidade: {
      type: String,
      trim: true,
    },
    bairro: {
      type: String,
      trim: true,
    },
    rua: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

// Schema da Escola
const escolaSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "A escola deve estar vinculada a um usuário"],
      index: true,
    },
    nome: {
      type: String,
      required: [true, "O nome da escola é obrigatório"],
      trim: true,
    },
    telefone: {
      type: String,
      trim: true,
    },
    cnpj: {
      type: String,
      required: [true, "O CNPJ é obrigatório"],
      unique: true,
      trim: true,
    },
    endereco: {
      type: enderecoSchema,
      required: [true, "Os dados de endereço são obrigatórios"],
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
    urlFotoEscola: {
      type: String,
      default: "https://caminho-para-imagem-padrao.com/foto.png",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Escola", escolaSchema);
