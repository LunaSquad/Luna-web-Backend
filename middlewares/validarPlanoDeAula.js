import { z } from "zod";

// Validação de ObjectId válido do MongoDB
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// 1. Esquema de Validação para o Cadastro do Plano de Aula
const registroPlanoDeAulaSchema = z.object({
  materiaId: z.string().regex(objectIdRegex, "ID de matéria inválido."),
  titulo: z.string().min(3, "O título deve ter no mínimo 3 caracteres."),
  descricao: z.string().min(5, "A descrição deve ter no mínimo 5 caracteres."),
  status: z.enum(["andamento", "concluido", "pendente", "expirada"], {
    errorMap: () => ({ message: "Status inválido. Escolha: andamento, concluido, pendente ou expirada." })
  })
});

// 2. Esquema de Validação para a Atualização do Plano de Aula
const updatePlanoDeAulaSchema = z.object({
  materiaId: z.string().regex(objectIdRegex, "ID de matéria inválido."),
  titulo: z.string().min(3, "O título deve ter no mínimo 3 caracteres."),
  descricao: z.string().min(5, "A descrição deve ter no mínimo 5 caracteres."),
  status: z.enum(["andamento", "concluido", "pendente", "expirada"], {
    errorMap: () => ({ message: "Status inválido. Escolha: andamento, concluido, pendente ou expirada." })
  })
}).partial();

// --- MIDDLEWARES ---

export const validarCadastroPlanoDeAula = (req, res, next) => {
  try {
    registroPlanoDeAulaSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: "Erro de validação no registro do plano de aula",
        detalhes: error.issues.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }))
      });
    }
    // Se não for Zod, é um erro de código ou servidor
    console.error("Erro inesperado no validarCadastroPlanoDeAula:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

export const validarUpdatePlanoDeAula = (req, res, next) => {
  try {
    updatePlanoDeAulaSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: "Erro de validação na atualização do plano de aula",
        detalhes: error.issues.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }))
      });
    }
    console.error("Erro inesperado no validarUpdatePlanoDeAula:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};