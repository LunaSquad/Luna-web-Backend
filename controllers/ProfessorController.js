import ProfessorService from "../services/ProfessorService.js";

class ProfessorController {

  // 1. CREATE (POST /professores)
  async criar(req, res) {
    try {
      // Dados já validados via middleware Zod
      const { dadosProfessor, dadosUsuario } = req.body;
      
      const novoProfessor = await ProfessorService.registrar(dadosProfessor, dadosUsuario);

      return res.status(201).json({
        mensagem: "Professor registado com sucesso!",
        professor: novoProfessor
      });
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // 2. READ ALL (GET /professores)
  async listar(req, res) {
    try {
      const professores = await ProfessorService.listarTodos();
      return res.status(200).json(professores);
    } catch (error) {
      return res.status(500).json({ erro: "Erro interno ao listar os professores." });
    }
  }

  // 3. READ ONE (GET /professores/:id)
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const professor = await ProfessorService.buscarPorId(id);

      return res.status(200).json(professor);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  // 4. UPDATE (PUT /professores/:id)
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;

      const professorAtualizado = await ProfessorService.atualizar(id, dadosAtualizados);

      return res.status(200).json({ 
        mensagem: "Os dados do professor foram atualizados com sucesso!",
        professor: professorAtualizado
      });
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // 5. DELETE (DELETE /professores/:id)
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await ProfessorService.deletar(id);

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

export default new ProfessorController();