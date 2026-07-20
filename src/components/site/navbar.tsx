import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Search, Heart, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/fleet", label: "Fleet" },
  { to: "/cities", label: "Cities" },
  { to: "/deals", label: "Deals" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/career", label: "Career" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSignedIn(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        transparent ? "bg-transparent" : "glass shadow-card"
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-red">
            <Crown className="size-5" />
          </span>
          <span className={cn(
            "font-display text-xl font-bold tracking-tight md:text-2xl",
            transparent ? "text-white" : "text-foreground"
          )}>
            Regal<span className="text-primary">Auto</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to || (l.to !== "/" && pathname.startsWith(l.to));
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  transparent ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground",
                  active && (transparent ? "text-white" : "text-primary")
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search" className={cn(transparent && "text-white hover:bg-white/10 hover:text-white")}>
            <Search className="size-5" />
          </Button>
          <Link to={signedIn ? "/wishlist" : "/auth"}>
            <Button variant="ghost" size="icon" aria-label="Wishlist" className={cn(transparent && "text-white hover:bg-white/10 hover:text-white")}>
              <Heart className="size-5" />
            </Button>
          </Link>
          <Link to={signedIn ? "/profile" : "/auth"}>
            <Button variant="ghost" size="icon" aria-label="Profile" className={cn(transparent && "text-white hover:bg-white/10 hover:text-white")}>
              <User className="size-5" />
            </Button>
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu"
                className={cn("lg:hidden", transparent && "text-white hover:bg-white/10 hover:text-white")}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Regal<span className="text-primary">Auto</span></SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {links.map((l) => (
                  <Link key={l.to} to={l.to} className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
