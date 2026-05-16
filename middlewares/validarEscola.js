import { z } from "zod";

// 1. Esquema de Validação para o Cadastro da Escola
const registroEscolaSchema = z.object({
  dadosUsuario: z.object({
    email: z.string().email("Formato de e-mail inválido."),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.")
  }),
  dadosEscola: z.object({
    nome: z.string().min(3, "O nome da escola deve ter no mínimo 3 letras."),
    cnpj: z.string().regex(/^\d{14}$/, "O CNPJ deve conter exatamente 14 números."),
    telefone: z.string().regex(/^\d{10,11}$/, "O telefone deve conter entre 10 e 11 números.").optional(),
    endereco: z.object({
      cidade: z.string().min(1, "A cidade é obrigatória."),
      bairro: z.string().min(1, "O bairro é obrigatório."),
      rua: z.string().min(1, "A rua é obrigatória.")
    })
  })
});

// 2. Esquema de Validação para a Atualização da Escola
const updateEscolaSchema = z.object({
  nome: z.string().min(3, "O nome da escola deve ter no mínimo 3 letras."),
  email: z.string().email("Formato de e-mail inválido."),
  cnpj: z.string().regex(/^\d{14}$/, "O CNPJ deve conter exatamente 14 números."),
  telefone: z.string().regex(/^\d{10,11}$/, "O telefone deve conter entre 10 e 11 números."),
  endereco: z.object({
    cidade: z.string().min(1, "A cidade é obrigatória."),
    bairro: z.string().min(1, "O bairro é obrigatório."),
    rua: z.string().min(1, "A rua é obrigatória.")
  }).partial() // Deixa os campos de endereço opcionais também
}).partial(); // O .partial() principal torna nome, telefone e endereco opcionais!


// --- MIDDLEWARES ---

export const validarCadastroEscola = (req, res, next) => {
  try {
    registroEscolaSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: "Erro de validação no cadastro",
        detalhes: error.issues.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }))
      });
    }
    // Se não for Zod, é um erro de código ou servidor
    console.error("Erro inesperado no validarCadastro:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

export const validarUpdateEscola = (req, res, next) => {
  try {
    // Usa o esquema flexível!
    updateEscolaSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        erro: "Erro de validação na atualização",
        detalhes: error.issues.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }))
      });
    }
    console.error("Erro inesperado no validarUpdate:", error);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};