import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink, WHATSAPP_NUMBER_DISPLAY } from "@/lib/whatsapp";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Regal Auto — Luxury Car Rental Pakistan" },
      { name: "description", content: "Contact Regal Auto: WhatsApp 0317 5817400, email hello@regalauto.pk. Available 24/7 across Pakistan." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(20).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().trim().min(3).max(1000),
});
type F = z.infer<typeof schema>;

function ContactPage() {
  const form = useForm<F>({ resolver: zodResolver(schema) });

  async function onSubmit(v: F) {
    const { error } = await supabase.from("contact_messages").insert({
      full_name: v.full_name, email: v.email || null, phone: v.phone ?? null,
      subject: v.subject ?? null, message: v.message,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Message sent — we'll reply shortly.");
    form.reset();
  }

  return (
    <div>
      <section className="bg-luxury-gradient text-luxury-foreground pt-32 pb-16">
        <div className="container-wide">
          <Badge className="bg-primary/20 text-primary border-primary/30">Contact</Badge>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold">Get in touch, 24/7.</h1>
        </div>
      </section>

      <section className="container-wide py-16 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="space-y-5">
            <ContactRow icon={Phone} label="Phone" value={WHATSAPP_NUMBER_DISPLAY} href={`tel:+92${WHATSAPP_NUMBER_DISPLAY.replace(/\s/g, "").slice(1)}`} />
            <ContactRow icon={MessageCircle} label="WhatsApp" value={WHATSAPP_NUMBER_DISPLAY} href={whatsappLink("Hi Regal Auto")} />
            <ContactRow icon={Mail} label="Email" value="hello@regalauto.pk" href="mailto:hello@regalauto.pk" />
            <ContactRow icon={MapPin} label="Head Office" value="Islamabad · Rawalpindi · All Pakistan" />
            <ContactRow icon={Clock} label="Hours" value="24/7 · 365 days" />
          </div>
          <div className="mt-8 overflow-hidden rounded-2xl border shadow-card aspect-[16/10]">
            <iframe
              title="Regal Auto location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105941.53097876534!2d72.9289283!3d33.6844202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbe93b2fb64d5%3A0x3a1fda1c1efe6c!2sIslamabad!5e0!3m2!1sen!2s!4v1"
              className="size-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-2xl border bg-card p-6 md:p-8 shadow-card space-y-4">
          <h3 className="font-display text-2xl font-bold">Send us a message</h3>
          <div><Label>Full Name</Label><Input {...form.register("full_name")} className="mt-1.5" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Email</Label><Input type="email" {...form.register("email")} className="mt-1.5" /></div>
            <div><Label>Phone</Label><Input {...form.register("phone")} className="mt-1.5" /></div>
          </div>
          <div><Label>Subject</Label><Input {...form.register("subject")} className="mt-1.5" /></div>
          <div><Label>Message</Label><Textarea {...form.register("message")} rows={5} className="mt-1.5" /></div>
          <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">Send Message</Button>
        </form>
      </section>
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-4 rounded-xl border bg-card p-4 shadow-card transition hover:border-primary">
      <div className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer">{inner}</a> : inner;
}
