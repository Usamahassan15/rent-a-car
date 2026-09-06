import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Luxury Car Rental Tips & Guides | Regal Auto" },
      { name: "description", content: "Read the Regal Auto blog: travel tips, rental guides, wedding car ideas, corporate travel and Pakistan tourism." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

const fallback = [
  { slug: "top-luxury-cars-2026", title: "Top 5 Luxury Cars to Rent in Pakistan 2026", excerpt: "Discover the most sought-after luxury rentals in the country.", cover_image: null, published_at: new Date().toISOString(), tags: ["luxury"] },
  { slug: "wedding-cars-guide", title: "The Complete Wedding Car Guide", excerpt: "Everything you need to know about booking wedding cars.", cover_image: null, published_at: new Date().toISOString(), tags: ["wedding"] },
  { slug: "airport-transfer-tips", title: "Pakistan Airport Transfer — What to Expect", excerpt: "A traveller's guide to seamless airport pickups.", cover_image: null, published_at: new Date().toISOString(), tags: ["travel"] },
];

function BlogPage() {
  const { data } = useQuery({
    queryKey: ["blog"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("published", true).order("published_at", { ascending: false });
      return data ?? [];
    },
  });
  const posts = data && data.length ? data : (fallback as any[]);

  return (
    <div>
      <section className="bg-luxury-gradient text-luxury-foreground pt-32 pb-16">
        <div className="container-wide">
          <Badge className="bg-primary/20 text-primary border-primary/30">Blog</Badge>
          <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold">Luxury Rides & Travel Guides</h1>
        </div>
      </section>

      <section className="container-wide py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="block">
              <article className="group h-full overflow-hidden rounded-2xl border bg-card shadow-card transition hover:shadow-hover hover:-translate-y-1">
                {p.cover_image ? (
                  <img src={p.cover_image} alt={p.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                ) : (
                  <div className="aspect-[16/10] bg-luxury-gradient" />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <time>{new Date(p.published_at).toLocaleDateString()}</time>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-semibold group-hover:text-primary transition">{p.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-medium text-primary">Read article →</span>
                </div>
              </article>
            </Link>

          ))}
        </div>
      </section>
    </div>
  );
}
