import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { bookingMessage, whatsappLink } from "@/lib/whatsapp";
import { CITIES } from "@/lib/site";

const schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().min(7, "Enter phone").max(20),
  whatsapp: z.string().trim().max(20).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(200).optional().or(z.literal("")),
  pickup_city: z.string().max(60).optional(),
  drop_city: z.string().max(60).optional(),
  pickup_date: z.string().min(1, "Pick a date"),
  return_date: z.string().min(1, "Pick a date"),
  pickup_time: z.string().max(10).optional(),
  message: z.string().max(1000).optional(),
  promo_code: z.string().max(40).optional(),
});
type FormData = z.infer<typeof schema>;

export function BookingDialog({
  trigger, vehicleId, vehicleName,
}: { trigger: ReactNode; vehicleId?: string; vehicleName?: string }) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "", phone: "", whatsapp: "", email: "",
      pickup_city: "Islamabad", drop_city: "", pickup_date: "", return_date: "",
      pickup_time: "10:00", message: "", promo_code: "",
    },
  });

  async function onSubmit(values: FormData) {
    // Open WhatsApp immediately while we still have the user gesture (avoids popup blockers)
    const msg = bookingMessage({ ...values, vehicle: vehicleName });
    const waWin = window.open(whatsappLink(msg), "_blank");

    // Persist booking in background — never block the WhatsApp handoff
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("bookings").insert({
        user_id: user?.id ?? null,
        vehicle_id: vehicleId ?? null,
        full_name: values.full_name,
        phone: values.phone,
        whatsapp: values.whatsapp || null,
        email: values.email || null,
        pickup_city: values.pickup_city || null,
        drop_city: values.drop_city || null,
        pickup_date: values.pickup_date,
        return_date: values.return_date,
        pickup_time: values.pickup_time || null,
        message: values.message || null,
        promo_code: values.promo_code || null,
      });
      if (error) console.warn("Booking save failed:", error.message);
    } catch (e) {
      console.warn("Booking save error:", e);
    }

    toast.success("Booking sent! Continue on WhatsApp.");
    if (!waWin) {
      // Fallback if popup was blocked
      window.location.href = whatsappLink(msg);
    }
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Book Your Ride</DialogTitle>
          <DialogDescription>
            {vehicleName ? `Enquire about the ${vehicleName}.` : "Send your booking. We reply on WhatsApp within minutes."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" error={form.formState.errors.full_name?.message}>
            <Input {...form.register("full_name")} placeholder="Your full name" />
          </Field>
          <Field label="Phone" error={form.formState.errors.phone?.message}>
            <Input {...form.register("phone")} placeholder="03XX XXXXXXX" />
          </Field>
          <Field label="WhatsApp">
            <Input {...form.register("whatsapp")} placeholder="Same as phone" />
          </Field>
          <Field label="Email" error={form.formState.errors.email?.message}>
            <Input {...form.register("email")} type="email" placeholder="you@email.com" />
          </Field>

          <Field label="Pickup City">
            <Select defaultValue="Islamabad" onValueChange={(v) => form.setValue("pickup_city", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Drop City">
            <Select onValueChange={(v) => form.setValue("drop_city", v)}>
              <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
              <SelectContent>
                {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Pickup Date" error={form.formState.errors.pickup_date?.message}>
            <Input type="date" {...form.register("pickup_date")} />
          </Field>
          <Field label="Return Date" error={form.formState.errors.return_date?.message}>
            <Input type="date" {...form.register("return_date")} />
          </Field>
          <Field label="Pickup Time">
            <Input type="time" {...form.register("pickup_time")} />
          </Field>
          <Field label="Promo Code">
            <Input {...form.register("promo_code")} placeholder="Optional" />
          </Field>

          <div className="sm:col-span-2">
            <Label>Message</Label>
            <Textarea {...form.register("message")} placeholder="Any special requirements?" className="mt-1.5" rows={3} />
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 pt-2">
            <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting…" : "Submit & WhatsApp"}
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-primary">{error}</p>}
    </div>
  );
}
