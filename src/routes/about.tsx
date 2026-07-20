import { createFileRoute } from "@tanstack/react-router";
import { Award, Clock, Shield, Star, Users, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Regal Auto — Luxury Car Rental Pakistan" },
      { name: "description", content: "Learn about Regal Auto — Pakistan's most trusted luxury car rental. 15 years of service, corporate discounts, chauffeur across all major cities." },
      { property: "og:title", content: "About Regal Auto" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="relative bg-luxury-gradient text-luxury-foreground pt-32 pb-20">
        <div className="container-wide">
          <Badge className="bg-primary/20 text-primary border-primary/30">About</Badge>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold max-w-3xl">
            Pakistan's most trusted luxury <span className="text-primary">rental partner</span>.
          </h1>
          <p className="mt-6 max-w-3xl text-white/80 text-lg">
            For over 15 years, Regal Auto has served corporates, embassies, celebrities and travellers with a
            premium chauffeured fleet — Rolls Royce, Mercedes, Range Rover, Audi and more.
          </p>
        </div>
      </section>

      <section className="container-wide py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Our Story</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We started with a single Corolla and a promise — deliver the finest cars with impeccable service.
              Today our fleet spans over 150 vehicles across 12 Pakistani cities, still driven by the same promise.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Banks, multinationals, hotels, tour operators, schools and colleges enjoy dedicated corporate
              discounts and priority dispatch.
            </p>
          </div>
          <div className="rounded-3xl bg-secondary p-8 md:p-10">
            <p className="font-display text-2xl leading-loose text-right" dir="rtl" lang="ur">
              ہماری کمپنی ہر قسم کی گاڑیاں ڈرائیور کے ساتھ روزانہ، ہفتہ وار اور ماہانہ معقول کرائے پر فراہم کرتی ہے۔
              اس کے علاوہ پاکستان کے کسی بھی شہر سے دوسرے شہر میں آنے جانے کی بہترین سروس فراہم کی جاتی ہے۔
              بینک، ملٹی نیشنل کمپنیوں، ہوٹلز، ٹور آپریٹرز، سکولز اور کالجز کے لیے خصوصی رعایت دستیاب ہے۔
            </p>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="container-wide">
          <h2 className="text-center font-display text-3xl md:text-4xl font-bold">Why choose us</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { i: Award, t: "Premium Fleet", d: "150+ luxury vehicles maintained to showroom standards." },
              { i: Users, t: "Professional Chauffeurs", d: "Vetted, uniformed, punctual drivers on every ride." },
              { i: Clock, t: "24/7 Availability", d: "Book any time, any city — round the clock support." },
              { i: Shield, t: "Fully Insured", d: "Comprehensive insurance on every rental." },
              { i: Star, t: "5-Star Rated", d: "Trusted by 10,000+ clients across Pakistan." },
              { i: Trophy, t: "Corporate Discounts", d: "Special rates for banks, MNCs, hotels and schools." },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl bg-card p-6 shadow-card">
                <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.i className="size-6" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
