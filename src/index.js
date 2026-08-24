import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import professorRoutes from './routes/professor.routes.js';
import materiaRoutes from './routes/materia.routes.js';
import turmaRoutes from './routes/turma.routes.js';
import alunoRoutes from './routes/aluno.routes.js';
import authRoutes from './routes/auth.routes.js';
import planoDeAulaRoutes from "./routes/plano-de-aula.routes.js";

import dns from 'dns';
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const app = express();
dotenv.config();
app.use(express.json())
app.use(cors())

app.use('/', professorRoutes);
app.use('/', materiaRoutes);
app.use('/', turmaRoutes);
app.use('/', alunoRoutes);
app.use('/', authRoutes);
app.use("/", planoDeAulaRoutes);

const DB_Connection = process.env.DB_URL;

mongoose.connect(DB_Connection)
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });

const port = 4000;
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`API Rodando em http://localhost:${port}`);
  }
});