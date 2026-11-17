export function validerId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ erreur: "id invalide" });
  }
  req.id = id;
  next();
}