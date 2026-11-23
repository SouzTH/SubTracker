import app from "./app";
import { env } from "./lib/env";

app.listen(env.port, () => {
  console.log(`SubTracker API rodando em http://localhost:${env.port}`);
});
