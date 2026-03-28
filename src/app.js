import express from "express";
import cors from "cors";
import translateRoutes from "./routes/translate.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/translate", translateRoutes);

export default app;