import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CITIES } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cities")({
  head: () => ({
    meta: [
      { title: "Cities We Serve — Regal Auto Luxury Rental Pakistan" },
      { name: "description", content: "Regal Auto luxury car rental in Islamabad, Rawalpindi, Lahore, Karachi, Faisalabad, Multan, Peshawar, Murree, Abbottabad, Sialkot, Gujranwala, Hyderabad and all Pakistan." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Cities We Serve — Regal Auto Luxury Rental" },
      { property: "og:description", content: "Chauffeur-driven luxury car rental across every major city in Pakistan." },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/cities" },
    ],
    links: [{ rel: "canonical", href: "/cities" }],
  }),
  component: CitiesPage,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
}

function CitiesPage() {
  const { data } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => (await supabase.from("cities").select("slug,name,description").order("sort_order")).data ?? [],
  });

  const cities = data?.length ? data : CITIES.map((c) => ({ slug: slugify(c), name: c, description: null }));

  return (
    <div>
      <section className="bg-luxury-gradient text-luxury-foreground pt-32 pb-16">
        <div className="container-wide">
          <Badge className="bg-primary/20 text-primary border-primary/30">Cities We Serve</Badge>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold">All of Pakistan, one fleet.</h1>
          <p className="mt-4 max-w-2xl text-white/70 text-lg">
            From Islamabad's diplomatic enclave to Karachi's harbour and every scenic road in between —
            we deliver luxury rentals with chauffeur, anywhere.
          </p>
        </div>
      </section>

      <section className="container-wide py-16">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {cities.map((c) => (
            <Link
              key={c.slug}
              to="/cities/$slug"
              params={{ slug: c.slug }}
              className="group rounded-2xl border bg-card p-6 shadow-card transition hover:border-primary hover:shadow-red hover:-translate-y-1"
            >
              <MapPin className="size-6 text-primary" />
              <h2 className="mt-4 font-display text-xl font-semibold group-hover:text-primary transition">{c.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.description ?? "Luxury rental with driver"}</p>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-center text-muted-foreground">
          …and every corner of Pakistan. Contact us for outstation packages.
        </p>
      </section>
    </div>
  );
}
