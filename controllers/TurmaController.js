import TurmaService from "../services/TurmaService.js";

class TurmaController {

  // 1. CREATE (POST /turmas)
  async criar(req, res) {
    try {
      // Dados já validados via middleware Zod
      const dadosTurma = req.body;

      dadosTurma.escolaId = req.usuario.escolaId;

      const novaTurma = await TurmaService.registrar(dadosTurma);

      return res.status(201).json({
        mensagem: "Turma registrada com sucesso!",
        turma: novaTurma
      });

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // 2. READ ALL (GET /turmas)
  async listar(req, res) {
    try {
      const turmas = await TurmaService.listarTodas(req.usuario.escolaId);
      return res.status(200).json(turmas);

    } catch (error) {
      return res.status(500).json({ erro: "Erro interno ao listar os turmas." });
    }
  }

  // 3. READ ONE (GET /turmas/:id)
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const turma = await TurmaService.buscarPorId(id, req.usuario.escolaId);

      return res.status(200).json(turma);

    } catch (error) {
      return res.status(404).json({ erro: "Turma não encontrada." });
    }
  }

  // 4. UPDATE (PUT /turmas/:id)
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;

      const turmaAtualizada = await TurmaService.atualizar(id, dadosAtualizados, req.usuario.escolaId);

      return res.status(200).json({
        mensagem: "Os dados da turma foram atualizados com sucesso!",
        turma: turmaAtualizada
      });

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // 5. DELETE (DELETE /turmas/:id)
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await TurmaService.deletar(id, req.usuario.escolaId);

      return res.status(200).json(resultado);

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

export default new TurmaController();