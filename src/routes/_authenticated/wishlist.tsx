import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { VehicleCard } from "@/components/site/vehicle-card";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_authenticated/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Regal Auto" }, { name: "robots", content: "noindex" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { data } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase.from("wishlist").select("vehicle_id, vehicles(*)").eq("user_id", user.id);
      return (data ?? []).map((r: any) => r.vehicles).filter(Boolean);
    },
  });

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container-wide">
        <Badge variant="outline">Saved</Badge>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold">My Wishlist</h1>

        {!data?.length ? (
          <div className="mt-12 text-center py-20 border rounded-2xl">
            <Heart className="mx-auto size-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Nothing saved yet.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {data.map((v: any) => <VehicleCard key={v.id} v={v} />)}
          </div>
        )}
      </div>
    </div>
  );
}
