import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

const staticPaths = [
  "/", "/about", "/fleet", "/cities", "/deals", "/services",
  "/blog", "/career", "/contact", "/privacy", "/terms", "/refund",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
        const sb = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
          auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
          global: {
            fetch: (input, init) => {
              const h = new Headers(init?.headers);
              if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
              h.set("apikey", key);
              return fetch(input, { ...init, headers: h });
            },
          },
        });

        const [vehicles, cities, posts] = await Promise.all([
          sb.from("vehicles").select("slug").eq("published", true),
          sb.from("cities").select("slug"),
          sb.from("blog_posts").select("slug").eq("published", true),
        ]);

        const paths = [
          ...staticPaths,
          ...(vehicles.data ?? []).map((v) => `/fleet/${v.slug}`),
          ...(cities.data ?? []).map((c) => `/cities/${c.slug}`),
          ...(posts.data ?? []).map((p) => `/blog/${p.slug}`),
        ];

        const urls = paths.map(
          (p) => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.8"}</priority></url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
