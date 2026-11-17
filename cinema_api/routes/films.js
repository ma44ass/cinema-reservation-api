import { Router } from "express";
import { films, seances, prochainId } from "../data.js";
import { validerId } from "../middlewares.js";

const router = Router();

// GET /films?genre=...&tri=duree
router.get("/", (req, res) => {
  let resultat = [...films];

  if (req.query.genre) {
    resultat = resultat.filter((f) => f.genre === req.query.genre);
  }
  if (req.query.tri === "duree") {
    resultat.sort((a, b) => a.duree - b.duree);
  }

  res.json(resultat);
});

// GET /films/:id
router.get("/:id", validerId, (req, res) => {
  const film = films.find((f) => f.id === req.id);
  if (!film) return res.status(404).json({ erreur: "Film introuvable" });
  res.json(film);
});

// GET /films/:id/seances
router.get("/:id/seances", validerId, (req, res) => {
  const film = films.find((f) => f.id === req.id);
  if (!film) return res.status(404).json({ erreur: "Film introuvable" });
  res.json(seances.filter((s) => s.filmId === film.id));
});

// POST /films
router.post("/", (req, res) => {
  const { titre, genre, duree } = req.body ?? {};

  // 1. Corps (400)
  if (typeof titre !== "string" || titre.trim() === "") {
    return res.status(400).json({ erreur: "titre obligatoire" });
  }
  if (typeof genre !== "string" || genre.trim() === "") {
    return res.status(400).json({ erreur: "genre obligatoire" });
  }
  if (typeof duree !== "number" || !(duree > 0)) {
    return res.status(400).json({ erreur: "duree doit être un nombre > 0" });
  }

 
  const existe = films.some(
    (f) => f.titre.toLowerCase() === titre.trim().toLowerCase()
  );
  if (existe) {
    return res.status(409).json({ erreur: "Ce film existe déjà" });
  }

  const film = { id: prochainId(films), titre: titre.trim(), duree, genre };
  films.push(film);
  res.status(201).json(film);
});

// DELETE /films/:id
router.delete("/:id", validerId, (req, res) => {
  const index = films.findIndex((f) => f.id === req.id);
  if (index === -1) return res.status(404).json({ erreur: "Film introuvable" });

  if (seances.some((s) => s.filmId === req.id)) {
    return res.status(409).json({ erreur: "Le film a encore des séances" });
  }

  films.splice(index, 1);
  res.status(204).end();
});

export default router;