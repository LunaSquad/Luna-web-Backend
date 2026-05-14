import Professor from '../models/Professor.js';
import Usuario from '../models/Usuario.js';
import UsuarioService from "./UsuarioService.js";

class ProfessorService {

  // 1. CREATE - Método para registrar um novo professor
  async registrar(dadosProfessor, dadosUsuario) {
    // Criar o usuario
    const novoUsuario = await UsuarioService.criarUsuario({
      ...dadosUsuario,
      tipoUser: "professor"
    });

    try {
      // Criar o professor
      const novoProfessor = new Professor({
        ...dadosProfessor,
        email: dadosUsuario.email,
        usuarioId: novoUsuario._id
      });

      return await novoProfessor.save();

    } catch (error) {
      // Caso haja um erro na criação do professor, deletamos o usuário criado
      await Usuario.findByIdAndDelete(novoUsuario._id);

      throw new Error(`Erro ao registar professor: ${error.message}`);
    }

  }

  // 2. READ ALL - Método para listar todos os professores
  async listarTodos(escolaId) {
    return await Professor.find({ escolaId })
      .populate("usuarioId", "email tipoUser")
      .populate("escolaId", "nome cnpj");
  }

  // 3. READ ONE - Métodos para buscar um professor por ID
  async buscarPorId(id, escolaId) {
    const professor = await Professor.findOne({ _id: id, escolaId })
      .populate("usuarioId", "email tipoUser")
      .populate("escolaId", "nome");

    if (!professor) {
      throw new Error("Professor não encontrado.");
    }
    return professor;
  }

  // 4. UPDATE - Método para atualizar os dados do professor
  async atualizar(id, dadosAtualizados, escolaId) {
    const professorAtualizado = await Professor.findOneAndUpdate(
      { _id: id, escolaId },
      dadosAtualizados,
      { new: true }
    );

    if (!professorAtualizado) {
      throw new Error("Professor não encontrado para a atualização.");
    }
    return professorAtualizado;
  }

  // 5. DELETE - Método para excluir um professor
  async deletar(id, escolaId) {
    const professor = await Professor.findOne({ _id: id, escolaId });

    if (!professor) {
      throw new Error("Professor não encontrado para a exclusão.");
    }

    // Apaga o professor
    await Professor.findByIdAndDelete(id);

    // Apaga o utilizador de acesso associado
    await Usuario.findByIdAndDelete(professor.usuarioId);

    return { mensagem: "Professor e credenciais de acesso excluídos com sucesso." };
  }
}

export default new ProfessorService();