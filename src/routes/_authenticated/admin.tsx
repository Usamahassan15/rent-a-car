import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Regal Auto" }, { name: "robots", content: "noindex" }] }),
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth" });
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!data) throw redirect({ to: "/profile" });
  },
  component: AdminPage,
});

function AdminPage() {
  const qc = useQueryClient();
  const { data: bookings } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: async () => (await supabase.from("bookings").select("*, vehicles(name,brand)").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: contacts } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: vehicles } = useQuery({
    queryKey: ["admin-vehicles"],
    queryFn: async () => (await supabase.from("vehicles").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: careers } = useQuery({
    queryKey: ["admin-careers"],
    queryFn: async () => (await supabase.from("career_applications").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  async function updateBookingStatus(id: string, status: string) {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-secondary">
      <div className="container-wide">
        <div className="flex items-center gap-3">
          <Shield className="size-7 text-primary" />
          <h1 className="font-display text-3xl md:text-4xl font-bold">Admin Panel</h1>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Stat label="Bookings" n={bookings?.length ?? 0} />
          <Stat label="Vehicles" n={vehicles?.length ?? 0} />
          <Stat label="Messages" n={contacts?.length ?? 0} />
          <Stat label="Applications" n={careers?.length ?? 0} />
        </div>

        <Tabs defaultValue="bookings" className="mt-8">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
            <TabsTrigger value="careers">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-4">
            <div className="rounded-xl border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings?.map((b: any) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <p className="font-medium">{b.full_name}</p>
                        <p className="text-xs text-muted-foreground">{b.phone}</p>
                      </TableCell>
                      <TableCell>{b.vehicles ? `${b.vehicles.brand} ${b.vehicles.name}` : "—"}</TableCell>
                      <TableCell className="text-xs">{b.pickup_date} → {b.return_date}</TableCell>
                      <TableCell><Badge variant="outline">{b.status}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => updateBookingStatus(b.id, "confirmed")}>Confirm</Button>
                          <Button size="sm" variant="outline" onClick={() => updateBookingStatus(b.id, "cancelled")}>Cancel</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="vehicles" className="mt-4">
            <div className="rounded-xl border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Price/day</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Published</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles?.map((v: any) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell>{v.brand}</TableCell>
                      <TableCell>PKR {Number(v.price_per_day).toLocaleString()}</TableCell>
                      <TableCell>{v.is_featured ? "★" : "—"}</TableCell>
                      <TableCell>{v.published ? "Yes" : "No"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="mt-4">
            <div className="rounded-xl border bg-card divide-y">
              {contacts?.map((c: any) => (
                <div key={c.id} className="p-4">
                  <div className="flex justify-between text-sm"><strong>{c.full_name}</strong><span className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span></div>
                  <p className="text-xs text-muted-foreground">{c.email} · {c.phone}</p>
                  <p className="mt-2 text-sm">{c.message}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="careers" className="mt-4">
            <div className="rounded-xl border bg-card divide-y">
              {careers?.map((c: any) => (
                <div key={c.id} className="p-4">
                  <div className="flex justify-between text-sm"><strong>{c.full_name}</strong><span className="text-muted-foreground">{c.position ?? "—"}</span></div>
                  <p className="text-xs text-muted-foreground">{c.email} · {c.phone}</p>
                  <p className="mt-2 text-sm">{c.cover_letter}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Stat({ label, n }: { label: string; n: number }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-card">
      <p className="text-xs uppercase text-muted-foreground tracking-wider">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-primary">{n}</p>
    </div>
  );
}
