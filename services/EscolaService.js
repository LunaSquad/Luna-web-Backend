import Escola from '../models/Escola.js';
import Usuario from '../models/Usuario.js';
import UsuarioService from "./UsuarioService.js";

class EscolaService {

  // 1. CREATE - Método para registrar uma nova escola
  async registrar(dadosEscola, dadosUsuario) {
    // Criar o usuario
    const novoUsuario = await UsuarioService.criarUsuario({
      ...dadosUsuario,
      tipoUser: "escola"
    });

    try {
      // Criar a escola
      const novaEscola = new Escola({
        ...dadosEscola,
        email: dadosUsuario.email,
        usuarioId: novoUsuario._id
      });

      return await novaEscola.save();

    } catch (error) {
      // Caso haja um erro na criação da escola, deletamos o usuário criado
      await Usuario.findByIdAndDelete(novoUsuario._id);

      throw new Error(`Erro ao registrar escola: ${error.message}`);
    }

  }

  // 2. READ ALL - Método para listar todas as escolas
  async listarTodas() {
    return await Escola.find().populate("usuarioId", "email tipoUser");
  }

  // 3. READ ONE - Métodos para buscar uma escola por ID
  async buscarPorId(id) {
    const escola = await Escola.findById(id).populate("usuarioId", "email tipoUser");

    if (!escola) {
      throw new Error ("Escola não encontrada");
    }
    return escola;
  }

  // 4. UPDATE - Método para atualizar os dados da escola
  async atualizar(id, dadosAtualizados) {
    const escolaAtualizada = await Escola.findByIdAndUpdate(id, dadosAtualizados, {new : true});

    if (!escolaAtualizada) {
      throw new Error("Escola não encontrada para a atualização");
    }
    return escolaAtualizada;
  }

  // 5. DELETE - Método para excluir uma escola
  async deletar(id) {
    const escola = await Escola.findById(id);

    if (!escola) {
      throw new Error ("Escola não encontrada para a exclusão");
    }

    // Deleta a escola
    await Escola.findByIdAndDelete(id);

    // Deleta o usuário associado
    await Usuario.findByIdAndDelete(escola.usuarioId);

    return { mensagem: "Escola e dados de acesso excluídas com sucesso." };
  }
}

export default new EscolaService();