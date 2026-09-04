import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/legal-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Regal Auto Car Rental" },
      { name: "description", content: "Rental terms for Regal Auto: booking, driver policy, mileage limits, fuel, security deposit, damages and cancellation rules." },
      { property: "og:title", content: "Terms & Conditions | Regal Auto" },
      { property: "og:description", content: "Rental terms, driver policy, mileage and deposit rules." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <LegalPage
      title="Terms & Conditions"
      badge="Legal"
      intro="Please read these terms before confirming a rental with Regal Auto."
      sections={[
        { h: "Booking & Confirmation", p: "A booking is confirmed only after our team acknowledges it by phone or WhatsApp. Submitting the form creates an enquiry, not a guaranteed reservation." },
        { h: "Chauffeur Policy", p: "All rates are chauffeur-driven unless agreed otherwise in writing. Chauffeur duty is 12 hours per day; overtime is billed hourly." },
        { h: "Mileage & Fuel", p: "Daily rates include up to 300 km within the city. Fuel, tolls, parking and intercity allowances are billed to the customer unless included in a package." },
        { h: "Security Deposit", p: "A refundable security deposit is required for luxury and armoured vehicles. It is returned after the vehicle is inspected and returned in original condition." },
        { h: "Damages & Fines", p: "The customer is responsible for traffic fines during the rental period and for damage caused by misuse, negligence or unauthorised drivers." },
        { h: "Cancellation", p: "Cancellations more than 48 hours before pickup are free. Within 48 hours, one day's rent may be charged. Wedding and event bookings require 7 days' notice." },
        { h: "Prohibited Use", p: "Vehicles may not be used for racing, smuggling, subletting, off-road use (unless a 4x4 package), or any unlawful activity." },
      ]}
    />
  ),
});
