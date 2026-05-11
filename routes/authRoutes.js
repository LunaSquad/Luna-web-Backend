import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const routes = Router();

// Rota de Login
routes.post("/login", AuthController.login);

export default routes;