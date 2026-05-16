import { Router } from "express";
import ProfessorController from "../controllers/ProfessorController.js";
import { validarCadastroProfessor, validarUpdateProfessor } from "../middlewares/validarProfessor.js";
import { auth } from "../middlewares/auth.js";
import { uploadProfessor } from "../middlewares/uploadImagem.js";

const routes = Router();

// 1. CREATE
routes.post("/professores", auth, uploadProfessor.single('foto'), validarCadastroProfessor, ProfessorController.criar);

// 2. READ ALL
routes.get("/professores", auth, ProfessorController.listar);

// 3. READ ONE
routes.get("/professores/:id", auth, ProfessorController.buscarPorId);

// 4. UPDATE
routes.put("/professores/:id", auth, uploadProfessor.single('foto'), validarUpdateProfessor, ProfessorController.atualizar);

// 5. DELETE
routes.delete("/professores/:id", auth, ProfessorController.deletar);

export default routes;