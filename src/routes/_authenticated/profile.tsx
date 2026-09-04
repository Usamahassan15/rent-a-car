import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, User as UserIcon, Heart, ClipboardList, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "My Profile — Regal Auto" }, { name: "robots", content: "noindex" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return { ...data, email: user.email, id: user.id };
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });

  const [full_name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWa] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
      setWa(profile.whatsapp ?? "");
    }
  }, [profile]);

  async function save() {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles")
      .upsert({ id: profile.id, full_name, phone, whatsapp })
      .eq("id", profile.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: ["profile"] });
  }

  async function claimAdmin() {
    const { data, error } = await supabase.rpc("claim_admin");
    if (error) return toast.error(error.message);
    if (!data) return toast.error("Admin access is already assigned to another account.");
    toast.success("Admin access granted");
    qc.invalidateQueries({ queryKey: ["is-admin"] });
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }


  return (
    <div className="pt-24 pb-16 bg-secondary min-h-screen">
      <div className="container-wide max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge variant="outline">Account</Badge>
            <h1 className="mt-2 font-display text-3xl md:text-4xl font-bold">My Profile</h1>
          </div>
          <Button variant="outline" onClick={signOut}><LogOut className="mr-2 size-4" />Sign out</Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          <Link to="/bookings" className="group rounded-xl border bg-card p-4 shadow-card hover:border-primary hover:shadow-red transition">
            <ClipboardList className="size-6 text-primary" /><p className="mt-2 font-medium">Bookings</p>
          </Link>
          <Link to="/wishlist" className="group rounded-xl border bg-card p-4 shadow-card hover:border-primary hover:shadow-red transition">
            <Heart className="size-6 text-primary" /><p className="mt-2 font-medium">Wishlist</p>
          </Link>
          {isAdmin ? (
            <Link to="/admin" className="group rounded-xl border bg-card p-4 shadow-card hover:border-primary hover:shadow-red transition">
              <Shield className="size-6 text-primary" /><p className="mt-2 font-medium">Admin Panel</p>
            </Link>
          ) : (
            <button onClick={claimAdmin} className="text-left rounded-xl border bg-card p-4 shadow-card hover:border-primary hover:shadow-red transition">
              <Shield className="size-6 text-primary" /><p className="mt-2 font-medium">Claim Admin</p>
            </button>
          )}
        </div>


        <div className="rounded-2xl border bg-card p-6 shadow-card space-y-4">
          <div className="flex items-center gap-3">
            <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary"><UserIcon className="size-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="font-medium">{profile?.email}</p>
            </div>
          </div>
          <div><Label>Full Name</Label><Input value={full_name} onChange={(e) => setName(e.target.value)} className="mt-1.5" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1.5" /></div>
            <div><Label>WhatsApp</Label><Input value={whatsapp} onChange={(e) => setWa(e.target.value)} className="mt-1.5" /></div>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}
