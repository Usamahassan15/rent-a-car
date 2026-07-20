import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ClipboardList } from "lucide-react";

export const Route = createFileRoute("/_authenticated/bookings")({
  head: () => ({ meta: [{ title: "My Bookings — Regal Auto" }, { name: "robots", content: "noindex" }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const { data } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("*, vehicles(name,brand)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="pt-24 pb-16 min-h-screen bg-secondary">
      <div className="container-wide">
        <Badge variant="outline">Rentals</Badge>
        <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold">My Bookings</h1>

        {!data?.length ? (
          <div className="mt-12 text-center py-20 border rounded-2xl bg-card">
            <ClipboardList className="mx-auto size-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No bookings yet.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {data.map((b: any) => (
              <div key={b.id} className="rounded-xl border bg-card p-5 shadow-card flex flex-wrap items-center gap-4 justify-between">
                <div>
                  <p className="font-display text-lg font-semibold">
                    {b.vehicles?.brand} {b.vehicles?.name ?? "—"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {b.pickup_date} → {b.return_date} · {b.pickup_city}
                  </p>
                </div>
                <Badge variant={b.status === "confirmed" ? "default" : "outline"}>{b.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
