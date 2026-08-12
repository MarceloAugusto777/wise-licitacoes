import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  MessageCircle,
  Search,
  FileText,
  ClipboardCheck,
  FolderCheck,
  Send,
  Gavel,
  Scale,
  Handshake,
  ShieldCheck,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  HeartPulse,
  HardHat,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Presentation,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import { PresentationMode } from "@/components/PresentationMode";
import wiseLogo from "@/assets/wise-logo.png";
import heroImage from "@/assets/hero-licitacoes.jpg";
import { AdminPanel } from "@/components/AdminPanel";
import { 
  defaultSiteData, 
  defaultPresentationData, 
  defaultCases,
  SiteData,
  PresentationData,
  CaseStudy
} from "@/lib/initialData";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Wise Licitações",
          description:
            "Assessoria completa em licitações públicas. Especialistas nos setores de Saúde/Hospitalar e Engenharia.",
          areaServed: "BR",
          serviceType: "Assessoria em Licitações Públicas",
        }),
      },
    ],
  }),
});

const WHATSAPP_URL =
  "https://wa.me/5500000000000?text=Ol%C3%A1%2C%20gostaria%20de%20uma%20consultoria%20sobre%20licita%C3%A7%C3%B5es";

function LandingPage() {
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);
  const [presentationData, setPresentationData] = useState<PresentationData>(defaultPresentationData);
  const [cases, setCases] = useState<CaseStudy[]>(defaultCases);
  const [presenting, setPresenting] = useState(false);

  // Load from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const localSite = localStorage.getItem("wise_site_data");
      const localPres = localStorage.getItem("wise_presentation_data");
      const localCases = localStorage.getItem("wise_cases_data");

      if (localSite) {
        try {
          setSiteData(JSON.parse(localSite));
        } catch (e) {
          console.error("Error parsing site data from local storage", e);
        }
      }
      if (localPres) {
        try {
          const parsed = JSON.parse(localPres);
          // Merge slides: keep user's edits for default slides, but ensure new default slides exist
          const mergedSlides = defaultPresentationData.slides.map(defaultSlide => {
            const existing = parsed.slides?.find((s: any) => s.id === defaultSlide.id);
            return existing ? { ...defaultSlide, ...existing } : defaultSlide;
          });
          
          // Add any custom slides created by the user
          const customSlides = parsed.slides?.filter(
            (s: any) => !defaultPresentationData.slides.some(ds => ds.id === s.id)
          ) || [];

          setPresentationData({
            ...defaultPresentationData,
            ...parsed,
            slides: [...mergedSlides, ...customSlides],
            faqs: (parsed.faqs && parsed.faqs.length > 0) ? parsed.faqs : defaultPresentationData.faqs,
            pricing: (parsed.pricing && parsed.pricing.models && parsed.pricing.models.length > 0) ? parsed.pricing : defaultPresentationData.pricing
          });
        } catch (e) {
          console.error("Error parsing presentation data from local storage", e);
        }
      }
      if (localCases) {
        try {
          setCases(JSON.parse(localCases));
        } catch (e) {
          console.error("Error parsing cases data from local storage", e);
        }
      }
    }
  }, []);

  if (presenting) {
    return (
      <PresentationMode 
        siteData={siteData}
        presentationData={presentationData}
        cases={cases}
        onExit={() => setPresenting(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      {siteData.hero.visible && <Hero data={siteData.hero} />}
      {siteData.trustBar.visible && <TrustBar data={siteData.trustBar} />}
      {siteData.pain.visible && <Pain data={siteData.pain} />}
      {siteData.process.visible && <Process data={siteData.process} />}
      {siteData.benefits.visible && <Benefits data={siteData.benefits} />}
      {siteData.specialties.visible && <Specialties data={siteData.specialties} />}
      
      {/* Cases de sucesso no site */}
      <PublicCases cases={cases} />
      
      {siteData.differentiators.visible && <Differentiators data={siteData.differentiators} />}
      {siteData.bigCTA.visible && <BigCTA data={siteData.bigCTA} />}
      {siteData.faq.visible && <FAQ data={siteData.faq} />}
      {siteData.leadForm.visible && <LeadForm data={siteData.leadForm} />}
      
      <Footer />
      <FloatingActions />
      
      {/* Admin Panel controls */}
      <AdminPanel
        siteData={siteData}
        setSiteData={setSiteData}
        presentationData={presentationData}
        setPresentationData={setPresentationData}
        cases={cases}
        setCases={setCases}
        onStartPresentation={() => setPresenting(true)}
      />
    </div>
  );
}

/* Helper to map string icon name to Lucide component */
const getIcon = (name?: string) => {
  switch (name) {
    case "Search": return Search;
    case "FileText": return FileText;
    case "ClipboardCheck": return ClipboardCheck;
    case "FolderCheck": return FolderCheck;
    case "Send": return Send;
    case "Gavel": return Gavel;
    case "Scale": return Scale;
    case "Handshake": return Handshake;
    case "TrendingUp": return TrendingUp;
    case "AlertTriangle": return AlertTriangle;
    case "Users": return Users;
    case "Clock": return Clock;
    case "ShieldCheck": return ShieldCheck;
    case "Sparkles": return Sparkles;
    case "Building2": return Building2;
    case "HeartPulse": return HeartPulse;
    case "HardHat": return HardHat;
    default: return CheckCircle2;
  }
};

/* ---------------- NAV ---------------- */
function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-hairline">
      <div className="container-x flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2">
          <img
            src={wiseLogo}
            alt="Wise Logo"
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="font-display text-lg tracking-tight text-ink">
            Wise <span className="text-emerald">Licitações</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-soft">
          <a href="#processo" className="hover:text-ink transition-colors">Processo</a>
          <a href="#especialidades" className="hover:text-ink transition-colors">Especialidades</a>
          <a href="#cases" className="hover:text-ink transition-colors">Cases</a>
          <a href="#diferenciais" className="hover:text-ink transition-colors">Diferenciais</a>
          <a href="#faq" className="hover:text-ink transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-emerald transition-colors px-3 py-2"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a href="#contato">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5">
              Consultoria gratuita
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ data }: { data: SiteData["hero"] }) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-warm pointer-events-none" aria-hidden />
      <div className="container-x relative pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
          <div className="animate-float-up">
            <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface px-3 py-1.5 text-xs font-medium text-ink-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
              {data.badge}
            </span>

            <h1 className="mt-6 font-display text-[2.5rem] leading-[1.05] md:text-6xl lg:text-[4rem] text-ink">
              {data.title}
            </h1>

            <p className="mt-6 text-lg text-ink-soft max-w-xl leading-relaxed">
              {data.text}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#contato">
                <Button
                  size="lg"
                  className="h-12 px-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lift w-full sm:w-auto"
                >
                  {data.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 rounded-full border-ink/15 hover:border-emerald hover:text-emerald bg-surface w-full sm:w-auto"
                >
                  <MessageCircle className="h-4 w-4" />
                  {data.whatsappText}
                </Button>
              </a>
            </div>

            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-ink-soft max-w-lg">
              {data.bullets.map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-emerald opacity-10 blur-3xl rounded-full" aria-hidden />
            <div className="relative rounded-3xl overflow-hidden shadow-lift hairline bg-surface">
              <img
                src={heroImage}
                alt="Wise Licitações - Plataforma e Estratégia de Licitações Públicas"
                width={1408}
                height={1200}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Floating cards */}
            <div className="hidden sm:flex absolute -left-4 top-8 items-center gap-3 rounded-2xl bg-surface shadow-lift px-4 py-3 hairline">
              <div className="h-9 w-9 rounded-xl bg-emerald-soft grid place-items-center">
                <ClipboardCheck className="h-4 w-4 text-emerald" />
              </div>
              <div>
                <div className="text-xs text-ink-soft">Edital analisado</div>
                <div className="text-sm font-semibold text-ink">Pregão Eletrônico</div>
              </div>
            </div>
            <div className="hidden sm:flex absolute -right-4 bottom-8 items-center gap-3 rounded-2xl bg-surface shadow-lift px-4 py-3 hairline">
              <div className="h-9 w-9 rounded-xl bg-gradient-navy grid place-items-center">
                <ShieldCheck className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs text-ink-soft">Documentação</div>
                <div className="text-sm font-semibold text-ink">100% conforme</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRUST BAR ---------------- */
function TrustBar({ data }: { data: SiteData["trustBar"] }) {
  return (
    <section className="border-y border-hairline bg-surface-warm/60">
      <div className="container-x py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.items.map((it) => {
          const Icon = getIcon(it.icon);
          return (
            <div key={it.label} className="flex items-center gap-3 text-sm text-ink-soft">
              <Icon className="h-5 w-5 text-emerald shrink-0" />
              <span>{it.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- PAIN ---------------- */
function Pain({ data }: { data: SiteData["pain"] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald">
            {data.badge}
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl text-ink">
            {data.title}
          </h2>
          <p className="mt-4 text-ink-soft text-lg">
            {data.description}
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((it) => {
            const Icon = getIcon(it.icon);
            return (
              <div
                key={it.title}
                className="group rounded-2xl bg-surface hairline p-6 hover:shadow-soft hover:-translate-y-0.5 transition-all"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-soft grid place-items-center mb-4">
                  <Icon className="h-5 w-5 text-emerald" />
                </div>
                <h3 className="text-lg font-semibold text-ink">{it.title}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{it.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PROCESS ---------------- */
function Process({ data }: { data: SiteData["process"] }) {
  return (
    <section id="processo" className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-gradient-navy pointer-events-none" aria-hidden />
      <div className="container-x relative">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald">
            {data.badge}
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl text-primary-foreground">
            {data.title}
          </h2>
          <p className="mt-4 text-primary-foreground/70 text-lg">
            {data.description}
          </p>
        </div>

        <ol className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.items.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <li
                key={s.title}
                className="relative rounded-2xl bg-primary-foreground/[0.04] border border-primary-foreground/10 p-6 hover:bg-primary-foreground/[0.07] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-emerald grid place-items-center">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-display text-2xl text-primary-foreground/30">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-semibold text-primary-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-primary-foreground/60 leading-relaxed">{s.text}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a href="#contato">
            <Button
              size="lg"
              className="h-12 px-6 rounded-full bg-emerald text-primary-foreground hover:bg-emerald/90"
            >
              Quero uma consultoria gratuita
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <span className="text-sm text-primary-foreground/60">
            Sem compromisso. Resposta em até 1 dia útil.
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- BENEFITS ---------------- */
function Benefits({ data }: { data: SiteData["benefits"] }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald">
            {data.badge}
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl text-ink">
            {data.title}
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((it) => {
            const Icon = getIcon(it.icon);
            return (
              <div
                key={it.title}
                className="rounded-2xl p-6 bg-surface hairline flex gap-4 hover:shadow-soft transition-shadow"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-emerald grid place-items-center">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{it.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{it.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SPECIALTIES ---------------- */
function Specialties({ data }: { data: SiteData["specialties"] }) {
  return (
    <section id="especialidades" className="py-20 md:py-28 bg-surface-warm">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald">
            {data.badge}
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl text-ink">
            {data.title}
          </h2>
          <p className="mt-4 text-ink-soft text-lg">
            {data.description}
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          {data.cards.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <SpecialtyCard
                key={card.tag}
                icon={Icon}
                tag={card.tag}
                title={card.title}
                items={card.items}
              />
            );
          })}
        </div>

        <p className="mt-8 text-sm text-ink-soft italic">
          Também atendemos empresas de diversos outros segmentos.
        </p>
      </div>
    </section>
  );
}

function SpecialtyCard({
  icon: Icon,
  tag,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl bg-surface hairline p-8 md:p-10 shadow-soft hover:shadow-lift transition-shadow">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-primary grid place-items-center">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-ink">{tag}</span>
      </div>
      <h3 className="mt-6 text-2xl md:text-[1.75rem] leading-snug text-ink">{title}</h3>
      <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2 text-sm text-ink-soft">
            <CheckCircle2 className="h-4 w-4 text-emerald mt-0.5 shrink-0" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- CASES DE SUCESSO (PÚBLICO) ---------------- */
function PublicCases({ cases }: { cases: CaseStudy[] }) {
  const visibleCases = cases.filter((c) => c.visibleInSite);
  if (visibleCases.length === 0) return null;

  return (
    <section id="cases" className="py-20 md:py-28 bg-surface">
      <div className="container-x">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald">
            Cases Reais
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl text-ink font-display">
            Resultados obtidos por nossos clientes
          </h2>
          <p className="mt-4 text-ink-soft text-lg">
            Empresas que expandiram faturamento e conquistaram licitações com nossa parceria comercial.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCases.map((cs) => (
            <div key={cs.id} className="rounded-3xl bg-surface-warm/50 border border-hairline p-8 flex flex-col justify-between shadow-soft hover:shadow-lift hover:-translate-y-0.5 transition-all">
              <div>
                <span className="text-xs font-semibold uppercase text-emerald tracking-wide">{cs.segment}</span>
                <h3 className="text-xl font-bold text-ink mt-2 mb-3 font-display">{cs.client}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{cs.description}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline">
                <span className="text-xl font-bold text-emerald block">{cs.results}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- DIFFERENTIATORS ---------------- */
function Differentiators({ data }: { data: SiteData["differentiators"] }) {
  return (
    <section id="diferenciais" className="py-20 md:py-28">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald">
            {data.badge}
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl text-ink">
            {data.title}
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-3xl overflow-hidden hairline">
          {data.items.map((it, i) => (
            <div
              key={it.title}
              className="bg-surface p-7 hover:bg-surface-warm transition-colors"
            >
              <div className="text-xs font-mono text-emerald">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 text-base font-semibold text-ink">{it.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- BIG CTA ---------------- */
function BigCTA({ data }: { data: SiteData["bigCTA"] }) {
  return (
    <section className="py-20 md:py-24">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-10 md:p-16 shadow-lift">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald/20 blur-3xl" aria-hidden />
          <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-gold/10 blur-3xl" aria-hidden />
          <div className="relative max-w-3xl">
            <h2 className="text-4xl md:text-5xl text-primary-foreground leading-tight">
              {data.title}
            </h2>
            <p className="mt-5 text-lg text-primary-foreground/75 max-w-2xl">
              {data.text}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#contato">
                <Button
                  size="lg"
                  className="h-12 px-7 rounded-full bg-emerald text-primary-foreground hover:bg-emerald/90 shadow-glow"
                >
                  {data.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 rounded-full border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground bg-transparent"
                >
                  <MessageCircle className="h-4 w-4" /> {data.whatsappText}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ({ data }: { data: SiteData["faq"] }) {
  return (
    <section id="faq" className="py-20 md:py-28 bg-surface-warm">
      <div className="container-x grid lg:grid-cols-[1fr_1.4fr] gap-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald">
            {data.badge}
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl text-ink">
            {data.title}
          </h2>
          <p className="mt-4 text-ink-soft">
            {data.description}
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-5">
            <Button variant="outline" className="rounded-full border-ink/15 hover:border-emerald hover:text-emerald bg-surface">
              <MessageCircle className="h-4 w-4" /> Perguntar no WhatsApp
            </Button>
          </a>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {data.items.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-hairline">
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-ink hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-ink-soft leading-relaxed">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ---------------- LEAD FORM ---------------- */
function LeadForm({ data }: { data: SiteData["leadForm"] }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nome = String(formData.get("nome") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const telefone = String(formData.get("telefone") || "").trim();

    if (nome.length < 2 || nome.length > 100) {
      toast.error("Informe um nome válido.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    if (telefone.length < 8 || telefone.length > 30) {
      toast.error("Informe um telefone válido.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Recebemos sua solicitação. Um especialista entrará em contato.");
      (e.target as HTMLFormElement).reset();
    }, 700);
  };

  return (
    <section id="contato" className="py-20 md:py-28">
      <div className="container-x grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-24">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald">
            {data.badge}
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl text-ink">
            {data.title}
          </h2>
          <p className="mt-5 text-ink-soft text-lg">
            {data.description}
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ink">
            {data.bullets.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-surface hairline shadow-lift p-6 md:p-10"
          noValidate
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field name="nome" label="Nome" required autoComplete="name" />
            <Field name="empresa" label="Empresa" autoComplete="organization" />
            <Field name="telefone" label="Telefone" required type="tel" autoComplete="tel" />
            <Field name="whatsapp" label="WhatsApp" type="tel" />
            <Field name="cidade" label="Cidade" autoComplete="address-level2" />
            <Field name="email" label="Email" required type="email" autoComplete="email" />
          </div>
          <div className="mt-4">
            <Label htmlFor="mensagem" className="text-sm text-ink">
              Mensagem
            </Label>
            <Textarea
              id="mensagem"
              name="mensagem"
              rows={4}
              maxLength={1000}
              placeholder="Conte brevemente o que sua empresa vende ou executa."
              className="mt-2 bg-background border-hairline focus-visible:ring-emerald"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-6 w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lift"
          >
            {loading ? "Enviando..." : "Quero falar com um especialista"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>

          <p className="mt-4 text-xs text-ink-soft text-center">
            Entraremos em contato o mais breve possível. Sem compromisso.
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  required,
  type = "text",
  autoComplete,
}: {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <Label htmlFor={name} className="text-sm text-ink">
        {label} {required && <span className="text-emerald">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        maxLength={200}
        className="mt-2 bg-background border-hairline focus-visible:ring-emerald"
      />
    </div>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  const handleOpenLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-admin-login"));
  };

  return (
    <footer className="border-t border-hairline bg-surface-warm">
      <div className="container-x py-12 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <img
              src={wiseLogo}
              alt="Wise Logo"
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="font-display text-lg text-ink">
              Wise <span className="text-emerald">Licitações</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-ink-soft max-w-xs">
            Assessoria completa em licitações públicas. Do edital à assinatura do contrato.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-emerald" />
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald" />
              <a href="mailto:contato@wiselicitacoes.com.br" className="hover:text-ink">
                contato@wiselicitacoes.com.br
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald" />
              <span>Atendimento comercial em horário comercial</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald" />
              <span>Atuação em todo o Brasil</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-ink">Navegação</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            <li><a href="#processo" className="hover:text-ink">Processo</a></li>
            <li><a href="#especialidades" className="hover:text-ink">Especialidades</a></li>
            <li><a href="#cases" className="hover:text-ink">Cases</a></li>
            <li><a href="#diferenciais" className="hover:text-ink">Diferenciais</a></li>
            <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
            <li>
              <a 
                href="#admin-login" 
                onClick={handleOpenLogin} 
                className="hover:text-emerald text-ink-soft transition-colors flex items-center gap-1 mt-2 font-medium"
              >
                <Lock className="h-3 w-3" /> Área do Administrador
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <div className="container-x py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
          <span>© {new Date().getFullYear()} Wise Licitações. Todos os direitos reservados.</span>
          <span>Assessoria especializada em licitações públicas — Brasil</span>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- FLOATING ACTIONS ---------------- */
function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="group relative"
      >
        <span className="absolute inset-0 rounded-full bg-emerald/40 blur-xl group-hover:bg-emerald/60 transition-colors" aria-hidden />
        <span className="relative flex items-center gap-2 rounded-full bg-emerald text-primary-foreground pl-4 pr-5 py-3 shadow-lift">
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline text-sm font-semibold">WhatsApp</span>
        </span>
      </a>
    </div>
  );
}
