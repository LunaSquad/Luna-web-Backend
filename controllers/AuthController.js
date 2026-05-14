import Usuario from "../models/Usuario.js";
import Escola from "../models/Escola.js";
import Professor from "../models/Professor.js";
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

      let escolaId = null;

      if (usuario.tipoUser === "escola") {
        const escola = await Escola.findOne({ usuarioId: usuario._id });
        if (escola) escolaId = escola._id;
      } else if (usuario.tipoUser === "professor") {
        const professor = await Professor.findOne({ usuarioId: usuario._id });
        if (professor) escolaId = professor.escolaId;
      }

      // Segurança: Caso o usuário não tenha um perfil correspondente, é bloqueado.
      if (!escolaId) {
        return res.status(500).json({ erro: "Erro de integridade: Perfil associado não encontrado." });
      }

      // Geração do Token JWT
      const token = jwt.sign(
        {
          id: usuario._id,
          tipoUser: usuario.tipoUser,
          escolaId: escolaId
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token expira em 24 horas
      );

      // Retorna o sucesso com o token e os dados básicos
      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token,
        usuario: {
          id: usuario._id,
          email: usuario.email,
          tipoUser: usuario.tipoUser,
          escolaId: escolaId
        }
      });

    } catch (error) {
      console.error("Erro no AuthController:", error);
      return res.status(500).json({ erro: "Erro interno ao realizar o login." });
    }
  }
}

export default new AuthController();