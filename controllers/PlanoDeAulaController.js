import PlanoDeAulaService from "../services/PlanoDeAulaService.js";

class PlanoDeAulaController {
  async criar(req, res) {
    try {
      const dados = req.body;
      dados.professorId = req.usuario.professorId;

      // Se houver upload de um PDF/Arquivo através do multer
      if (req.file) {
        dados.urlPlanoDeAula = req.file.path;
      }

      const novoPlano = await PlanoDeAulaService.criar(dados);

      return res.status(201).json({
        mensagem: "Plano de aula criado com sucesso!",
        plano: novoPlano
      });

    } catch (error) {
      if (req.file && req.file.filename) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (cloudinaryError) {
          console.error("Erro ao fazer rollback do PDF do plano de aula:", cloudinaryError);
        }
      }
      return res.status(400).json({ erro: error.message });
    }
  }

  async listar(req, res) {
    try {
      const planos = await PlanoDeAulaService.listarPorProfessor(req.usuario.professorId);
      return res.status(200).json(planos);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const plano = await PlanoDeAulaService.buscarPorId(req.params.id, req.usuario.professorId);
      return res.status(200).json(plano);
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const dadosAtualizados = req.body;

      if (req.file) {
        dadosAtualizados.urlPlanoDeAula = req.file.path;
      }

      const planoAtualizado = await PlanoDeAulaService.atualizar(
        req.params.id,
        req.usuario.professorId,
        dadosAtualizados
      );

      return res.status(200).json({
        mensagem: "Plano atualizado com sucesso!",
        plano: planoAtualizado
      });

    } catch (error) {
      if (req.file && req.file.filename) {
        try {
          await cloudinary.uploader.destroy(req.file.filename);
        } catch (cloudinaryError) {
          console.error("Erro ao fazer rollback do PDF do plano de aula:", cloudinaryError);
        }
      }
      return res.status(400).json({ erro: error.message });
    }
  }

  async deletar(req, res) {
    try {
      await PlanoDeAulaService.deletar(req.params.id, req.usuario.professorId);
      return res.status(200).json({ mensagem: "Plano de aula deletado com sucesso!" });
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

export default new PlanoDeAulaController();