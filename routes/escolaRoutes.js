import { Router } from "express";
import EscolaController from "../controllers/EscolaController.js";
import { validarCadastro, validarUpdate } from "../middlewares/validarEscola.js";
import { auth } from "../middlewares/auth.js";

const routes = Router();

// 1. CREATE - Com o Zod protegendo a porta!
routes.post("/escolas", validarCadastro, EscolaController.criar);

// 2. READ ALL
routes.get("/escolas", auth, EscolaController.listar);

// 3. READ ONE
routes.get("/escolas/:id", auth, EscolaController.buscarPorId);

// 4. UPDATE
routes.put("/escolas/:id", auth, validarUpdate, EscolaController.atualizar);

// 5. DELETE
routes.delete("/escolas/:id", auth, EscolaController.deletar);

export default routes;