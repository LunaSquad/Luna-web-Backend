import { Router } from "express";
import AlunoController from "../controllers/AlunoController.js";
import { validarCadastroAluno, validarUpdateAluno } from "../middlewares/validarAluno.js";

const routes = Router();

// 1. CREATE
routes.post("/alunos", validarCadastroAluno, AlunoController.criar);

// 2. READ ALL
routes.get("/alunos", AlunoController.listar);

// 3. READ ONE
routes.get("/alunos/:id", AlunoController.buscarPorId);

// 4. UPDATE
routes.put("/alunos/:id", validarUpdateAluno, AlunoController.atualizar);

// 5. DELETE
routes.delete("/alunos/:id", AlunoController.deletar);

export default routes;