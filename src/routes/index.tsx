import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Award, Clock, Shield, Sparkles, Star, MapPin, Car, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookingDialog } from "@/components/site/booking-dialog";
import { VehicleCard } from "@/components/site/vehicle-card";
import { Car3DCarousel } from "@/components/site/car-3d-carousel";
import { whatsappLink } from "@/lib/whatsapp";
import { CATEGORIES, CITIES, PACKAGES } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Regal Auto — Book Your Luxury Ride Anywhere in Pakistan" },
      { name: "description", content: "Rolls Royce, Mercedes S-Class, Range Rover, Audi. Chauffeur service, airport transfer, corporate rental & wedding cars across Pakistan. Book on WhatsApp 0317 5817400." },
      { property: "og:title", content: "Regal Auto — Luxury Car Rental Pakistan" },
      { property: "og:description", content: "Book luxury cars with chauffeur across Pakistan." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const { data } = useQuery({
    queryKey: ["featured-vehicles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .eq("published", true)
        .order("is_featured", { ascending: false })
        .order("rating", { ascending: false })
        .limit(8);
      return data ?? [];
    },
  });

  return (
    <>
      {/* HERO */}
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="Luxury Rolls Royce at night" className="size-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <Car3DCarousel />

        <div className="container-wide relative z-10 flex min-h-[100svh] flex-col justify-center pt-24 pb-20 text-white">
          <Badge className="w-fit bg-white/10 text-white border-white/20 backdrop-blur">
            <Sparkles className="mr-1.5 size-3" /> Pakistan's #1 Luxury Fleet
          </Badge>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.02] max-w-5xl animate-reveal">
            Book Your <span className="text-gradient-red">Luxury Ride</span><br />
            Anywhere in Pakistan
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-white/85">
            Luxury Cars · Chauffeur Service · Airport Transfer · Corporate Rental · Wedding Cars.
            Book Rolls Royce, Mercedes, Audi, Range Rover with driver — daily, weekly, monthly.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/fleet">
              <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 shadow-red text-base">
                Rent Now <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
            <BookingDialog trigger={
              <Button size="lg" variant="outline" className="h-14 px-8 border-white/40 bg-white/5 text-white hover:bg-white hover:text-luxury text-base backdrop-blur">
                Enquire Now
              </Button>
            } />
            <a href={whatsappLink("Hi Regal Auto, I want to book a luxury car.")} target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="h-14 px-8 border-[#25D366] bg-[#25D366] text-white hover:bg-[#1ea855] hover:border-[#1ea855] text-base">
                WhatsApp Now
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
            {[
              { icon: Car, n: "150+", l: "Luxury Vehicles" },
              { icon: MapPin, n: "12+", l: "Cities Served" },
              { icon: Users, n: "10K+", l: "Happy Clients" },
              { icon: Trophy, n: "15", l: "Years Trusted" },
            ].map((s) => (
              <div key={s.l} className="glass-dark rounded-2xl p-4">
                <s.icon className="size-6 text-primary" />
                <p className="mt-3 font-display text-3xl font-bold">{s.n}</p>
                <p className="text-xs text-white/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container-wide py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="outline" className="border-primary/30 text-primary">About Regal Auto</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold leading-tight">
              Pakistan's most trusted <span className="text-primary">luxury rental</span> partner.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We provide every type of vehicle with professional chauffeurs on daily, weekly & monthly rates.
              City-to-city travel across Pakistan is our specialty — with special corporate discounts for banks,
              multinationals, hotels, tour operators, schools and colleges.
            </p>
            <p className="mt-4 text-right font-display text-xl leading-loose" dir="rtl" lang="ur">
              ہماری کمپنی ہر قسم کی گاڑیاں ڈرائیور کے ساتھ روزانہ، ہفتہ وار اور ماہانہ معقول کرائے پر فراہم کرتی ہے۔
              بینک، ملٹی نیشنل کمپنیوں، ہوٹلز، سکولز اور کالجز کے لیے خصوصی رعایت دستیاب ہے۔
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, t: "Fully Insured", d: "Every ride covered" },
              { icon: Clock, t: "24/7 Service", d: "Anywhere in Pakistan" },
              { icon: Award, t: "Premium Fleet", d: "Rolls Royce to Corolla" },
              { icon: Star, t: "5-Star Rated", d: "10,000+ happy clients" },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl border bg-card p-5 shadow-card transition hover:shadow-hover hover:-translate-y-1">
                <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.t}</h3>
                <p className="text-sm text-muted-foreground">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED VEHICLES */}
      <section className="bg-secondary py-20 md:py-28">
        <div className="container-wide">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <Badge variant="outline" className="border-primary/30 text-primary">Our Fleet</Badge>
              <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold">Featured Luxury Vehicles</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">Hand-picked premium cars available for immediate booking.</p>
            </div>
            <Link to="/fleet"><Button variant="outline" size="lg">View All <ArrowRight className="ml-2 size-4" /></Button></Link>
          </div>

          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {data?.map((v, i) => (
              <VehicleCard key={v.id} v={v as any} priority={i < 4} />
            ))}
            {!data?.length && Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-wide py-20 md:py-28">
        <div className="text-center">
          <Badge variant="outline" className="border-primary/30 text-primary">Categories</Badge>
          <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold">Explore by Category</h2>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to="/fleet" search={{ cat: c.slug } as any}
              className="group rounded-xl border bg-card p-5 shadow-card transition hover:border-primary hover:shadow-red hover:-translate-y-0.5">
              <Car className="size-6 text-primary" />
              <h3 className="mt-3 font-display font-semibold group-hover:text-primary transition">{c.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      <section className="bg-luxury-gradient text-luxury-foreground py-20 md:py-28">
        <div className="container-wide">
          <div className="text-center">
            <Badge className="bg-primary/20 text-primary border-primary/30">Packages</Badge>
            <h2 className="mt-4 font-display text-4xl md:text-5xl font-bold">Curated Rental Packages</h2>
            <p className="mt-3 text-white/70">From airport transfer to VIP wedding — every occasion covered.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PACKAGES.map((p) => (
              <div key={p.title} className="glass-dark rounded-2xl p-6 transition hover:border-primary/50">
                <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-white/70">{p.desc}</p>
                <BookingDialog trigger={
                  <Button variant="link" className="mt-4 px-0 text-primary">Book now <ArrowRight className="ml-1 size-4" /></Button>
                } />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CITIES marquee */}
      <section className="py-16 border-y bg-secondary">
        <div className="container-wide text-center mb-6">
          <h3 className="font-display text-2xl md:text-3xl font-semibold">Serving all major cities of Pakistan</h3>
        </div>
        <div className="overflow-hidden">
          <div className="flex gap-8 animate-marquee w-max">
            {[...CITIES, ...CITIES].map((c, i) => (
              <span key={i} className="font-display text-2xl md:text-4xl text-muted-foreground/60 whitespace-nowrap">
                {c} <span className="text-primary">·</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide py-20 md:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-luxury-gradient p-8 md:p-14 text-luxury-foreground shadow-elegant">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight">
                Ready for your <span className="text-primary">luxury ride?</span>
              </h2>
              <p className="mt-4 text-white/80 text-lg">
                Book on WhatsApp — our team replies within minutes, 24/7.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <BookingDialog trigger={
                <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-base">Enquire Now</Button>
              } />
              <a href={whatsappLink("Hi Regal Auto, I want to book a car.")} target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="h-14 px-8 border-white/30 bg-white/10 text-white hover:bg-white hover:text-luxury">
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
