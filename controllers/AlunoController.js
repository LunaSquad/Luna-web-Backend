import AlunoService from "../services/AlunoService.js";

class AlunoController {

  // 1. CREATE (POST /alunos)
  async criar(req, res) {
    try {
      // Dados já validados via middleware Zod
      const { dadosAluno, dadosUsuario } = req.body;
      
      const novoAluno = await AlunoService.registrar(dadosAluno, dadosUsuario);

      return res.status(201).json({
        mensagem: "Aluno registrado com sucesso!",
        aluno: novoAluno
      });
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // 2. READ ALL (GET /alunos)
  async listar(req, res) {
    try {
      const alunos = await AlunoService.listarTodos();
      return res.status(200).json(alunos);
    } catch (error) {
      return res.status(500).json({ erro: "Erro interno ao listar os alunos." });
    }
  }

  // 3. READ ONE (GET /alunos/:id)
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const aluno = await AlunoService.buscarPorId(id);

      return res.status(200).json(aluno);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  // 4. UPDATE (PUT /alunos/:id)
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;

      const alunoAtualizado = await AlunoService.atualizar(id, dadosAtualizados);

      return res.status(200).json({ 
        mensagem: "Os dados do aluno foram atualizados com sucesso!",
        aluno: alunoAtualizado
      });
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // 5. DELETE (DELETE /alunos/:id)
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await AlunoService.deletar(id);

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

export default new AlunoController();