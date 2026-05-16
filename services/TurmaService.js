import Turma from '../models/Turma.js';
import Professor from '../models/Professor.js';
import Aluno from '../models/Aluno.js';

class TurmaService {

  // 1. CREATE - Método para registrar uma nova turma
  async registrar(dadosTurma) {
    try {
      const professorValido = await Professor.findOne({
        _id: dadosTurma.professorId,
        escolaId: dadosTurma.escolaId
      });

      if (!professorValido) {
        throw new Error("O professor selecionado não foi encontrado.");
      }

      const novaTurma = new Turma({
        nome: dadosTurma.nome,
        escolaId: dadosTurma.escolaId,
        professorId: dadosTurma.professorId
      });
      const turmaSalva = await novaTurma.save();

      if (dadosTurma.alunosIds && dadosTurma.alunosIds.length > 0) {
        await Aluno.updateMany(
          { _id: { $in: dadosTurma.alunosIds }, escolaId: dadosTurma.escolaId },
          { $set: { turmaId: turmaSalva._id } }
        );
      }

      return turmaSalva;

    } catch (error) {
      throw new Error(`Erro ao registrar a turma: ${error.message}`);
    }

  }
  

  // 2. READ ALL - Método para listar todas as turmas
  async listarTodas(escolaId) {
    const turmas = await Turma.find({ escolaId })
      .populate("professorId", "nome sobrenome email")
      .lean();

    const turmasComDados = await Promise.all(
      turmas.map(async (turma) => {
        const alunos = await Aluno.find({ turmaId: turma._id }, '_id');
        const ids = alunos.map(a => a._id);

        return {
          ...turma,
          alunosIds: ids,
          totalAlunos: ids.length
        };
      })
    );

    return turmasComDados;
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
      { nome: dadosAtualizados.nome, professorId: dadosAtualizados.professorId },
      { new: true }
    );

    if (!turmaAtualizada) throw new Error("Turma não encontrada.");

    if (dadosAtualizados.alunosIds) {
      await Aluno.updateMany({ turmaId: id, escolaId }, { $set: { turmaId: null } });

      if (dadosAtualizados.alunosIds.length > 0) {
        await Aluno.updateMany(
          { _id: { $in: dadosAtualizados.alunosIds }, escolaId },
          { $set: { turmaId: id } }
        );
      }
    }
    return turmaAtualizada;
  }


  // 5. DELETE - Método para excluir uma turma
  async deletar(id, escolaId) {
    const turma = await Turma.findOne({ _id: id, escolaId });

    if (!turma) {
      throw new Error("Turma não encontrada para a exclusão.");
    }

    await Aluno.updateMany(
      { turmaId: id, escolaId: escolaId },
      { $set: { turmaId: null } }
    );

    await Turma.findByIdAndDelete(id);

    return { mensagem: "Turma excluída e alunos desvinculados com sucesso." };
  }
}

export default new TurmaService();