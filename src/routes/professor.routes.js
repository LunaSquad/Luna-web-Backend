import { Router } from "express";
import ProfessorController from "../controllers/professor.controller.js";
import { validarCadastroProfessor, validarUpdateProfessor } from "../middlewares/validar-professor.js";
import { auth } from "../middlewares/auth.js";
import { uploadProfessor } from "../middlewares/upload-imagem.js";

const routes = Router();

// 1. CREATE
routes.post("/professores", uploadProfessor.single('foto'), validarCadastroProfessor, ProfessorController.criar);

// 2. READ ALL
routes.get("/professores", auth, ProfessorController.listar);

// BUSCAR TURMA DO PROFESSOR
routes.get("/professores/turma", auth, ProfessorController.obterTurma);

// 3. READ ONE
routes.get("/professores/:id", auth, ProfessorController.buscarPorId);

// 4. UPDATE
routes.put("/professores/:id", auth, uploadProfessor.single('foto'), validarUpdateProfessor, ProfessorController.atualizar);

// 5. DELETE
routes.delete("/professores/:id", auth, ProfessorController.deletar);

export default routes;