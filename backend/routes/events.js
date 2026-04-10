import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEventFormOptions,
  getEventQrCode,
  getEvents,
  updateEvent,
} from "../controllers/eventscontrollers.js";

const router = express.Router();

// Recuperer tous les evenements
router.get("/events", getEvents);

// Recuperer les options du formulaire d'evenement
router.get("/event-options", getEventFormOptions);

// Recuperer un evenement par son id
router.get("/events/:id/qrcode", getEventQrCode);

// Recuperer un evenement par son id
router.get("/events/:id", getEventById);

// Ajouter un evenement
router.post("/events", createEvent);

// Modifier un evenement
router.put("/events/:id", updateEvent);
router.patch("/events/:id", updateEvent);

// Supprimer un evenement
router.delete("/events/:id", deleteEvent);

export default router;
