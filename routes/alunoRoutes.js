import { Router } from "express";
import AlunoController from "../controllers/AlunoController.js";
import { validarCadastroAluno, validarUpdateAluno } from "../middlewares/validarAluno.js";
import { auth } from "../middlewares/auth.js";

const routes = Router();

// 1. CREATE
routes.post("/alunos", auth, validarCadastroAluno, AlunoController.criar);

// 2. READ ALL
routes.get("/alunos", auth, AlunoController.listar);

// 3. READ ONE
routes.get("/alunos/:id", auth, AlunoController.buscarPorId);

// 4. UPDATE
routes.put("/alunos/:id", auth, validarUpdateAluno, AlunoController.atualizar);

// 5. DELETE
routes.delete("/alunos/:id", auth, AlunoController.deletar);

export default routes;