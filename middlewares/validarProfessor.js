import { z } from "zod";

// Validação de ObjectId válido do MongoDB
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// 1. Esquema de Validação para o Cadastro do Professor
const registroProfessorSchema = z.object({
  dadosUsuario: z.object({
    email: z.string().email("Formato de e-mail inválido."),
    senha: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres.")
  }),
  dadosProfessor: z.object({
    nome: z.string().min(2, "O nome deve ter no mínimo 2 letras."),
    sobrenome: z.string().min(2, "O sobrenome deve ter no mínimo 2 letras."),
    cpf: z.string().regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números (sem pontos ou traços)."),
    rg: z.string().min(4, "O RG é obrigatório."),
    dataNasc: z.string().datetime("A data de nascimento deve estar no formato ISO (ex: 1990-01-01T00:00:00Z)."),
    cidade: z.string().min(2, "A cidade é obrigatória."),
    telefone: z.string().regex(/^\d{10,11}$/, "O telefone deve conter entre 10 e 11 números.").optional()
  })
});

// 2. Esquema de Validação para a Atualização do Professor
const updateProfessorSchema = z.object({
  nome: z.string().min(2, "O nome deve ter no mínimo 2 letras."),
  sobrenome: z.string().min(2, "O sobrenome deve ter no mínimo 2 letras."),
  cpf: z.string().regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números."),
  rg: z.string().min(4, "O RG é obrigatório."),
  dataNasc: z.string().datetime("Formato de data inválido."),
  cidade: z.string().min(2, "A cidade é obrigatória."),
  telefone: z.string().regex(/^\d{10,11}$/, "O telefone deve conter entre 10 e 11 números.")
}).partial();

// --- MIDDLEWARES ---

export const validarCadastroProfessor = (req, res, next) => {
  try {
    registroProfessorSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: "Erro de validação no registo do professor",
        detalhes: error.issues.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }))
      });
    }
    // Se não for Zod, é um erro de código ou servidor
    console.error("Erro inesperado no validarCadastroProfessor:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

export const validarUpdateProfessor = (req, res, next) => {
  try {
    updateProfessorSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: "Erro de validação na atualização do professor",
        detalhes: error.issues.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }))
      });
    }
    console.error("Erro inesperado no validarUpdateProfessor:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};