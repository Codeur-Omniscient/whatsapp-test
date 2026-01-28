/**
 * Types pour les webhooks Twilio WhatsApp
 */

export interface TwilioWebhookMessage {
  MessageSid: string;
  AccountSid: string;
  MessagingServiceSid?: string;
  From: string; // Numéro WhatsApp de l'expéditeur (format: whatsapp:+1234567890)
  To: string; // Numéro WhatsApp de destination (notre numéro)
  Body: string; // Contenu du message
  NumMedia: string; // Nombre de médias attachés
  ProfileName?: string; // Nom du profil WhatsApp
  WaId?: string; // WhatsApp ID
  SmsStatus?: string;
  SmsSid?: string;
}

export interface TwilioWebhookStatus {
  MessageSid: string;
  AccountSid: string;
  From: string;
  To: string;
  MessageStatus:
    | "queued"
    | "sent"
    | "delivered"
    | "failed"
    | "undelivered"
    | "read";
  ErrorCode?: string;
  ErrorMessage?: string;
}

export interface TwilioSendMessageOptions {
  to: string; // Format: whatsapp:+1234567890
  body: string;
  from?: string; // Optionnel si MessagingServiceSid est utilisé
}

export interface TwilioSendMessageResponse {
  sid: string;
  status: string;
  dateCreated: Date;
  dateSent?: Date;
  dateUpdated: Date;
  to: string;
  from: string;
  body: string;
}
