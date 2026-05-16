import { Router } from "express";
import EscolaController from "../controllers/EscolaController.js";
import { validarCadastroEscola, validarUpdateEscola } from "../middlewares/validarEscola.js";
import { auth } from "../middlewares/auth.js";
import { uploadEscola } from "../middlewares/uploadImagem.js";

const routes = Router();

// 1. CREATE - Com o Zod protegendo a porta!
routes.post("/escolas", uploadEscola.single('foto'), validarCadastroEscola, EscolaController.criar);

// 2. READ ALL
routes.get("/escolas", auth, EscolaController.listar);

// 3. READ ONE
routes.get("/escolas/:id", auth, EscolaController.buscarPorId);

// 4. UPDATE
routes.put("/escolas/:id", uploadEscola.single('foto'), auth, validarUpdateEscola, EscolaController.atualizar);

// 5. DELETE
routes.delete("/escolas/:id", auth, EscolaController.deletar);

export default routes;