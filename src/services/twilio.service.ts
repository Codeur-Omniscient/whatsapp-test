import twilio from "twilio";
import { env } from "../config/env";
import {
  TwilioSendMessageOptions,
  TwilioSendMessageResponse,
} from "../types/twilio.types";

/**
 * Service pour interagir avec l'API Twilio
 */
class TwilioService {
  private client: twilio.Twilio;
  private phoneNumber: string;

  constructor() {
    this.client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
    this.phoneNumber = env.TWILIO_PHONE_NUMBER;
  }

  /**
   * Envoie un message WhatsApp
   * @param options Options pour l'envoi du message
   * @returns Réponse de l'API Twilio
   */
  async sendWhatsAppMessage(
    options: TwilioSendMessageOptions,
  ): Promise<TwilioSendMessageResponse> {
    try {
      // S'assurer que le numéro de destination est au format WhatsApp
      const to = options.to.startsWith("whatsapp:")
        ? options.to
        : `whatsapp:${options.to}`;

      // Utiliser le numéro configuré si aucun numéro d'expéditeur n'est fourni
      const from = options.from
        ? options.from.startsWith("whatsapp:")
          ? options.from
          : `whatsapp:${options.from}`
        : `whatsapp:${this.phoneNumber}`;

      const message = await this.client.messages.create({
        body: options.body,
        from: from,
        to: to,
      });

      return {
        sid: message.sid,
        status: message.status,
        dateCreated: message.dateCreated || new Date(),
        dateSent: message.dateSent || undefined,
        dateUpdated: message.dateUpdated || new Date(),
        to: message.to,
        from: message.from || "",
        body: message.body || "",
      };
    } catch (error) {
      console.error("Erreur lors de l'envoi du message WhatsApp:", error);
      throw error;
    }
  }

  /**
   * Valide la signature d'un webhook Twilio (optionnel mais recommandé)
   * @param url URL complète du webhook
   * @param params Paramètres de la requête
   * @param signature Signature fournie par Twilio
   * @returns true si la signature est valide
   */
  validateWebhookSignature(
    url: string,
    params: Record<string, string>,
    signature: string,
  ): boolean {
    if (!env.TWILIO_WEBHOOK_SECRET) {
      console.warn(
        "TWILIO_WEBHOOK_SECRET non configuré, validation de signature ignorée",
      );
      return true; // Si pas de secret configuré, on accepte (non recommandé en production)
    }

    try {
      return twilio.validateRequest(
        env.TWILIO_WEBHOOK_SECRET,
        signature,
        url,
        params,
      );
    } catch (error) {
      console.error("Erreur lors de la validation de la signature:", error);
      return false;
    }
  }
}

// Export d'une instance singleton
export const twilioService = new TwilioService();
