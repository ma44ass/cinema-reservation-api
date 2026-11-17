import { Router } from "express";

import { films, seances, prochainId, placesRestantes } from "../data.js";
import { validerId } from "../middlewares.js";

const router = Router();

// POST /seances
router.post("/", (req, res) => {
  const { filmId, date, heure, salle, places } = req.body ?? {};

  // 1. Corps (400)
  if (!Number.isInteger(filmId)) {
    return res.status(400).json({ erreur: "filmId obligatoire (entier)" });
  }
  for (const [nom, valeur] of [["date", date], ["heure", heure], ["salle", salle]]) {
    if (typeof valeur !== "string" || valeur.trim() === "") {
      return res.status(400).json({ erreur: `${nom} obligatoire` });
    }
  }
  if (!Number.isInteger(places) || places < 1) {
    return res.status(400).json({ erreur: "places doit être un entier >= 1" });
  }

  // 2. Existence (404)
  if (!films.some((f) => f.id === filmId)) {
    return res.status(404).json({ erreur: "Film introuvable" });
  }

  const seance = { id: prochainId(seances), filmId, date, heure, salle, places };
  seances.push(seance);
  res.status(201).json(seance);
});

// GET /seances/:id
router.get("/:id", validerId, (req, res) => {
  const seance = seances.find((s) => s.id === req.id);
  if (!seance) return res.status(404).json({ erreur: "Séance introuvable" });

  res.json({ ...seance, placesRestantes: placesRestantes(seance) });
});

export default router;