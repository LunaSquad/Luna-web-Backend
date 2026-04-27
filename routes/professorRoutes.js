import { Router } from "express";
import ProfessorController from "../controllers/ProfessorController.js";
import { validarCadastroProfessor, validarUpdateProfessor } from "../middlewares/validarProfessor.js";

const routes = Router();

// 1. CREATE
routes.post("/professores", validarCadastroProfessor, ProfessorController.criar);

// 2. READ ALL
routes.get("/professores", ProfessorController.listar);

// 3. READ ONE
routes.get("/professores/:id", ProfessorController.buscarPorId);

// 4. UPDATE
routes.put("/professores/:id", validarUpdateProfessor, ProfessorController.atualizar);

// 5. DELETE
routes.delete("/professores/:id", ProfessorController.deletar);

export default routes;