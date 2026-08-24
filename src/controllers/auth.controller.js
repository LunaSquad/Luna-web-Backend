import Usuario from "../models/usuario.model.js";
import Professor from "../models/professor.model.js";
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


      if (usuario.tipoUser === "aluno") {
        return res.status(403).json({
          erro: "Acesso negado. O Web é restrito para Professores. Por favor, utilize o aplicativo móvel."
        });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(401).json({ erro: "E-mail ou senha inválidos." });
      }

      const professor = await Professor.findOne({ usuarioId: usuario._id });
      if (!professor) {
        return res.status(500).json({ erro: "Erro de integridade: Perfil associado não encontrado." });
      }

      // Geração do Token JWT
      const token = jwt.sign(
        { 
          id: usuario._id, 
          tipoUser: usuario.tipoUser, 
          professorId: professor._id 
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
          nome: professor.nome,
          foto: professor.urlFotoProfessor
        }
      });

    } catch (error) {
      console.error("Erro no AuthController:", error);
      return res.status(500).json({ erro: "Erro interno ao realizar o login." });
    }
  }
}

export default new AuthController();