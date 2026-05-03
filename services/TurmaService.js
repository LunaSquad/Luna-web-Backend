import Turma from '../models/Turma.js';

class TurmaService {

  // 1. CREATE - Método para registrar uma nova turma
  async registrar(dadosTurma) {
    try {
      const novaTurma = new Turma(dadosTurma);

      return await novaTurma.save();

    } catch (error) {

      throw new Error(`Erro ao registrar a turma: ${error.message}`);
    }

  }

  // 2. READ ALL - Método para listar todas as turmas
  async listarTodas() {
    return await Turma.find()
      .populate("escolaId", "nome cnpj")
      .populate("professorId", "nome sobrenome email");
  }

  // 3. READ ONE - Método para buscar uma turma por ID
  async buscarPorId(id) {
    const turma = await Turma.findById(id)
      .populate("escolaId", "nome")
      .populate("professorId", "nome sobrenome");

    if (!turma) {
      throw new Error("Turma não encontrada.");
    }
    return turma;
  }

  // 4. UPDATE - Método para atualizar os dados da turma
  async atualizar(id, dadosAtualizados) {

    const turmaAtualizada = await Turma.findByIdAndUpdate(id, dadosAtualizados, { new: true });

    if (!turmaAtualizada) {
      throw new Error("Turma não encontrada para a atualização.");
    }
    return turmaAtualizada;
  }

  // 5. DELETE - Método para excluir uma turma
  async deletar(id) {
    const turma = await Turma.findByIdAndDelete(id);

    if (!turma) {
      throw new Error("Turma não encontrada para a exclusão.");
    }

    return { mensagem: "Turma excluída com sucesso." };
  }

}

export default new TurmaService();