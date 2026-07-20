import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Tag, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/site/booking-dialog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Deals & Packages — Discount Luxury Rentals | Regal Auto" },
      { name: "description", content: "Special offers, weekend deals, corporate discounts and flash sales on luxury car rentals across Pakistan." },
      { property: "og:url", content: "/deals" },
    ],
    links: [{ rel: "canonical", href: "/deals" }],
  }),
  component: DealsPage,
});

const fallback = [
  { slug: "weekend", title: "Weekend Getaway", subtitle: "Fri–Sun in Murree or Nathia Gali", description: "Prado + chauffeur for the perfect weekend escape.", discount_percent: 15, code: "WEEKEND15" },
  { slug: "corporate", title: "Corporate Fleet", subtitle: "Monthly contracts for MNCs & banks", description: "Dedicated fleet and drivers with priority dispatch.", discount_percent: 20, code: "CORP20" },
  { slug: "wedding", title: "Wedding Season", subtitle: "Rolls Royce · Mercedes S · Limousine", description: "Full decoration and professional chauffeur included.", discount_percent: 10, code: "SHAADI10" },
  { slug: "student", title: "Student Special", subtitle: "Valid student ID required", description: "Budget rentals for graduation, farewells & trips.", discount_percent: 12, code: "STUDENT12" },
];

function DealsPage() {
  const { data } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      const { data } = await supabase.from("deals").select("*").eq("is_active", true);
      return data ?? [];
    },
  });
  const deals = data && data.length ? data : (fallback as any[]);

  return (
    <div>
      <section className="bg-luxury-gradient text-luxury-foreground pt-32 pb-16">
        <div className="container-wide">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            <Sparkles className="mr-1 size-3" /> Limited Time
          </Badge>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold">Deals & Packages</h1>
          <p className="mt-4 max-w-2xl text-white/70 text-lg">Save on your next luxury ride.</p>
        </div>
      </section>

      <section className="container-wide py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((d) => (
            <div key={d.slug} className="relative overflow-hidden rounded-2xl bg-card border shadow-card p-6 transition hover:shadow-hover hover:-translate-y-1">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/10" />
              <Tag className="size-6 text-primary relative" />
              <h3 className="mt-4 font-display text-2xl font-bold relative">{d.title}</h3>
              <p className="mt-1 text-sm text-primary font-medium relative">{d.subtitle}</p>
              <p className="mt-3 text-muted-foreground relative">{d.description}</p>
              {d.discount_percent && (
                <p className="mt-4 relative"><span className="font-display text-4xl font-bold text-primary">{d.discount_percent}%</span> <span className="text-sm text-muted-foreground">OFF</span></p>
              )}
              {d.code && (
                <div className="mt-3 inline-block rounded-md border-2 border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 relative">
                  <span className="text-xs text-muted-foreground">Code </span>
                  <span className="font-mono font-bold text-primary">{d.code}</span>
                </div>
              )}
              <BookingDialog trigger={
                <Button className="mt-5 w-full bg-primary hover:bg-primary/90 relative">Claim Offer</Button>
              } />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
