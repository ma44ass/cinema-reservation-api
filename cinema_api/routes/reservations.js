import { Router } from "express";

import { seances, reservations, prochainId, placesRestantes } from "../data.js";
import { validerId } from "../middlewares.js";

const router = Router();

// POST /seances/:id/reservations
router.post("/seances/:id/reservations", validerId, (req, res) => {
  const { nom, nbPlaces } = req.body ?? {};

  // 1. Corps (400)
  if (typeof nom !== "string" || nom.trim() === "") {
    return res.status(400).json({ erreur: "nom obligatoire" });
  }
  if (!Number.isInteger(nbPlaces) || nbPlaces < 1 || nbPlaces > 10) {
    return res.status(400).json({ erreur: "nbPlaces doit être un entier entre 1 et 10" });
  }

  // 2. Existence (404)
  const seance = seances.find((s) => s.id === req.id);
  if (!seance) return res.status(404).json({ erreur: "Séance introuvable" });

  // 3. Règle métier (409)
  if (nbPlaces > placesRestantes(seance)) {
    return res.status(409).json({ erreur: "Pas assez de places restantes" });
  }

  const reservation = {
    id: prochainId(reservations),
    seanceId: seance.id,
    nom: nom.trim(),
    nbPlaces
  };
  reservations.push(reservation);
  res.status(201).json(reservation);
});

// GET /seances/:id/reservations
router.get("/seances/:id/reservations", validerId, (req, res) => {
  const seance = seances.find((s) => s.id === req.id);
  if (!seance) return res.status(404).json({ erreur: "Séance introuvable" });

  res.json(reservations.filter((r) => r.seanceId === seance.id));
});

// DELETE /reservations/:id
router.delete("/reservations/:id", validerId, (req, res) => {
  const index = reservations.findIndex((r) => r.id === req.id);
  if (index === -1) return res.status(404).json({ erreur: "Réservation introuvable" });

  reservations.splice(index, 1);
  res.status(204).end();
});

export default router;