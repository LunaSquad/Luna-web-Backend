import Usuario from '../models/Usuario.js';
import bcrypt from "bcrypt";

class UsuarioService {

  // Método pra criar um novo usuário
  async criarUsuario(dados) {
    // Verifica duplicidade
    const usuarioExistente = await Usuario.findOne({ email: dados.email });
    if (usuarioExistente) {
      throw new Error("Este email já esta em uso.");
    }

    // Criptografia da senha
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(dados.senha, salt);

    // Criação do usuário
    const novoUsuario = new Usuario({
      email: dados.email,
      senha: senhaCriptografada,
      tipoUser: dados.tipoUser
    })

    // Retorna o usuário criado
    return await novoUsuario.save();
  }

  // Método da busca de usuario por email
  async buscarUsuarioPorEmail(email) {
    const usuario = await Usuario.findOne({ email: email });

    if (!usuario) {
      throw new Error("Usuário não encontrado.");
    }

    return usuario;
  }
}

export default new UsuarioService();