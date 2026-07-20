import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/site/booking-dialog";
import { PACKAGES } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Chauffeur, Airport Transfer, Wedding, Corporate | Regal Auto" },
      { name: "description", content: "Regal Auto services: chauffeur service, airport transfer, wedding cars, corporate rental, VIP protection, outstation packages, long-term rental." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div>
      <section className="bg-luxury-gradient text-luxury-foreground pt-32 pb-16">
        <div className="container-wide">
          <Badge className="bg-primary/20 text-primary border-primary/30">Services</Badge>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold">Every ride, every occasion.</h1>
          <p className="mt-4 max-w-2xl text-white/70 text-lg">
            From boardroom to ballroom, airport to wedding hall — our packages cover every need.
          </p>
        </div>
      </section>

      <section className="container-wide py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <div key={p.title} className="group rounded-2xl border bg-card p-6 shadow-card transition hover:shadow-hover hover:-translate-y-1">
              <h3 className="font-display text-2xl font-semibold">{p.title}</h3>
              <p className="mt-3 text-muted-foreground">{p.desc}</p>
              <BookingDialog trigger={
                <Button variant="link" className="mt-4 px-0 text-primary">Enquire →</Button>
              } />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
