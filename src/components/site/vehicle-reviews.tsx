import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export function VehicleReviews({ vehicleId, vehicleName }: { vehicleId: string; vehicleName: string }) {
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
      const meta = data.user?.user_metadata as Record<string, unknown> | undefined;
      if (typeof meta?.full_name === "string") setName(meta.full_name);
    });
  }, []);

  const { data: reviews } = useQuery({
    queryKey: ["reviews", vehicleId],
    queryFn: async () =>
      (await supabase.from("reviews").select("*").eq("vehicle_id", vehicleId).eq("approved", true).order("created_at", { ascending: false })).data ?? [],
  });

  async function submit() {
    if (!userId) return;
    if (!name.trim()) return toast.error("Please add your name");
    if (comment.trim().length < 10) return toast.error("Please write at least 10 characters");
    setSending(true);
    const { error } = await supabase.from("reviews").insert({
      vehicle_id: vehicleId,
      user_id: userId,
      author_name: name.trim().slice(0, 80),
      rating,
      comment: comment.trim().slice(0, 1000),
    });
    setSending(false);
    if (error) return toast.error(error.message);
    setComment("");
    toast.success("Thank you! Your review will appear once approved.");
    qc.invalidateQueries({ queryKey: ["reviews", vehicleId] });
  }

  return (
    <section className="container-wide py-16 border-t">
      <h2 className="font-display text-3xl md:text-4xl font-bold">Customer reviews</h2>
      <p className="mt-2 text-muted-foreground">Real feedback from guests who rented the {vehicleName}.</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          {reviews?.length ? reviews.map((r) => (
            <article key={r.id} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <strong className="font-medium">{r.author_name}</strong>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("size-4", i < r.rating ? "fill-primary text-primary" : "text-muted-foreground/30")} />
                ))}
              </div>
              {r.comment && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{r.comment}</p>}
            </article>
          )) : (
            <p className="text-sm text-muted-foreground">No reviews yet — be the first to share your experience.</p>
          )}
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-card h-fit">
          <h3 className="font-display text-xl font-semibold">Write a review</h3>
          {userId ? (
            <div className="mt-4 space-y-4">
              <Input value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} type="button" aria-label={`${i + 1} star`} onClick={() => setRating(i + 1)}>
                    <Star className={cn("size-6 transition", i < rating ? "fill-primary text-primary" : "text-muted-foreground/40")} />
                  </button>
                ))}
              </div>
              <Textarea rows={4} maxLength={1000} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was your ride and chauffeur service?" />
              <Button onClick={submit} disabled={sending} className="w-full">{sending ? "Sending…" : "Submit review"}</Button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Sign in to share your experience with this car.</p>
              <Link to="/auth"><Button className="mt-4 w-full">Sign in</Button></Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
