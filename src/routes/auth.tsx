import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Regal Auto" },
      { name: "description", content: "Sign in or create an account to manage your Regal Auto bookings, wishlist and profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const signIn = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(6).max(72),
});
const signUp = signIn.extend({
  full_name: z.string().trim().min(2).max(100),
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/profile" });
    });
  }, [navigate]);

  const loginForm = useForm<z.infer<typeof signIn>>({ resolver: zodResolver(signIn) });
  const signupForm = useForm<z.infer<typeof signUp>>({ resolver: zodResolver(signUp) });

  async function onLogin(v: z.infer<typeof signIn>) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(v);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/profile" });
  }

  async function onSignup(v: z.infer<typeof signUp>) {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: v.email,
      password: v.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: v.full_name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created — you're signed in.");
    navigate({ to: "/profile" });
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) return toast.error("Google sign-in failed");
    if (!r.redirected) navigate({ to: "/profile" });
  }

  return (
    <div className="min-h-[100svh] pt-24 pb-16 flex items-center bg-secondary">
      <div className="container-wide max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-red"><Crown className="size-6" /></span>
            <span className="font-display text-3xl font-bold">Regal<span className="text-primary">Auto</span></span>
          </Link>
        </div>

        <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-elegant">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div><Label>Email</Label><Input type="email" {...loginForm.register("email")} className="mt-1.5" /></div>
                <div><Label>Password</Label><Input type="password" {...loginForm.register("password")} className="mt-1.5" /></div>
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>Sign In</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                <div><Label>Full Name</Label><Input {...signupForm.register("full_name")} className="mt-1.5" /></div>
                <div><Label>Email</Label><Input type="email" {...signupForm.register("email")} className="mt-1.5" /></div>
                <div><Label>Password</Label><Input type="password" {...signupForm.register("password")} className="mt-1.5" /></div>
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>Create Account</Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>

          <Button type="button" variant="outline" size="lg" className="w-full" onClick={google}>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
