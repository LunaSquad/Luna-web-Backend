import EscolaService from "../services/EscolaService.js";

class EscolaController {

  // 1. CREATE (POST /escolas)
  async criar(req, res) {
    try {
      // Dados já validades via middleware Zod
      const { dadosEscola, dadosUsuario } = req.body;

      const novaEscola = await EscolaService.registrar(dadosEscola, dadosUsuario);

      return res.status(201).json({
        mensagem: "Escola registrada com sucesso!",
        escola: novaEscola
      });

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // 2. READ ALL (GET /escolas)
  async listar(req, res) {
    try {
      const minhaEscola = await EscolaService.buscarPorId(req.usuario.escolaId);
      return res.status(200).json([minhaEscola]);

    } catch (error) {
      return res.status(500).json({ erro: "Erro interno - Ocorreu um erro ao listar as escolas." });
    }
  }

  // 3. READ ONE (GET /escolas/:id)
  async buscarPorId(req, res) {
    try {
      const escola = await EscolaService.buscarPorId(req.usuario.escolaId);
      return res.status(200).json(escola);

    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  // 4. UPDATE (PUT /escolas/:id)
  async atualizar(req, res) {
    try {
      const idSeguro = req.usuario.escolaId;
      const dadosAtualizados = req.body;

      const escolaAtualizada = await EscolaService.atualizar(id, dadosAtualizados);

      return res.status(200).json({ 
        mensagem: "Os dados da escola foram atualizados com sucesso!",
        escola: escolaAtualizada
      });

    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  // 5. DELETE (DELETE /escolas/:id)
  async deletar(req, res) {
    try {
      const idSeguro = req.usuario.escolaId;
      const resultado = await EscolaService.deletar(id);

      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

export default new EscolaController();