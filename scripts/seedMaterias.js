import mongoose from "mongoose";
import dotenv from "dotenv";
import Materia from "../models/Materia.js";

// Configurando os servidores DNS
import dns from 'dns';
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Configs
dotenv.config();

// Lista de Matérias do Sistema
const materiasBasicas = [
  { nome: "Língua Portuguesa" },
  { nome: "Matemática" },
  { nome: "História" },
  { nome: "Geografia" },
  { nome: "Ciências" }
];

async function executarSeed() {
  try {
    // 1. Conexão com o Banco de Dados
    await mongoose.connect(process.env.DB_URL);
    console.log("Conectado ao MongoDB...");

    // 2. Verifica se as matérias já foram inseridas
    const quantidade = await Materia.countDocuments();
    if (quantidade > 0) {
      console.log("As matérias já estão cadastradas. Nada foi executado.");
      process.exit(0);
    }

    // 3. Insere as matérias
    await Materia.insertMany(materiasBasicas);
    console.log("Matérias inseridas com sucesso!");

    // 4. Desconecta e encerra o Seed
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("Erro ao executar o seed:", error);
    process.exit(1);
  }
}
// Roda o Seed
executarSeed();