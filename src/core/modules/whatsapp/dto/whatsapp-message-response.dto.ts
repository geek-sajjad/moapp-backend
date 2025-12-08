interface WhatsappContacts {
  input: string; // The phone number provided in the request.

  wa_id: string; // The WhatsApp ID of the contact.
}
interface WhatsappMessages {
  id: string; // The unique ID of the message.
  message_status: string;
}

export class WhatsappSendMessageResponseDto {
  messaging_product: string;

  contacts: WhatsappContacts[];

  messages: WhatsappMessages[];
}
