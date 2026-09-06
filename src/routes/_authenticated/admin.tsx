import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { VehicleDialog } from "@/components/admin/vehicle-dialog";
import { DealDialog, PostDialog } from "@/components/admin/content-dialogs";
import { Shield, Plus, Pencil, Trash2, Download } from "lucide-react";

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
  const { data: reviews } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => (await supabase.from("reviews").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: deals } = useQuery({
    queryKey: ["admin-deals"],
    queryFn: async () => (await supabase.from("deals").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: posts } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => (await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  async function remove(table: "vehicles" | "deals" | "blog_posts" | "reviews", id: string, key: string) {
    if (!window.confirm("Delete this permanently?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: [key] });
    qc.invalidateQueries({ queryKey: ["all-vehicles"] });
  }

  async function toggle(table: "deals" | "blog_posts", id: string, patch: { published?: boolean; is_active?: boolean }, key: string) {
    const { error } = await supabase.from(table).update(patch as never).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: [key] });
  }

  function exportBookings() {
    const rows = bookings ?? [];
    if (!rows.length) return toast.error("No bookings to export");
    const head = ["Name", "Phone", "Email", "Vehicle", "Pickup", "Return", "Pickup city", "Drop city", "Status", "Created"];
    const csv = [head, ...rows.map((b: any) => [
      b.full_name, b.phone, b.email ?? "", b.vehicles ? `${b.vehicles.brand} ${b.vehicles.name}` : "",
      b.pickup_date, b.return_date, b.pickup_city ?? "", b.drop_city ?? "", b.status,
      new Date(b.created_at).toLocaleString(),
    ])].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `regal-auto-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }



  async function updateBookingStatus(id: string, status: "confirmed" | "cancelled" | "pending" | "active" | "completed") {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  }

  async function updateVehicle(id: string, patch: { published?: boolean; is_featured?: boolean; is_available?: boolean }) {
    const { error } = await supabase.from("vehicles").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Vehicle updated");
    qc.invalidateQueries({ queryKey: ["admin-vehicles"] });
    qc.invalidateQueries({ queryKey: ["all-vehicles"] });
    qc.invalidateQueries({ queryKey: ["featured-vehicles"] });
  }

  async function setReviewApproved(id: string, approved: boolean) {
    const { error } = await supabase.from("reviews").update({ approved }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(approved ? "Review approved" : "Review hidden");
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
  }

  async function setContactHandled(id: string, handled: boolean) {
    const { error } = await supabase.from("contact_messages").update({ handled }).eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-contacts"] });
  }


  return (
    <div className="pt-24 pb-16 min-h-screen bg-secondary">
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Shield className="size-7 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold">Admin Panel</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportBookings}><Download className="mr-2 size-4" />Export bookings</Button>
            <VehicleDialog trigger={<Button><Plus className="mr-2 size-4" />Add vehicle</Button>} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Bookings" n={bookings?.length ?? 0} />
          <Stat label="Vehicles" n={vehicles?.length ?? 0} />
          <Stat label="Messages" n={contacts?.length ?? 0} />
          <Stat label="Applications" n={careers?.length ?? 0} />
          <Stat label="Offers" n={deals?.length ?? 0} />
          <Stat label="Blog posts" n={posts?.length ?? 0} />
        </div>

        <Tabs defaultValue="bookings" className="mt-8">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="deals">Offers</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="contacts">Messages</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
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
                    <TableHead>Available</TableHead>
                    <TableHead>Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles?.map((v: any) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell>{v.brand}</TableCell>
                      <TableCell>PKR {Number(v.price_per_day).toLocaleString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant={v.is_featured ? "default" : "outline"} onClick={() => updateVehicle(v.id, { is_featured: !v.is_featured })}>
                          {v.is_featured ? "★ Featured" : "Feature"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant={v.published ? "default" : "outline"} onClick={() => updateVehicle(v.id, { published: !v.published })}>
                          {v.published ? "Live" : "Draft"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant={v.is_available ? "default" : "outline"} onClick={() => updateVehicle(v.id, { is_available: !v.is_available })}>
                          {v.is_available ? "Available" : "Booked"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <VehicleDialog vehicle={v} trigger={<Button size="sm" variant="outline" aria-label="Edit vehicle"><Pencil className="size-4" /></Button>} />
                          <Button size="sm" variant="outline" aria-label="Delete vehicle" onClick={() => remove("vehicles", v.id, "admin-vehicles")}>
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="deals" className="mt-4">
            <div className="flex justify-end">
              <DealDialog trigger={<Button size="sm"><Plus className="mr-2 size-4" />New offer</Button>} />
            </div>
            <div className="mt-3 rounded-xl border bg-card divide-y">
              {deals?.map((d: any) => (
                <div key={d.id} className="p-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong>{d.title}</strong>
                      {d.discount_percent && <Badge variant="outline">{d.discount_percent}% off</Badge>}
                      {d.code && <Badge variant="outline">{d.code}</Badge>}
                      {!d.is_active && <Badge variant="outline">Inactive</Badge>}
                    </div>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{d.subtitle ?? d.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant={d.is_active ? "default" : "outline"} onClick={() => toggle("deals", d.id, { is_active: !d.is_active }, "admin-deals")}>
                      {d.is_active ? "Live" : "Hidden"}
                    </Button>
                    <DealDialog deal={d} trigger={<Button size="sm" variant="outline" aria-label="Edit offer"><Pencil className="size-4" /></Button>} />
                    <Button size="sm" variant="outline" aria-label="Delete offer" onClick={() => remove("deals", d.id, "admin-deals")}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {!deals?.length && <p className="p-6 text-sm text-muted-foreground">No offers yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="blog" className="mt-4">
            <div className="flex justify-end">
              <PostDialog trigger={<Button size="sm"><Plus className="mr-2 size-4" />New post</Button>} />
            </div>
            <div className="mt-3 rounded-xl border bg-card divide-y">
              {posts?.map((p: any) => (
                <div key={p.id} className="p-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong>{p.title}</strong>
                      {!p.published && <Badge variant="outline">Draft</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">/blog/{p.slug}</p>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{p.excerpt}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant={p.published ? "default" : "outline"} onClick={() => toggle("blog_posts", p.id, { published: !p.published }, "admin-posts")}>
                      {p.published ? "Live" : "Draft"}
                    </Button>
                    <PostDialog post={p} trigger={<Button size="sm" variant="outline" aria-label="Edit post"><Pencil className="size-4" /></Button>} />
                    <Button size="sm" variant="outline" aria-label="Delete post" onClick={() => remove("blog_posts", p.id, "admin-posts")}>
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              {!posts?.length && <p className="p-6 text-sm text-muted-foreground">No posts yet.</p>}
            </div>
          </TabsContent>


          <TabsContent value="reviews" className="mt-4">
            <div className="rounded-xl border bg-card divide-y">
              {reviews?.map((r: any) => (
                <div key={r.id} className="p-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm">
                      <strong>{r.author_name}</strong>
                      <Badge variant="outline">{r.rating}★</Badge>
                      {!r.approved && <Badge variant="outline">Pending</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{r.comment}</p>
                  </div>
                  <Button size="sm" variant={r.approved ? "outline" : "default"} onClick={() => setReviewApproved(r.id, !r.approved)}>
                    {r.approved ? "Hide" : "Approve"}
                  </Button>
                </div>
              ))}
              {!reviews?.length && <p className="p-6 text-sm text-muted-foreground">No reviews yet.</p>}
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="mt-4">
            <div className="rounded-xl border bg-card divide-y">
              {contacts?.map((c: any) => (
                <div key={c.id} className="p-4">
                  <div className="flex justify-between text-sm"><strong>{c.full_name}</strong><span className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span></div>
                  <p className="text-xs text-muted-foreground">{c.email} · {c.phone}</p>
                  <p className="mt-2 text-sm">{c.message}</p>
                  <Button size="sm" variant={c.handled ? "outline" : "default"} className="mt-3" onClick={() => setContactHandled(c.id, !c.handled)}>
                    {c.handled ? "Handled" : "Mark handled"}
                  </Button>
                </div>
              ))}
              {!contacts?.length && <p className="p-6 text-sm text-muted-foreground">No messages yet.</p>}
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
              {!careers?.length && <p className="p-6 text-sm text-muted-foreground">No applications yet.</p>}
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
