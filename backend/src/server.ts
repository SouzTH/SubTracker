import cors from "cors";
import express from "express";
import { env } from "./lib/env";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

app.use(cors({ origin: env.frontendUrl }));
app.use(express.json());

// Health check simples — útil pra confirmar que o servidor está de pé
// antes de testar qualquer rota autenticada.
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

// Precisa ser o ÚLTIMO `app.use`: o Express só chama um middleware com
// 4 parâmetros (err, req, res, next) quando algo antes dele chamou
// `next(err)` — e isso só funciona se ele estiver depois de todas as rotas.
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`SubTracker API rodando em http://localhost:${env.port}`);
});
