import Turma from '../models/Turma.js';
import Professor from '../models/Professor.js';

class TurmaService {

  // 1. CREATE - Método para registrar uma nova turma
  async registrar(dadosTurma) {
    try {
      const professorValido = await Professor.findOne({ 
        _id: dadosTurma.professorId, 
        escolaId: dadosTurma.escolaId 
      });

      // Se o professor não existir ou for de outra escola, barra a criação!
      if (!professorValido) {
        throw new Error("O professor selecionado não foi encontrado.");
      }

      const novaTurma = new Turma(dadosTurma);
      return await novaTurma.save();

    } catch (error) {
      throw new Error(`Erro ao registrar a turma: ${error.message}`);
    }

  }

  // 2. READ ALL - Método para listar todas as turmas
  async listarTodas(escolaId) {
    return await Turma.find({ escolaId })
      .populate("escolaId", "nome cnpj")
      .populate("professorId", "nome sobrenome email");
  }

  // 3. READ ONE - Método para buscar uma turma por ID
  async buscarPorId(id, escolaId) {
    const turma = await Turma.findOne({ _id: id, escolaId })
      .populate("escolaId", "nome")
      .populate("professorId", "nome sobrenome");

    if (!turma) {
      throw new Error("Turma não encontrada.");
    }
    return turma;
  }

  // 4. UPDATE - Método para atualizar os dados da turma
  async atualizar(id, dadosAtualizados, escolaId) {
    const turmaAtualizada = await Turma.findOneAndUpdate(
      { _id: id, escolaId },
      dadosAtualizados,
      { new: true }
    );

    if (!turmaAtualizada) {
      throw new Error("Turma não encontrada para a atualização.");
    }
    return turmaAtualizada;
  }

  // 5. DELETE - Método para excluir uma turma
  async deletar(id, escolaId) {
    const turma = await Turma.findOne({ _id: id, escolaId });

    if (!turma) {
      throw new Error("Turma não encontrada para a exclusão.");
    }

    await Turma.findByIdAndDelete(id);
    return { mensagem: "Turma excluída com sucesso." };
  }

}

export default new TurmaService();