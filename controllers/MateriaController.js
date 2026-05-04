import MateriaService from "../services/MateriaService.js";

class MateriaController {

  // 1. READ ALL (GET /materias)
  async listar(req, res) {
    try {
      const materias = await MateriaService.listarTodas();
      return res.status(200).json(materias);

    } catch (error) {
      return res.status(500).json({ erro: "Erro interno ao listar as matérias." });
    }
  }

  // 2. READ ONE (GET /materias/:id)
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const materia = await MateriaService.buscarPorId(id);

      if (!materia) {
        return res.status(404).json({ erro: "Matéria não encontrada." });
      }
      
      return res.status(200).json(materia);

    } catch (error) {
      return res.status(500).json({ erro: "Erro interno ao buscar a matéria." });
    }
  }
}

export default new MateriaController();