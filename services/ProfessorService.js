import Professor from '../models/Professor.js';
import Usuario from '../models/Usuario.js';
import Turma from '../models/Turma.js';
import Aluno from '../models/Aluno.js';
import UsuarioService from "./UsuarioService.js";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

class ProfessorService {

  // 1. CREATE - Método para registrar um novo professor
  async registrar(dadosProfessor, dadosUsuario) {
    const novoUsuario = await UsuarioService.criarUsuario({
      ...dadosUsuario,
      tipoUser: "professor"
    });

    try {
      const novoProfessor = new Professor({
        ...dadosProfessor,
        email: dadosUsuario.email,
        usuarioId: novoUsuario._id
      });

      return await novoProfessor.save();

    } catch (error) {
      await Usuario.findByIdAndDelete(novoUsuario._id);

      throw new Error(`Erro ao registar professor: ${error.message}`);
    }
  }


  // 2. READ ALL - Método para listar todos os professores
  async listarTodos(escolaId) {
    return await Professor.find({ escolaId })
      .populate("usuarioId", "email tipoUser")
      .populate("escolaId", "nome cnpj");
  }


  // 3. READ ONE - Métodos para buscar um professor por ID
  async buscarPorId(id, escolaId) {
    const professor = await Professor.findOne({ _id: id, escolaId })
      .populate("usuarioId", "email tipoUser")
      .populate("escolaId", "nome");

    if (!professor) {
      throw new Error("Professor não encontrado.");
    }
    return professor;
  }


  // 4. UPDATE - Método para atualizar os dados do professor
  async atualizar(id, dadosAtualizados, escolaId) {
    const professorAtual = await Professor.findOne({ _id: id, escolaId });

    if (!professorAtual) {
      throw new Error("Professor não encontrado para a atualização.");
    }

    if (dadosAtualizados.urlFotoProfessor && professorAtual.urlFotoProfessor) {
      if (dadosAtualizados.urlFotoProfessor !== professorAtual.urlFotoProfessor) {
        try {
          const partes = professorAtual.urlFotoProfessor.split('/');
          const publicId = partes.slice(-3).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
          console.log(`Foto antiga apagada do Cloudinary: ${publicId}`);
        } catch (cloudinaryError) {
          console.error("Erro ao apagar a foto antiga do professor:", cloudinaryError);
        }
      }
    }

    const professorAtualizado = await Professor.findOneAndUpdate(
      { _id: id, escolaId },
      dadosAtualizados,
      { new: true }
    );

    if (!professorAtualizado) {
      throw new Error("Professor não encontrado para a atualização.");
    }
    return professorAtualizado;
  }


  // 5. DELETE - Método para excluir um professor
  async deletar(id, escolaId) {
    const professor = await Professor.findOne({ _id: id, escolaId });

    if (!professor) {
      throw new Error("Professor não encontrado para a exclusão.");
    }

    if (professor.urlFotoProfessor) {
      try {
        const partes = professor.urlFotoProfessor.split('/');
        const publicId = partes.slice(-3).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Erro ao apagar a foto do professor no Cloudinary:", cloudinaryError);
      }
    }

    await Professor.findByIdAndDelete(id);

    await Usuario.findByIdAndDelete(professor.usuarioId);

    return { mensagem: "Professor e credenciais de acesso excluídos com sucesso." };
  }
  

  // METODO PARA BUSCAR A TURMA DO PROFESSOR
  async buscarTurmaDoProfessor(usuarioId) {
    const professor = await Professor.findOne({ usuarioId });
    if (!professor) {
      throw new Error("Professor não encontrado no sistema.");
    }

    const turma = await Turma.findOne({ professorId: professor._id });

    if (!turma) {
      return {
        nome: "Sem Turma",
        letra: "",
        totalAlunos: 0,
        totalTarefas: 0,
        percentualConcluidas: 0,
        tarefasPendentes: 0
      };
    }

    const totalAlunos = await Aluno.countDocuments({ turmaId: turma._id });

    const partes = turma.nome.trim().split(" ");
    let nomePrincipal = turma.nome;
    let letra = "";

    if (partes.length > 1) {
      const ultimaParte = partes[partes.length - 1];
      if (ultimaParte.length <= 2) {
        letra = ultimaParte;
        nomePrincipal = partes.slice(0, -1).join(" ");
      }
    }

    return {
      nome: nomePrincipal,
      letra: letra,
      totalAlunos: totalAlunos,
      totalTarefas: 0,
      percentualConcluidas: 0,
      tarefasPendentes: 0
    };
  }
}

export default new ProfessorService();