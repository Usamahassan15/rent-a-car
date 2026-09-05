import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/site/vehicle-card";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/cities/$slug")({
  head: ({ params }) => {
    const city = decodeURIComponent(params.slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `Luxury Car Rental in ${city} with Driver — Regal Auto` },
        { name: "description", content: `Rent luxury cars in ${city} with professional chauffeur. Prado, Range Rover, Mercedes, Audi, wedding cars and airport transfers at daily, weekly and monthly rates.` },
        { property: "og:type", content: "website" },
        { property: "og:title", content: `Luxury Car Rental in ${city} — Regal Auto` },
        { property: "og:description", content: `Chauffeur-driven luxury car rental in ${city}, Pakistan. Book instantly on WhatsApp.` },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: `/cities/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/cities/${params.slug}` }],
    };
  },
  component: CityPage,
});

function CityPage() {
  const { slug } = Route.useParams();
  const label = decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const { data: city } = useQuery({
    queryKey: ["city", slug],
    queryFn: async () => (await supabase.from("cities").select("*").eq("slug", slug).maybeSingle()).data,
  });

  const { data: vehicles } = useQuery({
    queryKey: ["city-vehicles", slug],
    queryFn: async () => {
      const { data: c } = await supabase.from("cities").select("id").eq("slug", slug).maybeSingle();
      const q = supabase.from("vehicles").select("*, cities(name)").eq("published", true).order("is_featured", { ascending: false }).limit(12);
      const { data } = c ? await q.eq("city_id", c.id) : await q;
      return data ?? [];
    },
  });

  const name = city?.name ?? label;

  return (
    <div>
      <section className="bg-luxury-gradient text-luxury-foreground pt-32 pb-16">
        <div className="container-wide">
          <Link to="/cities" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-primary">
            <ArrowLeft className="size-4" /> All cities
          </Link>
          <Badge className="mt-4 bg-primary/20 text-primary border-primary/30">
            <MapPin className="mr-1 size-3.5" /> {name}
          </Badge>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold">Luxury Car Rental in {name}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            {city?.description ?? `Chauffeur-driven luxury rentals in ${name} — weddings, corporate travel, airport transfers and outstation trips. Daily, weekly and monthly packages with insurance included.`}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/fleet"><Button size="lg" className="h-13 px-8">Browse the fleet</Button></Link>
            <a href={whatsappLink(`Hi, I need a luxury car rental in ${name}.`)} target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="h-13 px-8 border-white/30 text-white hover:bg-white hover:text-luxury">
                <Phone className="mr-2 size-4" /> WhatsApp us
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="container-wide py-16">
        <h2 className="font-display text-3xl md:text-4xl font-bold">Cars available in {name}</h2>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {vehicles?.map((v: any) => (
            <VehicleCard key={v.id} v={{ ...v, city: v.cities?.name ?? name }} />
          ))}
        </div>
        {!vehicles?.length && <p className="mt-6 text-muted-foreground">Fleet listing is loading — contact us for availability in {name}.</p>}
      </section>

      <section className="bg-secondary py-16">
        <div className="container-wide grid gap-6 md:grid-cols-3">
          {[
            ["Airport transfers", `24/7 pick & drop from ${name} airport with meet-and-greet chauffeur.`],
            ["Wedding cars", `Decorated Rolls Royce, Mercedes S-Class and limousines for ${name} weddings.`],
            ["Corporate fleet", `Monthly executive rentals for companies based in ${name}.`],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border bg-card p-6 shadow-card">
              <h3 className="font-display text-xl font-semibold">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
