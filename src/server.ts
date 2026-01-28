import express, { Request, Response, NextFunction } from "express";
import { env } from "./config/env";
import webhookRoutes from "./routes/webhooks";

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour parser les données URL-encoded (Twilio envoie parfois en form-data)
app.use(express.urlencoded({ extended: true }));

// Middleware de logging pour toutes les requêtes
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  console.log("Query params:", req.query);
  next();
});

// Route de santé pour vérifier que le serveur fonctionne
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Twilio WhatsApp Bot",
  });
});

// Route racine
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Twilio WhatsApp Bot API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      webhook: "/webhooks/whatsapp",
      statusCallback: "/webhooks/whatsapp/status",
    },
  });
});

// Routes webhook
app.use("/webhooks", webhookRoutes);

// Middleware de gestion des erreurs
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Erreur non gérée:", err);
  console.error("Stack:", err.stack);

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Une erreur est survenue",
  });
});

// Gestion des routes non trouvées
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} non trouvée`,
  });
});

// Démarrer le serveur
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 Serveur Twilio WhatsApp Bot démarré");
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Environnement: ${process.env.NODE_ENV || "development"}`);
  console.log(`📱 Numéro Twilio: ${env.TWILIO_PHONE_NUMBER}`);
  console.log("=".repeat(50));
  console.log(`✅ Serveur prêt à recevoir les webhooks`);
  console.log(`   Webhook URL: http://localhost:${PORT}/webhooks/whatsapp`);
  console.log(
    `   Status Callback: http://localhost:${PORT}/webhooks/whatsapp/status`,
  );
  console.log("=".repeat(50));
});

// Gestion gracieuse de l'arrêt
process.on("SIGTERM", () => {
  console.log("SIGTERM reçu, arrêt du serveur...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT reçu, arrêt du serveur...");
  process.exit(0);
});
