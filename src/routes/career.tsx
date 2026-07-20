import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Careers — Join Regal Auto Pakistan" },
      { name: "description", content: "Join Pakistan's leading luxury car rental. Chauffeur, fleet manager, customer success — apply today." },
      { property: "og:url", content: "/career" },
    ],
    links: [{ rel: "canonical", href: "/career" }],
  }),
  component: CareerPage,
});

const jobs = [
  { title: "Chauffeur (Luxury Fleet)", type: "Full-time", city: "Islamabad" },
  { title: "Fleet Operations Manager", type: "Full-time", city: "Lahore" },
  { title: "Customer Success Executive", type: "Full-time", city: "Karachi" },
  { title: "Digital Marketing Lead", type: "Remote / Hybrid", city: "Pakistan" },
];

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(20).optional(),
  position: z.string().max(120).optional(),
  cover_letter: z.string().max(2000).optional(),
});
type F = z.infer<typeof schema>;

function CareerPage() {
  const form = useForm<F>({ resolver: zodResolver(schema) });

  async function onSubmit(v: F) {
    const { error } = await supabase.from("career_applications").insert({
      full_name: v.full_name, email: v.email, phone: v.phone ?? null,
      position: v.position ?? null, cover_letter: v.cover_letter ?? null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Application received! We'll be in touch.");
    form.reset();
  }

  return (
    <div>
      <section className="bg-luxury-gradient text-luxury-foreground pt-32 pb-16">
        <div className="container-wide">
          <Badge className="bg-primary/20 text-primary border-primary/30">Careers</Badge>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold">Build your career at Regal Auto</h1>
        </div>
      </section>

      <section className="container-wide py-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold">Open Positions</h2>
          <div className="mt-6 space-y-3">
            {jobs.map((j) => (
              <div key={j.title} className="rounded-xl border bg-card p-5 shadow-card">
                <h3 className="font-display text-lg font-semibold">{j.title}</h3>
                <p className="text-sm text-muted-foreground">{j.type} · {j.city}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-2xl border bg-card p-6 md:p-8 shadow-card space-y-4">
          <h3 className="font-display text-2xl font-bold">Apply Now</h3>
          <div><Label>Full Name</Label><Input {...form.register("full_name")} className="mt-1.5" /></div>
          <div><Label>Email</Label><Input {...form.register("email")} type="email" className="mt-1.5" /></div>
          <div><Label>Phone</Label><Input {...form.register("phone")} className="mt-1.5" /></div>
          <div><Label>Position</Label><Input {...form.register("position")} placeholder="e.g. Chauffeur" className="mt-1.5" /></div>
          <div><Label>Cover Letter</Label><Textarea {...form.register("cover_letter")} rows={5} className="mt-1.5" /></div>
          <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90">Submit Application</Button>
        </form>
      </section>
    </div>
  );
}
