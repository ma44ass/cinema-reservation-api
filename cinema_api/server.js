import express from "express";

import filmsRouter from "./routes/films.js";
import seancesRouter from "./routes/seances.js";
import reservationsRouter from "./routes/reservations.js";

const app = express();
app.use(express.json());

// Journal de chaque requête
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/films", filmsRouter);
app.use("/seances", seancesRouter);
app.use("/", reservationsRouter);

// Toute URL inconnue
app.use((req, res) => {
  res.status(404).json({ erreur: "Route inconnue" });
});

app.listen(3000, () => console.log("Serveur sur http://localhost:3000"));