export const WHATSAPP_NUMBER_RAW = "923175817400"; // 0317 5817400 in international format
export const WHATSAPP_NUMBER_DISPLAY = "0317 5817400";
export const BRAND_NAME = "Regal Auto";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER_RAW}?text=${encodeURIComponent(message)}`;
}

export interface BookingWhatsAppInput {
  full_name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  vehicle?: string;
  pickup_city?: string;
  drop_city?: string;
  pickup_date?: string;
  return_date?: string;
  pickup_time?: string;
  message?: string;
  promo_code?: string;
}

export function bookingMessage(b: BookingWhatsAppInput) {
  const lines = [
    `*New ${BRAND_NAME} Booking Enquiry*`,
    ``,
    `👤 Name: ${b.full_name}`,
    `📞 Phone: ${b.phone}`,
    b.whatsapp ? `💬 WhatsApp: ${b.whatsapp}` : null,
    b.email ? `✉️ Email: ${b.email}` : null,
    ``,
    b.vehicle ? `🚘 Vehicle: ${b.vehicle}` : null,
    b.pickup_city ? `📍 Pickup: ${b.pickup_city}` : null,
    b.drop_city ? `🏁 Drop: ${b.drop_city}` : null,
    b.pickup_date ? `📅 From: ${b.pickup_date}${b.pickup_time ? " " + b.pickup_time : ""}` : null,
    b.return_date ? `📅 To: ${b.return_date}` : null,
    b.promo_code ? `🎟 Promo: ${b.promo_code}` : null,
    b.message ? `\n📝 ${b.message}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}
