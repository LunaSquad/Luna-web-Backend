import { Router } from "express";
import MateriaController from "../controllers/MateriaController.js";
import { auth } from "../middlewares/auth.js";

const routes = Router();

// 1. READ ALL
routes.get("/materias", auth, MateriaController.listar);

// 2. READ ONE
routes.get("/materias/:id", auth, MateriaController.buscarPorId);

export default routes;