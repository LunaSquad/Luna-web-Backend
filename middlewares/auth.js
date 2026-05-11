import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  // 1. Pega o cabeçalho de autorização da requisição
  const authHeader = req.headers.authorization;

  // 2. Verifica se o token foi enviado
  if (!authHeader) {
    return res.status(401).json({ erro: "Acesso negado. Token não fornecido." });
  }

  // 3. O padrão é "Bearer TOKEN_GIGANTE_AQUI", então separamos pelo espaço
  const partes = authHeader.split(" ");

  if (partes.length !== 2 || partes[0] !== "Bearer") {
    return res.status(401).json({ erro: "Erro de formatação no Token." });
  }

  const token = partes[1];

  try {
    // 4. Verifica se o token é válido e se não expirou
    // Atenção: A string "LunaFatecProjeto2026SuperSeguro" (ou a que usaste no .env) tem de ser EXATAMENTE igual aqui
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Guarda as informações do utilizador (id, tipoUser) na requisição
    // Assim, o próximo controller sabe exatamente QUEM está a fazer a requisição
    req.usuario = decoded;

    // 6. Tudo certo! Pode prosseguir para a rota
    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
};