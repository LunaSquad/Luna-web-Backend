import { Router } from "express";
import TurmaController from "../controllers/TurmaController.js";
import { validarCadastroTurma, validarUpdateTurma } from "../middlewares/validarTurma.js";

const routes = Router();

// 1. CREATE
routes.post("/turmas", validarCadastroTurma, TurmaController.criar);

// 2. READ ALL
routes.get("/turmas", TurmaController.listar);

// 3. READ ONE
routes.get("/turmas/:id", TurmaController.buscarPorId);

// 4. UPDATE
routes.put("/turmas/:id", validarUpdateTurma, TurmaController.atualizar);

// 5. DELETE
routes.delete("/turmas/:id", TurmaController.deletar);

export default routes;