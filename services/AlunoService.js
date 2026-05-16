import Aluno from '../models/Aluno.js';
import Usuario from '../models/Usuario.js';
import UsuarioService from "./UsuarioService.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class AlunoService {

  // 1. CREATE - Método para registar um novo aluno
  async registrar(dadosAluno, dadosUsuario) {
    // Criar o usuario
    const novoUsuario = await UsuarioService.criarUsuario({
      ...dadosUsuario,
      tipoUser: "aluno"
    });

    try {
      // Criar o aluno
      const novoAluno = new Aluno({
        ...dadosAluno,
        email: dadosUsuario.email,
        usuarioId: novoUsuario._id
      });

      return await novoAluno.save();

    } catch (error) {
      // Caso haja um erro na criação do aluno, deletamos o usuário criado
      await Usuario.findByIdAndDelete(novoUsuario._id);
      throw new Error(`Erro ao registar aluno: ${error.message}`);
    }
  }

  // 2. READ ALL - Método para listar todos os alunos
  async listarTodos(escolaId) {
    return await Aluno.find({ escolaId })
      .populate("usuarioId", "email tipoUser")
      .populate("escolaId", "nome cnpj")
      .populate("turmaId", "nome");
  }

  // 3. READ ONE - Método para buscar um aluno por ID
  async buscarPorId(id, escolaId) {
    const aluno = await Aluno.findOne({ _id: id, escolaId })
      .populate("usuarioId", "email tipoUser")
      .populate("escolaId", "nome")
      .populate("turmaId", "nome");

    if (!aluno) {
      throw new Error("Aluno não encontrado.");
    }
    return aluno;
  }

  // 4. UPDATE - Método para atualizar os dados do aluno
  async atualizar(id, dadosAtualizados, escolaId) {
    const alunoAtualizado = await Aluno.findOneAndUpdate(
      { _id: id, escolaId},
      dadosAtualizados, 
      { new: true }
    );

    if (!alunoAtualizado) {
      throw new Error("Aluno não encontrado para a atualização.");
    }
    return alunoAtualizado;
  }

  // 5. DELETE - Método para excluir um aluno
  async deletar(id, escolaId) {
    const aluno = await Aluno.findOne({ _id: id, escolaId });

    if (!aluno) {
      throw new Error("Aluno não encontrado para a exclusão.");
    }

    if (aluno.urlFotoAluno) {
      try {
        const partes = aluno.urlFotoAluno.split('/');
        const publicId = partes.slice(-3).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Erro ao apagar foto do aluno no Cloudinary:", err);
      }
    }

    if (aluno.urlFotoLaudo) {
      try {
        const partes = aluno.urlFotoLaudo.split('/');
        const publicId = partes.slice(-3).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Erro ao apagar laudo do aluno no Cloudinary:", err);
      }
    }

    // Apaga o aluno
    await Aluno.findByIdAndDelete(id);

    // Apaga o utilizador de acesso associado
    await Usuario.findByIdAndDelete(aluno.usuarioId);

    return { mensagem: "Aluno e credenciais de acesso excluídos com sucesso." };
  }
}

export default new AlunoService();