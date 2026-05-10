import { z } from "zod";

// Validação de ObjectId válido do MongoDB
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// 1. Esquema de Validação para o Cadastro do Aluno
const registroAlunoSchema = z.object({
  dadosUsuario: z.object({
    email: z.string().email("Formato de e-mail inválido."),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.")
  }),
  dadosAluno: z.object({
    escolaId: z.string().regex(objectIdRegex, "ID de escola inválido."),
    // turmaId é opcional no momento da criação, pois o aluno pode ser cadastrado antes da enturmação
    turmaId: z.string().regex(objectIdRegex, "ID de turma inválido.").optional(),
    nome: z.string().min(2, "O nome deve ter no mínimo 2 letras."),
    cpf: z.string().regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números (sem pontos ou traços)."),
    dataNasc: z.string().datetime("A data de nascimento deve estar no formato ISO (ex: 2010-05-20T00:00:00Z)."),
    telefone: z.string().regex(/^\d{10,11}$/, "O telefone deve conter entre 10 e 11 dígitos numéricos."),
    nomeResponsavel: z.string().min(2, "O nome do responsável é obrigatório."),
    cpfResponsavel: z.string().regex(/^\d{11}$/, "O CPF do responsável deve conter exatamente 11 números.")
    // Os campos de URL e Hiperfoco foram omitidos aqui pois serão preenchidos via Mobile ou têm valor padrão
  })
});

// 2. Esquema de Validação para a Atualização do Aluno
const updateAlunoSchema = z.object({
  turmaId: z.string().regex(objectIdRegex, "ID de turma inválido."),
  nome: z.string().min(2, "O nome deve ter no mínimo 2 letras."),
  email: z.string().email("Formato de e-mail inválido."),
  cpf: z.string().regex(/^\d{11}$/, "O CPF deve conter exatamente 11 números."),
  dataNasc: z.string().datetime("Formato de data inválido."),
  telefone: z.string().regex(/^\d{10,11}$/, "O telefone deve conter entre 10 e 11 dígitos numéricos."),
  nomeResponsavel: z.string().min(2, "O nome do responsável é obrigatório."),
  cpfResponsavel: z.string().regex(/^\d{11}$/, "O CPF do responsável deve conter exatamente 11 números.")
}).partial(); // O partial deixa tudo opcional na hora do PUT, atualizando só o que foi enviado

// --- MIDDLEWARES ---

export const validarCadastroAluno = (req, res, next) => {
  try {
    registroAlunoSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: "Erro de validação no registro do aluno",
        detalhes: error.issues.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }))
      });
    }
    console.error("Erro inesperado no validarCadastroAluno:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

export const validarUpdateAluno = (req, res, next) => {
  try {
    updateAlunoSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: "Erro de validação na atualização do aluno",
        detalhes: error.issues.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }))
      });
    }
    console.error("Erro inesperado no validarUpdateAluno:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};