import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

/* ---------------- Deals ---------------- */

const emptyDeal = { title: "", subtitle: "", description: "", discount_percent: "", code: "", image: "", ends_at: "", slug: "" };

export function DealDialog({ deal, trigger }: { deal?: Record<string, any>; trigger: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(emptyDeal);

  useEffect(() => {
    if (!open) return;
    setF(deal ? {
      title: deal.title ?? "", subtitle: deal.subtitle ?? "", description: deal.description ?? "",
      discount_percent: deal.discount_percent ? String(deal.discount_percent) : "",
      code: deal.code ?? "", image: deal.image ?? "",
      ends_at: deal.ends_at ? String(deal.ends_at).slice(0, 10) : "", slug: deal.slug ?? "",
    } : emptyDeal);
  }, [open, deal]);

  async function save() {
    if (!f.title.trim()) return toast.error("Title is required");
    const payload = {
      title: f.title.trim(),
      subtitle: f.subtitle.trim() || null,
      description: f.description.trim() || null,
      discount_percent: f.discount_percent ? Number(f.discount_percent) : null,
      code: f.code.trim() || null,
      image: f.image.trim() || null,
      ends_at: f.ends_at ? new Date(f.ends_at).toISOString() : null,
      slug: f.slug.trim() ? slugify(f.slug) : slugify(f.title),
    };
    const { error } = deal
      ? await supabase.from("deals").update(payload).eq("id", deal.id)
      : await supabase.from("deals").insert(payload as any);
    if (error) return toast.error(error.message);
    toast.success(deal ? "Offer updated" : "Offer created");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-deals"] });
    qc.invalidateQueries({ queryKey: ["deals"] });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{deal ? "Edit offer" : "New offer"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Title *"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Subtitle"><Input value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} /></Field></div>
          <Field label="Discount %"><Input type="number" value={f.discount_percent} onChange={(e) => setF({ ...f, discount_percent: e.target.value })} /></Field>
          <Field label="Promo code"><Input value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} /></Field>
          <Field label="Ends on"><Input type="date" value={f.ends_at} onChange={(e) => setF({ ...f, ends_at: e.target.value })} /></Field>
          <Field label="Image URL"><Input value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Description"><Textarea rows={4} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></Field></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Blog posts ---------------- */

const emptyPost = { title: "", slug: "", excerpt: "", content: "", cover_image: "", tags: "", author: "Regal Auto" };

export function PostDialog({ post, trigger }: { post?: Record<string, any>; trigger: React.ReactNode }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(emptyPost);

  useEffect(() => {
    if (!open) return;
    setF(post ? {
      title: post.title ?? "", slug: post.slug ?? "", excerpt: post.excerpt ?? "",
      content: post.content ?? "", cover_image: post.cover_image ?? "",
      tags: (post.tags ?? []).join(", "), author: post.author ?? "Regal Auto",
    } : emptyPost);
  }, [open, post]);

  async function save() {
    if (!f.title.trim()) return toast.error("Title is required");
    const payload = {
      title: f.title.trim(),
      slug: f.slug.trim() ? slugify(f.slug) : slugify(f.title),
      excerpt: f.excerpt.trim() || null,
      content: f.content.trim() || null,
      cover_image: f.cover_image.trim() || null,
      tags: f.tags.split(",").map((s) => s.trim()).filter(Boolean),
      author: f.author.trim() || "Regal Auto",
    };
    const { error } = post
      ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
      : await supabase.from("blog_posts").insert(payload as any);
    if (error) return toast.error(error.message);
    toast.success(post ? "Post updated" : "Post published");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-posts"] });
    qc.invalidateQueries({ queryKey: ["blog"] });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{post ? "Edit post" : "New blog post"}</DialogTitle></DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Field label="Title *"><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></Field></div>
          <Field label="URL slug"><Input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} placeholder="auto from title" /></Field>
          <Field label="Author"><Input value={f.author} onChange={(e) => setF({ ...f, author: e.target.value })} /></Field>
          <div className="sm:col-span-2"><Field label="Cover image URL"><Input value={f.cover_image} onChange={(e) => setF({ ...f, cover_image: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Tags (comma separated)"><Input value={f.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Excerpt"><Textarea rows={2} value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} /></Field></div>
          <div className="sm:col-span-2"><Field label="Content"><Textarea rows={10} value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} /></Field></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
