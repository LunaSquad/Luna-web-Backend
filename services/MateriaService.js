import Materia from '../models/Materia.js';

class MateriaService {

  // 1. READ ALL - Método para listar todas as matérias 
  async listarTodas() {
    // Busca as matérias em ordem alfabética
    return await Materia.find().sort({ nome: 1 }); 
  }

  // 2. READ ONE - Método para buscar uma matéria por ID
  async buscarPorId(id) {
    return await Materia.findById(id);
  }
}

export default new MateriaService();