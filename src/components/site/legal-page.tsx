import { Badge } from "@/components/ui/badge";
import { WHATSAPP_NUMBER_DISPLAY } from "@/lib/whatsapp";

type Section = { h: string; p: string };

export function LegalPage({
  title,
  badge,
  intro,
  sections,
}: {
  title: string;
  badge: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <div>
      <section className="bg-luxury-gradient text-luxury-foreground pt-32 pb-16">
        <div className="container-wide">
          <Badge className="bg-primary/20 text-primary border-primary/30">{badge}</Badge>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="mt-4 max-w-2xl text-white/70">{intro}</p>
        </div>
      </section>

      <section className="container-wide py-16">
        <div className="max-w-3xl space-y-8">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-2xl font-semibold">{s.h}</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">{s.p}</p>
            </div>
          ))}
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">Questions?</h2>
            <p className="mt-2 text-muted-foreground">
              Contact our team on WhatsApp or call {WHATSAPP_NUMBER_DISPLAY} — we respond 24/7.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
