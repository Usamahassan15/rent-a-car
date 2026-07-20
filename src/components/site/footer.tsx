import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Youtube, MessageCircle, Crown, Phone, Mail, MapPin } from "lucide-react";
import { SOCIALS, CITIES } from "@/lib/site";
import { WHATSAPP_NUMBER_DISPLAY, whatsappLink } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="bg-luxury-gradient text-luxury-foreground">
      <div className="container-wide py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                <Crown className="size-5" />
              </span>
              <span className="font-display text-2xl font-bold">
                Regal<span className="text-primary">Auto</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Pakistan's premier luxury car rental — Rolls Royce, Mercedes,
              Range Rover, Audi & more. Daily, weekly & monthly rates with
              chauffeur across all major cities.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { href: SOCIALS.facebook, icon: Facebook, label: "Facebook" },
                { href: SOCIALS.instagram, icon: Instagram, label: "Instagram" },
                { href: SOCIALS.linkedin, icon: Linkedin, label: "LinkedIn" },
                { href: SOCIALS.youtube, icon: Youtube, label: "YouTube" },
                { href: whatsappLink("Hi Regal Auto"), icon: MessageCircle, label: "WhatsApp" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-primary">
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {[
                ["/fleet", "Rental Fleet"],
                ["/deals", "Deals & Packages"],
                ["/services", "Services"],
                ["/about", "About Us"],
                ["/blog", "Blog"],
                ["/career", "Career"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-primary transition">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Cities</h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-white/70">
              {CITIES.slice(0, 10).map((c) => (
                <li key={c}><Link to="/cities" className="hover:text-primary transition">{c}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 size-4 text-primary" />
                <a href={`tel:+${WHATSAPP_NUMBER_DISPLAY.replace(/\s/g, "")}`}>{WHATSAPP_NUMBER_DISPLAY}</a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 size-4 text-primary" />
                <a href={whatsappLink("Hi Regal Auto")}>WhatsApp: {WHATSAPP_NUMBER_DISPLAY}</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 size-4 text-primary" />
                <a href="mailto:hello@regalauto.pk">hello@regalauto.pk</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 text-primary" />
                <span>Islamabad · Rawalpindi · All Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row">
          <span>© {new Date().getFullYear()} Regal Auto. All rights reserved.</span>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-primary">Privacy</Link>
            <Link to="/terms" className="hover:text-primary">Terms</Link>
            <Link to="/refund" className="hover:text-primary">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
