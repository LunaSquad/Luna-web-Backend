import { Router } from "express";
import MateriaController from "../controllers/MateriaController.js";

const routes = Router();

// 1. READ ALL
routes.get("/materias", MateriaController.listar);

// 2. READ ONE
routes.get("/materias/:id", MateriaController.buscarPorId);

export default routes;