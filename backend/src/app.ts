import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./lib/env";
import { errorHandler } from "./middleware/errorHandler";
import passport from "./lib/passport";
import routes from "./routes";
import openApiDocument from "../openapi.json";

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api-docs/openapi.json", (_req, res) => {
  res.json(openApiDocument);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use("/api", routes);
app.use(errorHandler);

export default app;
