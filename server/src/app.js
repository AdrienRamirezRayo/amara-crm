app.get("/", (req, res) => {
  res.send("AMARA CRM backend is live");
});
import express from "express";
import cors from "cors";

import translateRoutes from "./routes/translate.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/translate", translateRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

export default app;