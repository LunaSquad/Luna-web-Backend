import PlanoDeAula from "../models/PlanoDeAula.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class PlanoDeAulaService {
  async criar(dados) {
    try {
      const novoPlano = new PlanoDeAula(dados);
      return await novoPlano.save();
    } catch (error) {
      throw new Error(`Erro ao criar plano de aula: ${error.message}`);
    }
  }

  // Lista todos os planos de um professor específico
  async listarPorProfessor(professorId) {
    try {
      return await PlanoDeAula.find({ professorId })
        .populate("materiaId", "nome") // Traz o nome da matéria junto
        .sort({ createdAt: -1 }); // Traz os mais recentes primeiro
    } catch (error) {
      throw new Error(`Erro ao buscar planos de aula: ${error.message}`);
    }
  }

  async buscarPorId(id, professorId) {
    try {
      const plano = await PlanoDeAula.findOne({ _id: id, professorId }).populate("materiaId", "nome");
      if (!plano) throw new Error("Plano de aula não encontrado ou não pertence a este professor.");
      return plano;
    } catch (error) {
      throw new Error(`Erro ao buscar o plano de aula: ${error.message}`);
    }
  }

  async atualizar(id, professorId, dadosAtualizados) {
    try {
      const planoAtual = await PlanoDeAula.findOne({ _id: id, professorId });
      
      if (!planoAtual) {
        throw new Error("Plano de aula não encontrado para edição.");
      }

      if (dadosAtualizados.urlPlanoDeAula && planoAtual.urlPlanoDeAula) {
        if (dadosAtualizados.urlPlanoDeAula !== planoAtual.urlPlanoDeAula) {
          try {
            const partes = planoAtual.urlPlanoDeAula.split('/');
            const publicId = partes.slice(-3).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error("Erro ao apagar PDF antigo do plano de aula:", err);
          }
        }
      }

      const planoAtualizado = await PlanoDeAula.findOneAndUpdate(
        { _id: id, professorId },
        dadosAtualizados,
        { new: true, runValidators: true }
      );
      
      return planoAtualizado;
    } catch (error) {
      throw new Error(`Erro ao atualizar o plano de aula: ${error.message}`);
    }
  }

  async deletar(id, professorId) {
    try {
      const plano = await PlanoDeAula.findOne({ _id: id, professorId });

      if (!plano) {
        throw new Error("Plano de aula não encontrado para exclusão.");
      }

      if (plano.urlPlanoDeAula) {
        try {
          const partes = plano.urlPlanoDeAula.split('/');
          const publicId = partes.slice(-3).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Erro ao apagar PDF do plano no Cloudinary:", err);
        }
      }

      await PlanoDeAula.findByIdAndDelete(id);

      return { mensagem: "Plano de aula e PDF excluídos com sucesso." };
    } catch (error) {
      throw new Error(`Erro ao deletar o plano de aula: ${error.message}`);
    }
  }
}

export default new PlanoDeAulaService();