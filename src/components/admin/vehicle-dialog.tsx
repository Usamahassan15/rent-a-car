import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type VehicleRow = Record<string, any>;

const empty = {
  name: "", brand: "", model: "", slug: "", description: "",
  price_per_day: "", price_per_week: "", price_per_month: "",
  seats: "4", transmission: "automatic", fuel: "petrol", year: "",
  mileage_limit_km: "", security_deposit: "",
  images: "", features: "", category_id: "", city_id: "",
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function VehicleDialog({ vehicle, trigger }: { vehicle?: VehicleRow; trigger: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState<typeof empty>(empty);

  const { data: cats } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => (await supabase.from("categories").select("id,name").order("name")).data ?? [],
  });
  const { data: cities } = useQuery({
    queryKey: ["admin-cities"],
    queryFn: async () => (await supabase.from("cities").select("id,name").order("name")).data ?? [],
  });

  useEffect(() => {
    if (!open) return;
    if (vehicle) {
      setF({
        name: vehicle.name ?? "", brand: vehicle.brand ?? "", model: vehicle.model ?? "",
        slug: vehicle.slug ?? "", description: vehicle.description ?? "",
        price_per_day: String(vehicle.price_per_day ?? ""),
        price_per_week: vehicle.price_per_week ? String(vehicle.price_per_week) : "",
        price_per_month: vehicle.price_per_month ? String(vehicle.price_per_month) : "",
        seats: String(vehicle.seats ?? 4),
        transmission: vehicle.transmission ?? "automatic",
        fuel: vehicle.fuel ?? "petrol",
        year: vehicle.year ? String(vehicle.year) : "",
        mileage_limit_km: vehicle.mileage_limit_km ? String(vehicle.mileage_limit_km) : "",
        security_deposit: vehicle.security_deposit ? String(vehicle.security_deposit) : "",
        images: (vehicle.images ?? []).join("\n"),
        features: (vehicle.features ?? []).join(", "),
        category_id: vehicle.category_id ?? "",
        city_id: vehicle.city_id ?? "",
      });
    } else setF(empty);
  }, [open, vehicle]);

  function set(k: keyof typeof empty, v: string) { setF((p) => ({ ...p, [k]: v })); }

  async function save() {
    if (!f.name.trim() || !f.brand.trim() || !f.price_per_day) {
      toast.error("Name, brand and daily price are required");
      return;
    }
    setSaving(true);
    const payload: Record<string, any> = {
      name: f.name.trim(),
      brand: f.brand.trim(),
      model: f.model.trim() || null,
      slug: f.slug.trim() ? slugify(f.slug) : slugify(`${f.brand} ${f.name}`),
      description: f.description.trim() || null,
      price_per_day: Number(f.price_per_day),
      price_per_week: f.price_per_week ? Number(f.price_per_week) : null,
      price_per_month: f.price_per_month ? Number(f.price_per_month) : null,
      seats: f.seats ? Number(f.seats) : 4,
      transmission: f.transmission,
      fuel: f.fuel,
      year: f.year ? Number(f.year) : null,
      mileage_limit_km: f.mileage_limit_km ? Number(f.mileage_limit_km) : null,
      security_deposit: f.security_deposit ? Number(f.security_deposit) : null,
      images: f.images.split(/\n+/).map((s) => s.trim()).filter(Boolean),
      features: f.features.split(",").map((s) => s.trim()).filter(Boolean),
      category_id: f.category_id || null,
      city_id: f.city_id || null,
    };

    const { error } = vehicle
      ? await supabase.from("vehicles").update(payload as any).eq("id", vehicle.id)
      : await supabase.from("vehicles").insert(payload as any);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(vehicle ? "Vehicle updated" : "Vehicle added");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-vehicles"] });
    qc.invalidateQueries({ queryKey: ["all-vehicles"] });
    qc.invalidateQueries({ queryKey: ["featured-vehicles"] });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{vehicle ? "Edit vehicle" : "Add vehicle"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name *"><Input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Range Rover Vogue" /></Field>
          <Field label="Brand *"><Input value={f.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Land Rover" /></Field>
          <Field label="Model"><Input value={f.model} onChange={(e) => set("model", e.target.value)} /></Field>
          <Field label="URL slug"><Input value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from name" /></Field>
          <Field label="Price / day (PKR) *"><Input type="number" value={f.price_per_day} onChange={(e) => set("price_per_day", e.target.value)} /></Field>
          <Field label="Price / week"><Input type="number" value={f.price_per_week} onChange={(e) => set("price_per_week", e.target.value)} /></Field>
          <Field label="Price / month"><Input type="number" value={f.price_per_month} onChange={(e) => set("price_per_month", e.target.value)} /></Field>
          <Field label="Security deposit"><Input type="number" value={f.security_deposit} onChange={(e) => set("security_deposit", e.target.value)} /></Field>
          <Field label="Seats"><Input type="number" value={f.seats} onChange={(e) => set("seats", e.target.value)} /></Field>
          <Field label="Year"><Input type="number" value={f.year} onChange={(e) => set("year", e.target.value)} /></Field>
          <Field label="Transmission">
            <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={f.transmission} onChange={(e) => set("transmission", e.target.value)}>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </Field>
          <Field label="Fuel">
            <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={f.fuel} onChange={(e) => set("fuel", e.target.value)}>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
          </Field>
          <Field label="Category">
            <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={f.category_id} onChange={(e) => set("category_id", e.target.value)}>
              <option value="">—</option>
              {cats?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="City">
            <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={f.city_id} onChange={(e) => set("city_id", e.target.value)}>
              <option value="">—</option>
              {cities?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Mileage limit (km/day)"><Input type="number" value={f.mileage_limit_km} onChange={(e) => set("mileage_limit_km", e.target.value)} /></Field>
          <div className="sm:col-span-2">
            <Field label="Image URLs (one per line)">
              <Textarea rows={3} value={f.images} onChange={(e) => set("images", e.target.value)} placeholder="https://..." />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Features (comma separated)">
              <Input value={f.features} onChange={(e) => set("features", e.target.value)} placeholder="Leather seats, Sunroof, GPS" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Description">
              <Textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
