import dotenv from "dotenv";

// Charger les variables d'environnement depuis .env
dotenv.config();

interface EnvConfig {
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_PHONE_NUMBER: string;
  PORT: number;
  TWILIO_WEBHOOK_SECRET?: string;
}

/**
 * Valide et retourne la configuration d'environnement
 */
export function getEnvConfig(): EnvConfig {
  const requiredEnvVars = {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  };

  // Vérifier les variables requises
  const missingVars: string[] = [];
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missingVars.push(key);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes: ${missingVars.join(", ")}\n` +
        "Veuillez les définir dans votre fichier .env ou dans les variables d'environnement du système.",
    );
  }

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(
      `PORT invalide: ${process.env.PORT}. Doit être un nombre entre 1 et 65535.`,
    );
  }

  return {
    TWILIO_ACCOUNT_SID: requiredEnvVars.TWILIO_ACCOUNT_SID!,
    TWILIO_AUTH_TOKEN: requiredEnvVars.TWILIO_AUTH_TOKEN!,
    TWILIO_PHONE_NUMBER: requiredEnvVars.TWILIO_PHONE_NUMBER!,
    PORT: port,
    TWILIO_WEBHOOK_SECRET: process.env.TWILIO_WEBHOOK_SECRET,
  };
}

// Exporter la configuration validée
export const env = getEnvConfig();
