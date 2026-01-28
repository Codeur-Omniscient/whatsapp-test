import { Router, Request, Response } from "express";
import { twilioService } from "../services/twilio.service";
import {
  TwilioWebhookMessage,
  TwilioWebhookStatus,
} from "../types/twilio.types";

const router = Router();

/**
 * Route pour recevoir les messages WhatsApp entrants
 * POST /webhooks/whatsapp
 */
router.post("/whatsapp", async (req: Request, res: Response) => {
  try {
    // Log de la requête complète pour debugging
    console.log("=== Webhook WhatsApp reçu ===");
    console.log("Headers:", JSON.stringify(req.headers, null, 2));
    console.log("Body:", JSON.stringify(req.body, null, 2));
    console.log("Query:", JSON.stringify(req.query, null, 2));

    // Validation de la signature Twilio (optionnel mais recommandé)
    const signature = req.headers["x-twilio-signature"] as string;
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    if (signature) {
      const isValid = twilioService.validateWebhookSignature(
        fullUrl,
        req.body as Record<string, string>,
        signature,
      );

      if (!isValid) {
        console.warn("⚠️ Signature Twilio invalide - requête rejetée");
        return res.status(403).send("Signature invalide");
      }
      console.log("✅ Signature Twilio validée");
    }

    // Parser les données du webhook
    const messageData = req.body as TwilioWebhookMessage;

    // Vérifier que c'est bien un message (pas un status callback)
    if (messageData.MessageSid && messageData.Body) {
      const from = messageData.From;
      const body = messageData.Body;
      const messageSid = messageData.MessageSid;

      console.log(`📨 Message reçu de ${from}: "${body}"`);
      console.log(`Message SID: ${messageSid}`);

      // Bot Echo : répondre avec le message reçu
      const echoMessage = `Echo: ${body}`;

      // Extraire le numéro WhatsApp (enlever le préfixe "whatsapp:")
      const recipientNumber = from.replace(/^whatsapp:/, "");

      console.log(`📤 Envoi de la réponse à ${recipientNumber}...`);

      try {
        const response = await twilioService.sendWhatsAppMessage({
          to: recipientNumber,
          body: echoMessage,
        });

        console.log(`✅ Message envoyé avec succès`);
        console.log(`Response SID: ${response.sid}`);
        console.log(`Status: ${response.status}`);
      } catch (error: any) {
        console.error("❌ Erreur lors de l'envoi de la réponse:", error);
        // On répond quand même 200 à Twilio pour éviter les retries
        // mais on log l'erreur pour debugging
      }
    } else {
      console.log(
        "ℹ️ Webhook reçu mais ce n'est pas un message (peut-être un status callback)",
      );
    }

    // Toujours répondre 200 à Twilio pour confirmer la réception
    res.status(200).send("OK");
  } catch (error: any) {
    console.error("❌ Erreur dans le webhook WhatsApp:", error);
    console.error("Stack:", error.stack);

    // Répondre 200 pour éviter que Twilio ne retry indéfiniment
    // mais loguer l'erreur pour debugging
    res.status(200).send("Error processed");
  }
});

/**
 * Route pour recevoir les status callbacks Twilio
 * POST /webhooks/whatsapp/status
 */
router.post("/whatsapp/status", async (req: Request, res: Response) => {
  try {
    const statusData = req.body as TwilioWebhookStatus;

    console.log("=== Status Callback reçu ===");
    console.log("Message SID:", statusData.MessageSid);
    console.log("Status:", statusData.MessageStatus);
    console.log("From:", statusData.From);
    console.log("To:", statusData.To);

    if (statusData.ErrorCode) {
      console.error("Error Code:", statusData.ErrorCode);
      console.error("Error Message:", statusData.ErrorMessage);
    }

    res.status(200).send("OK");
  } catch (error: any) {
    console.error("Erreur dans le status callback:", error);
    res.status(200).send("Error processed");
  }
});

export default router;
