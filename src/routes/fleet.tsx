import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VehicleCard } from "@/components/site/vehicle-card";
import { CATEGORIES, CITIES } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Rental Fleet — Luxury Cars for Rent in Pakistan | Regal Auto" },
      { name: "description", content: "Browse our full luxury rental fleet: Rolls Royce, Mercedes S-Class, Range Rover, Audi, BMW, Prado, Fortuner. Filter by city, category, price." },
      { property: "og:title", content: "Rental Fleet | Regal Auto" },
      { property: "og:description", content: "Full luxury car rental fleet across Pakistan." },
      { property: "og:url", content: "/fleet" },
    ],
    links: [{ rel: "canonical", href: "/fleet" }],
  }),
  component: FleetPage,
});

function FleetPage() {
  const { data } = useQuery({
    queryKey: ["all-vehicles"],
    queryFn: async () => {
      const { data } = await supabase.from("vehicles").select("*").eq("published", true);
      return data ?? [];
    },
  });

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<string>("featured");

  const filtered = useMemo(() => {
    let list = [...(data ?? [])];
    if (q) list = list.filter((v) => (v.name + " " + v.brand).toLowerCase().includes(q.toLowerCase()));
    if (sort === "price-asc") list.sort((a, b) => Number(a.price_per_day) - Number(b.price_per_day));
    if (sort === "price-desc") list.sort((a, b) => Number(b.price_per_day) - Number(a.price_per_day));
    if (sort === "rating") list.sort((a, b) => Number(b.rating) - Number(a.rating));
    if (sort === "featured") list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    return list;
  }, [data, q, sort, cat]);

  return (
    <div>
      <section className="relative bg-luxury-gradient text-luxury-foreground pt-32 pb-16">
        <div className="container-wide">
          <Badge className="bg-primary/20 text-primary border-primary/30">Rental Fleet</Badge>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold">Our Luxury Fleet</h1>
          <p className="mt-3 max-w-2xl text-white/70">Browse premium vehicles ready for immediate booking anywhere in Pakistan.</p>
        </div>
      </section>

      <section className="container-wide py-10">
        <div className="glass rounded-2xl p-4 md:p-5 shadow-card grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Prado, Mercedes, Audi…" className="pl-9 h-11" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((v) => <VehicleCard key={v.id} v={v as any} />)}
          {data && !filtered.length && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No vehicles found. Try adjusting filters.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
