import express from "express";
import {
  createUser,
  deleteUser,
  getUserApiStatus,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userscontrollers.js";

const router = express.Router();

// Petite route de test
router.get("/users/health", getUserApiStatus);

// Recuperer tous les utilisateurs
router.get("/users", getUsers);

// Recuperer un utilisateur par id
router.get("/users/:id", getUserById);

// Ajouter un utilisateur
router.post("/users", createUser);

// Modifier un utilisateur
router.put("/users/:id", updateUser);
router.patch("/users/:id", updateUser);

// Supprimer un utilisateur
router.delete("/users/:id", deleteUser);

export default router;
