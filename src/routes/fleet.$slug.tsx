import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Fuel, Gauge, Calendar, Shield, Award, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BookingDialog } from "@/components/site/booking-dialog";
import { VehicleCard } from "@/components/site/vehicle-card";
import { VehicleReviews } from "@/components/site/vehicle-reviews";
import { whatsappLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/fleet/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Rent ${decodeURIComponent(params.slug).replace(/-/g, " ")} — Regal Auto Pakistan` },
      { name: "description", content: `Rent luxury ${decodeURIComponent(params.slug).replace(/-/g, " ")} with chauffeur in Pakistan. Daily, weekly and monthly rates. Book on WhatsApp.` },
      { property: "og:type", content: "product" },
      { property: "og:url", content: `/fleet/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/fleet/${params.slug}` }],
  }),
  component: VehicleDetail,
});

function VehicleDetail() {
  const { slug } = Route.useParams();
  const { data: v, isLoading } = useQuery({
    queryKey: ["vehicle", slug],
    queryFn: async () => {
      const { data } = await supabase.from("vehicles").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      return data;
    },
  });
  const { data: related } = useQuery({
    queryKey: ["related", v?.category_id],
    enabled: !!v,
    queryFn: async () => {
      const { data } = await supabase.from("vehicles").select("*")
        .eq("published", true).neq("id", v!.id).limit(4);
      return data ?? [];
    },
  });

  if (isLoading) return <div className="container-wide pt-32 pb-20"><div className="animate-pulse h-96 rounded-2xl bg-muted" /></div>;
  if (!v) return (
    <div className="container-wide pt-32 pb-20 text-center">
      <h1 className="font-display text-3xl">Vehicle not found</h1>
      <Link to="/fleet"><Button className="mt-6">Back to Fleet</Button></Link>
    </div>
  );

  const images = (v.images && v.images.length ? v.images : ["/placeholder.svg"]);

  return (
    <div className="pt-24">
      <div className="container-wide py-6">
        <Link to="/fleet" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Back to Fleet
        </Link>
      </div>

      <section className="container-wide grid gap-10 lg:grid-cols-2 pb-16">
        <div>
          <div className="overflow-hidden rounded-3xl bg-shine aspect-[4/3] shadow-elegant">
            <img src={images[0]} alt={v.name} className="size-full object-contain p-6" width={1024} height={768} />
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((im, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-xl bg-shine border">
                  <img src={im} alt={`${v.name} ${i + 1}`} className="size-full object-contain p-2" loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-widest text-primary">{v.brand}</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">{v.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`size-4 ${i < Math.round(Number(v.rating ?? 5)) ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({v.review_count ?? 0} reviews)</span>
          </div>

          <p className="mt-6 text-muted-foreground leading-relaxed">{v.description ?? "Premium luxury rental — professional chauffeur, fully insured, ready for any occasion."}</p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { i: Users, l: "Seats", v: v.seats ?? 4 },
              { i: Gauge, l: "Trans.", v: v.transmission ?? "Auto" },
              { i: Fuel, l: "Fuel", v: v.fuel ?? "Petrol" },
              { i: Calendar, l: "Year", v: v.year ?? "—" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border p-3 text-center">
                <s.i className="mx-auto size-5 text-primary" />
                <p className="mt-2 text-[11px] text-muted-foreground uppercase tracking-wider">{s.l}</p>
                <p className="text-sm font-semibold">{s.v as any}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border bg-shine p-5 shadow-card">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[11px] uppercase text-muted-foreground">Per Day</p>
                <p className="font-display text-2xl font-bold text-primary">PKR {Number(v.price_per_day).toLocaleString()}</p>
              </div>
              <div className="border-x">
                <p className="text-[11px] uppercase text-muted-foreground">Per Week</p>
                <p className="font-display text-2xl font-bold">{v.price_per_week ? `PKR ${Number(v.price_per_week).toLocaleString()}` : "—"}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-muted-foreground">Per Month</p>
                <p className="font-display text-2xl font-bold">{v.price_per_month ? `PKR ${Number(v.price_per_month).toLocaleString()}` : "—"}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <BookingDialog vehicleId={v.id} vehicleName={v.name} trigger={
              <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 shadow-red flex-1 min-w-[200px]">Rent Now</Button>
            } />
            <a href={whatsappLink(`Hi, I want to book the ${v.name}.`)} target="_blank" rel="noreferrer" className="flex-1 min-w-[200px]">
              <Button size="lg" variant="outline" className="h-14 px-8 w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                WhatsApp
              </Button>
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {v.driver_included && <span className="flex items-center gap-1"><Check className="size-4 text-primary" /> Driver included</span>}
            {v.insurance_included && <span className="flex items-center gap-1"><Shield className="size-4 text-primary" /> Insured</span>}
            {v.security_deposit && <span className="flex items-center gap-1"><Award className="size-4 text-primary" /> Deposit PKR {Number(v.security_deposit).toLocaleString()}</span>}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16">
        <div className="container-wide">
          <Tabs defaultValue="features">
            <TabsList>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="terms">Rental Terms</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="features" className="mt-6">
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {(v.features?.length ? v.features : ["Leather seats", "Climate control", "Bluetooth", "GPS", "Sunroof", "Premium audio"]).map((f: string) => (
                  <li key={f} className="flex items-center gap-2"><Check className="size-4 text-primary" />{f}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="terms" className="mt-6 prose max-w-none">
              <ul>
                <li>Professional chauffeur included on all luxury rentals.</li>
                <li>Security deposit refundable at return.</li>
                <li>Fuel charged separately unless included in package.</li>
                <li>Mileage limit: {v.mileage_limit_km ?? "unlimited"} km/day within city.</li>
                <li>Comprehensive insurance included.</li>
                <li>Cancellation up to 24h before pickup for full refund.</li>
              </ul>
            </TabsContent>
            <TabsContent value="faq" className="mt-6">
              <Accordion type="single" collapsible>
                {[
                  ["Is a driver included?", "Yes, all luxury rentals include a professional chauffeur."],
                  ["Can I take the car outside the city?", "Absolutely — outstation packages are available with per-km rates."],
                  ["What documents do I need?", "A valid CNIC/passport is required for booking."],
                  ["Can I pay via card?", "Yes, cash, card and bank transfer are accepted."],
                ].map(([q, a]) => (
                  <AccordionItem key={q} value={q}>
                    <AccordionTrigger>{q}</AccordionTrigger>
                    <AccordionContent>{a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <VehicleReviews vehicleId={v.id} vehicleName={v.name} />

      <section className="container-wide py-16">

        <h2 className="font-display text-3xl md:text-4xl font-bold">You may also like</h2>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {related?.map((r) => <VehicleCard key={r.id} v={r as any} />)}
        </div>
      </section>
    </div>
  );
}
