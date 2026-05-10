import Aluno from '../models/Aluno.js';
import Usuario from '../models/Usuario.js';
import UsuarioService from "./UsuarioService.js";

class AlunoService {

  // 1. CREATE - Método para registar um novo aluno
  async registrar(dadosAluno, dadosUsuario) {
    // Criar o usuario
    const novoUsuario = await UsuarioService.criarUsuario({
      ...dadosUsuario,
      tipoUser: "aluno"
    });

    try {
      // Criar o aluno
      const novoAluno = new Aluno({
        ...dadosAluno,
        email: dadosUsuario.email,
        usuarioId: novoUsuario._id
      });

      return await novoAluno.save();

    } catch (error) {
      // Caso haja um erro na criação do aluno, deletamos o usuário criado
      await Usuario.findByIdAndDelete(novoUsuario._id);
      throw new Error(`Erro ao registar aluno: ${error.message}`);
    }
  }

  // 2. READ ALL - Método para listar todos os alunos
  async listarTodos() {
    return await Aluno.find()
      .populate("usuarioId", "email tipoUser")
      .populate("escolaId", "nome cnpj")
      .populate("turmaId", "nome");
  }

  // 3. READ ONE - Método para buscar um aluno por ID
  async buscarPorId(id) {
    const aluno = await Aluno.findById(id)
      .populate("usuarioId", "email tipoUser")
      .populate("escolaId", "nome")
      .populate("turmaId", "nome");

    if (!aluno) {
      throw new Error("Aluno não encontrado.");
    }
    return aluno;
  }

  // 4. UPDATE - Método para atualizar os dados do aluno
  async atualizar(id, dadosAtualizados) {
    const alunoAtualizado = await Aluno.findByIdAndUpdate(id, dadosAtualizados, { new: true });

    if (!alunoAtualizado) {
      throw new Error("Aluno não encontrado para a atualização.");
    }
    return alunoAtualizado;
  }

  // 5. DELETE - Método para excluir um aluno
  async deletar(id) {
    const aluno = await Aluno.findById(id);

    if (!aluno) {
      throw new Error("Aluno não encontrado para a exclusão.");
    }

    // Apaga o aluno
    await Aluno.findByIdAndDelete(id);

    // Apaga o utilizador de acesso associado
    await Usuario.findByIdAndDelete(aluno.usuarioId);

    return { mensagem: "Aluno e credenciais de acesso excluídos com sucesso." };
  }
}

export default new AlunoService();