import { Link } from "@tanstack/react-router";
import { Heart, Users, Fuel, Gauge, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export interface VehicleCardData {
  id: string;
  slug: string;
  name: string;
  brand: string;
  images: string[] | null;
  price_per_day: number;
  price_per_week: number | null;
  price_per_month: number | null;
  seats: number | null;
  transmission: string | null;
  fuel: string | null;
  rating: number | null;
  is_available: boolean | null;
  is_featured?: boolean | null;
  city?: string | null;
}

export function VehicleCard({ v, priority }: { v: VehicleCardData; priority?: boolean }) {
  const [wished, setWished] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const img = v.images?.[0] || "/placeholder.svg";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  async function toggleWish(e: React.MouseEvent) {
    e.preventDefault();
    if (!userId) { toast.error("Sign in to save to wishlist"); return; }
    if (wished) {
      await supabase.from("wishlist").delete().eq("user_id", userId).eq("vehicle_id", v.id);
    } else {
      await supabase.from("wishlist").insert({ user_id: userId, vehicle_id: v.id });
    }
    setWished(!wished);
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-500 hover:shadow-hover hover:-translate-y-1">
      {v.is_featured && (
        <Badge className="absolute left-3 top-3 z-10 bg-primary text-primary-foreground border-0">Featured</Badge>
      )}
      <button
        onClick={toggleWish}
        aria-label="Add to wishlist"
        className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 backdrop-blur shadow-card transition hover:bg-primary hover:text-primary-foreground"
      >
        <Heart className={cn("size-4", wished && "fill-primary text-primary")} />
      </button>

      <Link to="/fleet/$slug" params={{ slug: v.slug }} className="block bg-shine">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={img}
            alt={`${v.brand} ${v.name}`}
            loading={priority ? "eager" : "lazy"}
            width={1024}
            height={768}
            className="size-full object-contain p-3 transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{v.brand}</p>
            <h3 className="font-display text-base md:text-lg font-semibold leading-tight">
              <Link to="/fleet/$slug" params={{ slug: v.slug }} className="hover:text-primary transition-colors">
                {v.name}
              </Link>
            </h3>
          </div>
          <div className="flex items-center gap-1 rounded-md bg-accent px-2 py-1">
            <Star className="size-3.5 fill-primary text-primary" />
            <span className="text-xs font-medium">{v.rating?.toFixed(1) ?? "5.0"}</span>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] md:text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="size-3.5" />{v.seats ?? 4}</span>
          <span className="flex items-center gap-1"><Gauge className="size-3.5" />{v.transmission ?? "Auto"}</span>
          <span className="flex items-center gap-1"><Fuel className="size-3.5" />{v.fuel ?? "Petrol"}</span>
          {v.city && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{v.city}</span>}
        </div>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] text-muted-foreground">Starting from</p>
            <p className="font-display text-lg md:text-2xl font-bold text-primary">
              PKR {Number(v.price_per_day).toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground">/day</span>
            </p>
          </div>
          <Link to="/fleet/$slug" params={{ slug: v.slug }}>
            <Button size="sm" className="bg-primary hover:bg-primary/90">Rent</Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
