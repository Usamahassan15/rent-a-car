import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const title = decodeURIComponent(params.slug).replace(/-/g, " ");
    return {
      meta: [
        { title: `${title} — Regal Auto Blog` },
        { name: "description", content: `${title} — luxury car rental insights, travel guides and chauffeur tips from Regal Auto Pakistan.` },
        { property: "og:type", content: "article" },
        { property: "og:title", content: `${title} — Regal Auto Blog` },
        { property: "og:description", content: `${title} — luxury car rental insights from Regal Auto Pakistan.` },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: `/blog/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
    };
  },
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () =>
      (await supabase.from("blog_posts").select("*").eq("slug", slug).eq("published", true).maybeSingle()).data,
  });

  if (isLoading) return <div className="container-wide pt-32 pb-20"><div className="h-80 animate-pulse rounded-2xl bg-muted" /></div>;

  if (!post) return (
    <div className="container-wide pt-32 pb-20 text-center">
      <h1 className="font-display text-3xl">Article not found</h1>
      <Link to="/blog"><Button className="mt-6">Back to Blog</Button></Link>
    </div>
  );

  return (
    <article>
      <section className="bg-luxury-gradient text-luxury-foreground pt-32 pb-14">
        <div className="container-wide">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-primary">
            <ArrowLeft className="size-4" /> All articles
          </Link>
          <h1 className="mt-4 max-w-4xl font-display text-3xl md:text-5xl font-bold">{post.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><Calendar className="size-4" />{new Date(post.published_at ?? post.created_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1.5"><User className="size-4" />{post.author ?? "Regal Auto"}</span>
            <div className="flex gap-2">
              {(post.tags ?? []).map((t: string) => (
                <Badge key={t} className="bg-primary/20 text-primary border-primary/30">{t}</Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {post.cover_image && (
        <div className="container-wide -mt-8">
          <img src={post.cover_image} alt={post.title} className="aspect-[16/7] w-full rounded-3xl object-cover shadow-elegant" />
        </div>
      )}

      <section className="container-wide py-14">
        <div className="mx-auto max-w-3xl">
          {post.excerpt && <p className="text-lg text-muted-foreground">{post.excerpt}</p>}
          <div className="mt-8 space-y-5 leading-relaxed">
            {(post.content ?? "").split(/\n{2,}/).filter(Boolean).map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-12 rounded-2xl border bg-card p-6 text-center shadow-card">
            <h2 className="font-display text-2xl font-semibold">Ready to ride in style?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Browse our luxury fleet with professional chauffeurs across Pakistan.</p>
            <Link to="/fleet"><Button className="mt-5">Explore the fleet</Button></Link>
          </div>
        </div>
      </section>
    </article>
  );
}
