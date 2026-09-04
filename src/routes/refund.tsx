import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund & Cancellation Policy — Regal Auto" },
      { name: "description", content: "Regal Auto refund and cancellation policy: timelines, deposit refunds, no-show rules and how refunds are processed." },
      { property: "og:title", content: "Refund & Cancellation Policy | Regal Auto" },
      { property: "og:description", content: "Cancellation timelines, deposit refunds and processing times." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/refund" }],
  }),
  component: () => (
    <LegalPage
      title="Refund & Cancellation Policy"
      badge="Legal"
      intro="Clear, fair cancellation rules — no hidden charges."
      sections={[
        { h: "Free Cancellation Window", p: "Cancel more than 48 hours before pickup and any advance payment is refunded in full." },
        { h: "Late Cancellation", p: "Cancellations within 48 hours of pickup are charged one day's rental. Wedding, limousine and event bookings require 7 days' notice for a full refund." },
        { h: "No-Show", p: "If nobody is available at the pickup location and we cannot reach you within 60 minutes, the booking is treated as a no-show and the advance is not refunded." },
        { h: "Our Cancellation", p: "If we cannot supply the booked vehicle or an equivalent upgrade, you receive a 100% refund of everything paid." },
        { h: "Security Deposit Refunds", p: "Deposits are released after vehicle inspection, normally within 3 working days of return." },
        { h: "Processing Time", p: "Approved refunds are processed to the original payment method or via bank transfer within 5 to 7 working days." },
      ]}
    />
  ),
});
