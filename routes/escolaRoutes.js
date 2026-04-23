import { Router } from "express";
import EscolaController from "../controllers/EscolaController.js";
import { validarCadastro, validarUpdate } from "../middlewares/validarEscola.js";

const routes = Router();

// 1. CREATE - Com o Zod protegendo a porta!
routes.post("/escolas", validarCadastro, EscolaController.criar);

// 2. READ ALL
routes.get("/escolas", EscolaController.listar);

// 3. READ ONE
routes.get("/escolas/:id", EscolaController.buscarPorId);

// 4. UPDATE
routes.put("/escolas/:id", validarUpdate, EscolaController.atualizar);

// 5. DELETE
routes.delete("/escolas/:id", EscolaController.deletar);

export default routes;