import express from "express";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;
const distPath = path.resolve(__dirname, "..", "dist");
const indexPath = path.join(distPath, "index.html");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.post("/api/leads", (request, response) => {
  const { email } = request.body ?? {};

  if (typeof email !== "string" || !emailRegex.test(email)) {
    response.status(400).json({ ok: false, error: "Valid email is required." });
    return;
  }

  response.json({ ok: true, leadId: randomUUID() });
});

app.post("/api/action-plan/pdf", (_request, response) => {
  response.json({ ok: true, message: "PDF generation not implemented yet" });
});

app.use(express.static(distPath));

app.get("*", (request, response, next) => {
  if (request.path.startsWith("/api")) {
    next();
    return;
  }

  response.sendFile(indexPath);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
