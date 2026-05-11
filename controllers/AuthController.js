import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos." });
      }

      // Bloqueia o acesso se for aluno
      if (usuario.tipoUser === "aluno") {
        return res.status(403).json({ 
          erro: "Acesso negado. O Web é restrito para Escolas e Professores. Por favor, utilize o aplicativo móvel." 
        });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos." });
      }

      // Geração do Token JWT
      const token = jwt.sign(
        { id: usuario._id, tipoUser: usuario.tipoUser }, 
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token expira em 24 horas
      );

      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token,
        usuario: {
          id: usuario._id,
          email: usuario.email,
          tipoUser: usuario.tipoUser
        }
      });

    } catch (error) {
      console.error("Erro no AuthController:", error);
      return res.status(500).json({ erro: "Erro interno ao realizar o login." });
    }
  }
}

export default new AuthController();