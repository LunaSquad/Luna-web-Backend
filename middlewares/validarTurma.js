import { z } from "zod";

// Validação de ObjectId válido do MongoDB
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// 1. Esquema de Validação para o Cadastro da Turma
const registroTurmaSchema = z.object({
  nome: z.string().min(2, "O nome da turma deve ter no mínimo 2 caracteres."),
  escolaId: z.string().regex(objectIdRegex, "ID de escola inválido."),
  // professorId é opcional no momento da criação da turma
  professorId: z.string().regex(objectIdRegex, "ID de professor inválido.").optional() 
});

// 2. Esquema de Validação para a Atualização da Turma
const updateTurmaSchema = z.object({
  nome: z.string().min(2, "O nome da turma deve ter no mínimo 2 caracteres."),
  // Pode atualizar a escola (embora raro) ou o professor
  escolaId: z.string().regex(objectIdRegex, "ID de escola inválido."),
  professorId: z.string().regex(objectIdRegex, "ID de professor inválido.")
}).partial(); // O partial permite enviar apenas o campo que deseja atualizar

// --- MIDDLEWARES ---
export const validarCadastroTurma = (req, res, next) => {
  try {
    registroTurmaSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: "Erro de validação no registo da turma",
        detalhes: error.issues.map(err => ({ campo: err.path.join('.'), mensagem: err.message }))
      });
    }
    console.error("Erro inesperado no validarCadastroTurma:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

export const validarUpdateTurma = (req, res, next) => {
  try {
    updateTurmaSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: "Erro de validação na atualização da turma",
        detalhes: error.issues.map(err => ({ campo: err.path.join('.'), mensagem: err.message }))
      });
    }
    console.error("Erro inesperado no validarUpdateTurma:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};