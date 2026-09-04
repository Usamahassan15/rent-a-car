import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Regal Auto Car Rental Pakistan" },
      { name: "description", content: "How Regal Auto collects, uses and protects your personal data when you book a luxury car rental in Pakistan." },
      { property: "og:title", content: "Privacy Policy | Regal Auto" },
      { property: "og:description", content: "How Regal Auto handles and protects your booking data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      badge="Legal"
      intro="We collect only what we need to confirm your booking and deliver your vehicle safely."
      sections={[
        { h: "Information We Collect", p: "Name, phone number, WhatsApp number, email, pickup and drop-off details, rental dates and any message you send us through our booking or contact forms." },
        { h: "How We Use It", p: "To confirm reservations, dispatch your chauffeur, contact you about your rental, issue invoices and comply with legal record-keeping requirements. We also use it to respond to support requests." },
        { h: "WhatsApp Communication", p: "When you submit a booking enquiry, your details are sent to our reservations team on WhatsApp so we can confirm availability quickly. We do not use your number for bulk marketing without consent." },
        { h: "Data Sharing", p: "We never sell your data. Details are shared only with the assigned chauffeur, and with authorities where legally required." },
        { h: "Data Security", p: "Bookings are stored on encrypted cloud infrastructure with strict access controls. Only authorised staff can view reservation records." },
        { h: "Your Rights", p: "You may request access to, correction of, or deletion of your personal data at any time by contacting us." },
      ]}
    />
  ),
});
