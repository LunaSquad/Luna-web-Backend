// Imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Imports de Rotas
import escolaRoutes from './routes/escolaRoutes.js';
import professorRoutes from './routes/professorRoutes.js';
import turmaRoutes from './routes/turmaRoutes.js';

// Configurando os servidores DNS
import dns from 'dns';
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Configs
const app = express();
dotenv.config();

// Configurando o Express
app.use(express.json())
app.use(cors())

// Configurando as rotas
app.use('/', escolaRoutes);
app.use('/', professorRoutes);
app.use('/', turmaRoutes);

// Iniciando a conexão com o banco de dados MongoDB
const DB_Connection = process.env.DB_URL;

mongoose.connect(DB_Connection)
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });

// Rodando a API na porta 4000
const port = 4000;
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`API Rodando em http://localhost:${port}`);
  }
})