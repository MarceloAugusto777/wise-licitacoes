import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  MessageCircle, 
  CheckCircle2, 
  ArrowRight,
  Search,
  FileText,
  ClipboardCheck,
  FolderCheck,
  Send,
  Gavel,
  Scale,
  Handshake,
  TrendingUp,
  AlertTriangle,
  Users,
  Clock,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  Building2,
  HeartPulse,
  HardHat,
  Coins,
  BarChart3,
  Briefcase,
  Maximize,
  Minimize,
  Download,
  Loader2
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import pptxgen from "pptxgenjs";
import { toast } from "sonner";
import wiseLogo from "@/assets/wise-logo.png";
import { Button } from "./ui/button";
import { SiteData, PresentationData, CaseStudy } from "@/lib/initialData";

interface PresentationModeProps {
  siteData: SiteData;
  presentationData: PresentationData;
  cases: CaseStudy[];
  onExit: () => void;
}

export function PresentationMode({
  siteData,
  presentationData,
  cases,
  onExit,
}: PresentationModeProps) {
  // Filter only visible slides
  const visibleSlides = presentationData.slides.filter(s => s.visible);
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState("");
  const [isGeneratingPptx, setIsGeneratingPptx] = useState(false);

  const handleDownloadPdf = () => {
    if (visibleSlides.length === 0) {
      toast.error("Nenhum slide visível para exportar.");
      return;
    }
    window.print();
  };

  const handleDownloadPptx = async () => {
    if (visibleSlides.length === 0) {
      toast.error("Nenhum slide visível para exportar.");
      return;
    }

    setIsGeneratingPptx(true);
    toast.info("Gerando arquivo PowerPoint (.pptx)... Por favor aguarde.");

    try {
      const pptx = new pptxgen();
      pptx.layout = "LAYOUT_16x9";
      pptx.title = "Wise Licitações - Apresentação Comercial";
      pptx.company = "Wise Licitações";

      for (let i = 0; i < visibleSlides.length; i++) {
        const sItem = visibleSlides[i];
        const pptxSlide = pptx.addSlide();

        // 1. Dark Background (#020617)
        pptxSlide.background = { color: "020617" };

        // 2. Header
        pptxSlide.addText([
          { text: "Wise ", options: { bold: true, color: "FFFFFF" } },
          { text: "Apresentação", options: { color: "34D399" } }
        ], { x: 0.6, y: 0.4, fontSize: 16, fontFace: "Arial" });

        pptxSlide.addText(sItem.label ? sItem.label.toUpperCase() : "WISE LICITAÇÕES", {
          x: 8.0,
          y: 0.4,
          w: 4.7,
          fontSize: 10,
          color: "34D399",
          align: "right",
          bold: true,
          fontFace: "Arial"
        });

        // Top Hairline Separator
        pptxSlide.addShape(pptx.ShapeType.rect, {
          x: 0.6,
          y: 0.9,
          w: 12.13,
          h: 0.02,
          fill: { color: "1E293B" }
        });

        // 3. Title & Subtitle
        if (sItem.title) {
          pptxSlide.addText(sItem.title, {
            x: 0.6,
            y: 1.2,
            w: 12.13,
            fontSize: 24,
            bold: true,
            color: "FFFFFF",
            fontFace: "Georgia"
          });
        }

        if (sItem.subtitle) {
          pptxSlide.addText(sItem.subtitle, {
            x: 0.6,
            y: 1.9,
            w: 12.13,
            fontSize: 13,
            color: "94A3B8",
            fontFace: "Arial"
          });
        }

        // 4. Content Body based on slide type
        if (sItem.id === "proposta" && proposalData) {
          const visibleModels = proposalData.models.filter(m => !m.hidden);
          const count = visibleModels.length || 1;
          const colWidth = count === 1 ? 7.0 : count === 2 ? 5.2 : 3.7;
          const totalWidth = count * colWidth + (count - 1) * 0.4;
          const startX = (13.33 - totalWidth) / 2;

          visibleModels.forEach((model, mIdx) => {
            const posX = startX + mIdx * (colWidth + 0.4);

            // Card Rectangle Shape
            pptxSlide.addShape(pptx.ShapeType.rect, {
              x: posX,
              y: 2.6,
              w: colWidth,
              h: 4.1,
              fill: { color: "0F172A" },
              line: { color: model.highlight ? "10B981" : "1E293B", width: model.highlight ? 2 : 1 }
            });

            // Model Title
            pptxSlide.addText(model.name, {
              x: posX + 0.2,
              y: 2.8,
              w: colWidth - 0.4,
              fontSize: 16,
              bold: true,
              color: "FFFFFF",
              align: "center",
              fontFace: "Arial"
            });

            // Model Price
            pptxSlide.addText(`R$ ${model.price}`, {
              x: posX + 0.2,
              y: 3.3,
              w: colWidth - 0.4,
              fontSize: 22,
              bold: true,
              color: "34D399",
              align: "center",
              fontFace: "Arial"
            });

            // Model Period
            pptxSlide.addText(model.period, {
              x: posX + 0.2,
              y: 3.8,
              w: colWidth - 0.4,
              fontSize: 10,
              color: "64748B",
              align: "center",
              fontFace: "Arial"
            });

            // Separator Line inside card
            pptxSlide.addShape(pptx.ShapeType.rect, {
              x: posX + 0.3,
              y: 4.2,
              w: colWidth - 0.6,
              h: 0.01,
              fill: { color: "1E293B" }
            });

            // Bullets/Details
            if (model.details) {
              const lines = model.details.split("\n").filter(Boolean);
              lines.forEach((line, lIdx) => {
                if (lIdx < 6) {
                  pptxSlide.addText(`✔ ${line}`, {
                    x: posX + 0.3,
                    y: 4.4 + lIdx * 0.32,
                    w: colWidth - 0.6,
                    fontSize: 9.5,
                    color: "CBD5E1",
                    fontFace: "Arial"
                  });
                }
              });
            }
          });
        } else {
          // Render generic native content boxes
          const cardWidth = 3.8;
          const gap = 0.3;
          const startX = 0.6;

          if (sItem.id === "hero" && siteData.hero) {
            pptxSlide.addShape(pptx.ShapeType.rect, {
              x: 0.6,
              y: 2.8,
              w: 12.13,
              h: 3.8,
              fill: { color: "0F172A" },
              line: { color: "1E293B", width: 1 }
            });

            const highlights = siteData.hero.highlights || [
              "Foco em resultado e alta taxa de conversão",
              "Segurança jurídica total em editais públicos",
              "Acompanhamento de ponta a ponta"
            ];

            highlights.forEach((h, hIdx) => {
              pptxSlide.addText(`✦ ${h}`, {
                x: 1.0,
                y: 3.3 + hIdx * 0.8,
                w: 11.0,
                fontSize: 14,
                color: "34D399",
                bold: true,
                fontFace: "Arial"
              });
            });
          } else if (sItem.id === "pain") {
            // Desafios do setor (3 cards)
            const painItems = [
              { title: "Burocracia e Complexidade Jurídica", desc: "Análise minuciosa de todas as exigências do edital para zerar riscos de inabilitação." },
              { title: "Erros em Documentação", desc: "Verificação rigorosa de certidões, balanços e atestados técnicos exigidos pelos órgãos." },
              { title: "Falta de Equipe Especializada", desc: "Assumimos toda a operação comercial e jurídica sem necessidade de inflar seu time interno." }
            ];

            painItems.forEach((pItem, pIdx) => {
              const pPosX = startX + pIdx * (cardWidth + gap);
              pptxSlide.addShape(pptx.ShapeType.rect, {
                x: pPosX,
                y: 2.6,
                w: cardWidth,
                h: 4.1,
                fill: { color: "0F172A" },
                line: { color: "334155", width: 1 }
              });

              pptxSlide.addText(`0${pIdx + 1}`, {
                x: pPosX + 0.3,
                y: 2.8,
                w: cardWidth - 0.6,
                fontSize: 20,
                bold: true,
                color: "EF4444",
                fontFace: "Arial"
              });

              pptxSlide.addText(pItem.title, {
                x: pPosX + 0.3,
                y: 3.4,
                w: cardWidth - 0.6,
                fontSize: 13,
                bold: true,
                color: "FFFFFF",
                fontFace: "Arial"
              });

              pptxSlide.addText(pItem.desc, {
                x: pPosX + 0.3,
                y: 4.3,
                w: cardWidth - 0.6,
                fontSize: 10,
                color: "94A3B8",
                fontFace: "Arial"
              });
            });
          } else if (sItem.id === "process") {
            // Metodologia (4 cards horizontais)
            const stepWidth = 2.8;
            const stepGap = 0.3;
            const stepSteps = [
              { num: "01", title: "Mapeamento", desc: "Monitoramento diário de oportunidades em todo o Brasil." },
              { num: "02", title: "Análise de Edital", desc: "Estudo de viabilidade técnica e financeira das licitações." },
              { num: "03", title: "Habilitação", desc: "Organização da documentação e preparação das propostas." },
              { num: "04", title: "Disputa & Contrato", desc: "Participação no pregão e acompanhamento da homologação." }
            ];

            stepSteps.forEach((st, stIdx) => {
              const stPosX = startX + stIdx * (stepWidth + stepGap);
              pptxSlide.addShape(pptx.ShapeType.rect, {
                x: stPosX,
                y: 2.6,
                w: stepWidth,
                h: 4.1,
                fill: { color: "0F172A" },
                line: { color: "1E293B", width: 1 }
              });

              pptxSlide.addText(st.num, {
                x: stPosX + 0.2,
                y: 2.8,
                w: stepWidth - 0.4,
                fontSize: 22,
                bold: true,
                color: "10B981",
                fontFace: "Arial"
              });

              pptxSlide.addText(st.title, {
                x: stPosX + 0.2,
                y: 3.5,
                w: stepWidth - 0.4,
                fontSize: 13,
                bold: true,
                color: "FFFFFF",
                fontFace: "Arial"
              });

              pptxSlide.addText(st.desc, {
                x: stPosX + 0.2,
                y: 4.3,
                w: stepWidth - 0.4,
                fontSize: 9.5,
                color: "94A3B8",
                fontFace: "Arial"
              });
            });
          } else if (sItem.id === "benefits" || sItem.id === "differentiators") {
            // Grid 2x2 de diferenciais
            const bCards = [
              { title: "Segurança Jurídica Total", desc: "Análise detalhada por especialistas em Direito Administrativo." },
              { title: "Inteligência Estratégica", desc: "Estudo de concorrência e estimativa de lances vencedores." },
              { title: "Taxa de Sucesso Elevada", desc: "Histórico comprovado com milhões em contratos homologados." },
              { title: "Acompanhamento de Ponta a Ponta", desc: "Suporte contínuo da publicação do edital até a assinatura do contrato." }
            ];

            bCards.forEach((bItem, bIdx) => {
              const row = Math.floor(bIdx / 2);
              const col = bIdx % 2;
              const gX = 0.6 + col * 6.2;
              const gY = 2.6 + row * 2.1;

              pptxSlide.addShape(pptx.ShapeType.rect, {
                x: gX,
                y: gY,
                w: 5.9,
                h: 1.9,
                fill: { color: "0F172A" },
                line: { color: "1E293B", width: 1 }
              });

              pptxSlide.addText(`✔  ${bItem.title}`, {
                x: gX + 0.3,
                y: gY + 0.3,
                w: 5.3,
                fontSize: 13,
                bold: true,
                color: "34D399",
                fontFace: "Arial"
              });

              pptxSlide.addText(bItem.desc, {
                x: gX + 0.3,
                y: gY + 0.9,
                w: 5.3,
                fontSize: 10,
                color: "94A3B8",
                fontFace: "Arial"
              });
            });
          } else if (sItem.id === "specialties") {
            // Segmentos (Grid 3x2)
            const specs = [
              "Engenharia & Construção", "Tecnologia & TI", "Saúde & Hospitalar",
              "Serviços Terceirizados", "Alimentos & Logística", "Consultoria & Treinamento"
            ];

            specs.forEach((spec, spIdx) => {
              const spRow = Math.floor(spIdx / 3);
              const spCol = spIdx % 3;
              const spX = 0.6 + spCol * 4.1;
              const spY = 2.8 + spRow * 1.9;

              pptxSlide.addShape(pptx.ShapeType.rect, {
                x: spX,
                y: spY,
                w: 3.8,
                h: 1.6,
                fill: { color: "0F172A" },
                line: { color: "10B981", width: 1 }
              });

              pptxSlide.addText(spec, {
                x: spX + 0.2,
                y: spY + 0.6,
                w: 3.4,
                fontSize: 12,
                bold: true,
                color: "FFFFFF",
                align: "center",
                fontFace: "Arial"
              });
            });
          } else if (sItem.id === "perguntas") {
            // FAQ (Top 3 perguntas)
            const faqs = [
              { q: "Minha empresa nunca participou de licitação, posso começar?", a: "Sim! Cuidamos de toda a estruturação inicial, cadastros e documentação necessária." },
              { q: "Quais são as garantias de conformidade nos editais?", a: "Analisamos 100% dos requisitos jurídicos e técnicos para eliminar riscos de inabilitação." },
              { q: "Como funciona o acompanhamento dos resultados?", a: "Você recebe relatórios atualizados de cada pregão e etapa do processo." }
            ];

            faqs.forEach((faq, fIdx) => {
              const fY = 2.6 + fIdx * 1.35;

              pptxSlide.addShape(pptx.ShapeType.rect, {
                x: 0.6,
                y: fY,
                w: 12.13,
                h: 1.2,
                fill: { color: "0F172A" },
                line: { color: "1E293B", width: 1 }
              });

              pptxSlide.addText(`P: ${faq.q}`, {
                x: 0.9,
                y: fY + 0.18,
                w: 11.5,
                fontSize: 11,
                bold: true,
                color: "34D399",
                fontFace: "Arial"
              });

              pptxSlide.addText(`R: ${faq.a}`, {
                x: 0.9,
                y: fY + 0.6,
                w: 11.5,
                fontSize: 9.5,
                color: "CBD5E1",
                fontFace: "Arial"
              });
            });
          } else if (sItem.id === "cases" && siteData.cases) {
            siteData.cases.slice(0, 3).forEach((cItem, cIdx) => {
              const cPosX = startX + cIdx * (cardWidth + gap);
              pptxSlide.addShape(pptx.ShapeType.rect, {
                x: cPosX,
                y: 2.6,
                w: cardWidth,
                h: 4.1,
                fill: { color: "0F172A" },
                line: { color: "1E293B", width: 1 }
              });

              pptxSlide.addText(cItem.client, {
                x: cPosX + 0.2,
                y: 2.8,
                w: cardWidth - 0.4,
                fontSize: 14,
                bold: true,
                color: "FFFFFF",
                fontFace: "Arial"
              });

              pptxSlide.addText(cItem.segment, {
                x: cPosX + 0.2,
                y: 3.2,
                w: cardWidth - 0.4,
                fontSize: 10,
                color: "34D399",
                fontFace: "Arial"
              });

              pptxSlide.addText(cItem.result, {
                x: cPosX + 0.2,
                y: 3.8,
                w: cardWidth - 0.4,
                fontSize: 18,
                bold: true,
                color: "10B981",
                fontFace: "Arial"
              });

              pptxSlide.addText(cItem.description || "", {
                x: cPosX + 0.2,
                y: 4.5,
                w: cardWidth - 0.4,
                fontSize: 9.5,
                color: "94A3B8",
                fontFace: "Arial"
              });
            });
          } else {
            // Slide genérico / customizado
            pptxSlide.addShape(pptx.ShapeType.rect, {
              x: 0.6,
              y: 2.6,
              w: 12.13,
              h: 4.1,
              fill: { color: "0F172A" },
              line: { color: "1E293B", width: 1 }
            });

            pptxSlide.addText("Conteúdo Personalizado:", {
              x: 0.9,
              y: 2.9,
              w: 11.5,
              fontSize: 14,
              bold: true,
              color: "34D399",
              fontFace: "Arial"
            });

            pptxSlide.addText(
              sItem.customContent || "Esta seção apresenta as estratégias, metodologias e soluções personalizadas oferecidas pela Wise Licitações para garantir inteligência comercial e vitórias em processos licitatórios.",
              {
                x: 0.9,
                y: 3.4,
                w: 11.5,
                fontSize: 12,
                color: "CBD5E1",
                fontFace: "Arial"
              }
            );
          }
        }

        // Bottom Hairline Separator
        pptxSlide.addShape(pptx.ShapeType.rect, {
          x: 0.6,
          y: 6.8,
          w: 12.13,
          h: 0.02,
          fill: { color: "1E293B" }
        });

        // 5. Footer
        pptxSlide.addText("Wise Licitações & Consultoria Comercial", {
          x: 0.6,
          y: 7.0,
          fontSize: 9,
          color: "64748B",
          fontFace: "Arial"
        });

        pptxSlide.addText(`Página ${i + 1} de ${visibleSlides.length}`, {
          x: 8.0,
          y: 7.0,
          w: 4.7,
          fontSize: 9,
          color: "64748B",
          align: "right",
          fontFace: "Arial"
        });
      }

      await pptx.writeFile({ fileName: "Apresentacao_Wise_Licitacoes.pptx" });
      toast.success("Apresentação PowerPoint (.pptx) gerada e baixada com sucesso!");
    } catch (err) {
      console.error("Erro ao gerar PowerPoint:", err);
      toast.error("Falha ao gerar o arquivo PowerPoint.");
    } finally {
      setIsGeneratingPptx(false);
    }
  };

  const go = useCallback(
    (delta: number) =>
      setIndex((i) => Math.min(visibleSlides.length - 1, Math.max(0, i + delta))),
    [visibleSlides.length],
  );

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [go, onExit]);

  const slide = visibleSlides[index];
  const WHATSAPP_URL = "https://wa.me/5500000000000?text=Ol%C3%A1%2C%20gostaria%20de%20uma%20consultoria%20sobre%20licita%C3%A7%C3%B5es";

  // Vector Mock QR Code SVG
  const renderQRCode = () => (
    <div className="relative p-3 bg-white rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.25)] border-2 border-emerald-400 inline-block animate-float-up">
      <svg className="w-40 h-40 md:w-44 md:h-44 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
        <rect width="100" height="100" rx="6" fill="white" />
        {/* Position markers */}
        <rect x="8" y="8" width="22" height="22" rx="2" fill="currentColor" />
        <rect x="11" y="11" width="16" height="16" rx="1" fill="white" />
        <rect x="14" y="14" width="10" height="10" rx="0.5" fill="#10b981" />
        
        <rect x="70" y="8" width="22" height="22" rx="2" fill="currentColor" />
        <rect x="73" y="11" width="16" height="16" rx="1" fill="white" />
        <rect x="76" y="14" width="10" height="10" rx="0.5" fill="#10b981" />
        
        <rect x="8" y="70" width="22" height="22" rx="2" fill="currentColor" />
        <rect x="11" y="73" width="16" height="16" rx="1" fill="white" />
        <rect x="14" y="76" width="10" height="10" rx="0.5" fill="#10b981" />
        
        {/* Grid dots */}
        <rect x="36" y="8" width="6" height="6" fill="currentColor" />
        <rect x="48" y="12" width="10" height="4" fill="currentColor" />
        <rect x="42" y="20" width="16" height="6" fill="#10b981" />
        
        <rect x="8" y="38" width="10" height="6" fill="currentColor" />
        <rect x="24" y="38" width="6" height="12" fill="currentColor" />
        <rect x="14" y="52" width="14" height="6" fill="currentColor" />
        
        <rect x="38" y="38" width="24" height="24" fill="currentColor" />
        <rect x="43" y="43" width="14" height="14" fill="white" />
        <rect x="47" y="47" width="6" height="6" fill="#10b981" />
        
        <rect x="68" y="38" width="12" height="6" fill="currentColor" />
        <rect x="82" y="44" width="10" height="10" fill="currentColor" />
        <rect x="68" y="54" width="16" height="6" fill="#10b981" />
        
        <rect x="38" y="68" width="6" height="16" fill="currentColor" />
        <rect x="48" y="74" width="12" height="12" fill="currentColor" />
        <rect x="54" y="80" width="10" height="10" fill="#10b981" />
        
        <rect x="38" y="88" width="12" height="4" fill="currentColor" />
        <rect x="68" y="88" width="16" height="4" fill="currentColor" />
      </svg>
      {/* Mini WhatsApp Icon in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow border border-slate-100">
        <div className="bg-emerald p-1 rounded-full text-white animate-pulse">
          <MessageCircle className="h-4.5 w-4.5 fill-white" />
        </div>
      </div>
    </div>
  );

  // Helper to map string icon name to Lucide React component
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

  // Custom renderer for slide contents
  const renderSlideContent = (customSlide?: SlideData) => {
    const slide = customSlide || visibleSlides[index];
    if (!slide) return null;

    switch (slide.type) {
      case "hero":
        return (
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6 py-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-400 animate-fade-in shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Wise Licitações
            </span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white">
              {slide.title.split(":").map((t, idx) => (
                <span key={idx} className={idx === 1 ? "block text-emerald-400 mt-2 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent" : ""}>
                  {t}{idx === 0 && slide.title.includes(":") ? ":" : ""}
                </span>
              ))}
            </h1>
            
            {/* Green accent line */}
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto my-6 rounded-full" />

            <p className="text-lg sm:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              {slide.subtitle}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8">
              {((slide.items && slide.items.length > 0) 
                ? slide.items.map(it => it.title || it.text || "") 
                : siteData.hero.bullets
              ).map((bullet, i) => (
                <div key={i} className="flex flex-col items-center p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-lift backdrop-blur-md hover:border-emerald-500/20 transition-all duration-300">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-200 text-center">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case "market":
        const marketStats = (slide.items && slide.items.length > 0) 
          ? slide.items 
          : [
              { value: "R$ 1,3 Trilhão", label: "Movimentação Anual", desc: "O Governo é o maior comprador de produtos e serviços do país.", icon: "Coins" },
              { value: "+1.500", label: "Novos Editais Diários", desc: "Oportunidades em praticamente todos os segmentos comerciais.", icon: "BarChart3" },
              { value: "Lei 14.133/21", label: "Ambiente Moderno", desc: "Nova lei de licitações com processos mais transparentes e ágeis.", icon: "Scale" },
              { value: "Prioridade PME", label: "Benefícios Exclusivos", desc: "Empresas de menor porte possuem vantagens e editais exclusivos de até R$ 80k.", icon: "Sparkles" }
            ];

        return (
          <div className="max-w-5xl mx-auto px-6 space-y-8 py-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">{slide.badge || "Oportunidade Comercial"}</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-white font-display">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-light">{slide.subtitle}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {marketStats.map((stat, i) => {
                const Icon = getIcon(stat.icon);
                return (
                  <div key={i} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-lift hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">{stat.value}</div>
                      <div className="text-sm font-semibold text-slate-100 mt-2">{stat.label}</div>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">{stat.desc || stat.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "pain":
        const painItemsList = (slide.items && slide.items.length > 0) ? slide.items : siteData.pain.items;
        return (
          <div className="max-w-5xl mx-auto px-6 space-y-8 py-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">{slide.badge || "Desafios Comerciais"}</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-white font-display">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">{slide.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {painItemsList.map((item, i) => {
                const Icon = getIcon(item.icon);
                return (
                  <div key={i} className="p-6 bg-slate-900/50 border border-slate-800/60 rounded-2xl shadow-lift border-b-2 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                    <div className="h-10 w-10 rounded-xl bg-slate-800/80 grid place-items-center mb-4 text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "process":
        const processItemsList = (slide.items && slide.items.length > 0) ? slide.items : siteData.process.items;
        return (
          <div className="max-w-5xl mx-auto px-6 space-y-6 py-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">{slide.badge || "Metodologia Wise"}</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-white font-display">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">{slide.subtitle}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {processItemsList.map((step, i) => {
                const Icon = getIcon(step.icon);
                return (
                  <div key={i} className="p-5 bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800/80 rounded-2xl relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-300">
                    <div className="absolute top-2 right-4 text-4xl font-display font-extrabold text-emerald-500/10">0{i + 1}</div>
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400 mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-100">{step.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-light">{step.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "benefits":
        const benefitItemsList = (slide.items && slide.items.length > 0) ? slide.items : siteData.benefits.items;
        return (
          <div className="max-w-5xl mx-auto px-6 space-y-8 py-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">{slide.badge || "Retorno sobre o Investimento"}</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-white font-display">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">{slide.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefitItemsList.map((item, i) => {
                const Icon = getIcon(item.icon);
                return (
                  <div key={i} className="p-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl flex gap-4 items-start shadow-lift hover:border-emerald-500/30 transition-all duration-300">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald/10 border border-emerald/20 grid place-items-center text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-200">{item.title}</h3>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-light">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "specialties":
        return (
          <div className="max-w-5xl mx-auto px-6 space-y-8 py-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Especialização Técnica</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-white font-display">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-light">{slide.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 pt-4">
              {siteData.specialties.cards.map((card, i) => {
                const Icon = getIcon(card.icon);
                return (
                  <div 
                    key={card.tag}
                    className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/30 shadow-lift transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-base font-bold text-slate-100">{card.tag}</span>
                      </div>
                      <h3 className="mt-6 text-xl font-bold leading-snug text-slate-200">{card.title}</h3>
                      
                      <ul className="mt-6 space-y-2.5">
                        {card.items.slice(0, 5).map((it) => (
                          <li key={it} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "differentiators":
        return (
          <div className="max-w-5xl mx-auto px-6 space-y-8 py-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Por que a Wise?</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-white font-display">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-light">{slide.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 pt-4">
              {/* Wise Licitações (Highlighted) */}
              <div className="p-8 rounded-3xl bg-slate-900/80 border-2 border-emerald-400 relative shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col justify-between">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-emerald-300">
                  Assessoria End-to-End
                </div>
                
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 grid place-items-center text-emerald-400 mb-6 mx-auto">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 text-center font-display mb-4">Wise Licitações</h3>
                  <ul className="space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Nós fazemos tudo:</strong> do monitoramento operacional à assinatura.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Corpo Jurídico Sênior:</strong> elaboração de recursos contra erros formais.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Assessoria Humana:</strong> especialistas reais no telefone e no chat.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Foco em Resultados:</strong> modelo comercial alinhado com o seu faturamento.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-800">
                  <div className="text-emerald-400 text-center text-sm font-semibold">Parceria Completa</div>
                </div>
              </div>

              {/* Softwares/Robôs */}
              <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-slate-800 grid place-items-center text-slate-400 mb-6 mx-auto">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 text-center font-display mb-4">Softwares de Editais</h3>
                  <ul className="space-y-3 text-xs text-slate-400">
                    <li className="flex items-start gap-2">
                      <X className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Apenas disparam e-mails com editais (muitas vezes incompatíveis).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Sua empresa faz o credenciamento e junta os documentos sozinha.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Nenhum suporte jurídico em caso de desclassificação indevida.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Mensalidades fixas caras, mesmo sem ganhar nenhuma licitação.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-800">
                  <div className="text-slate-500 text-center text-sm font-semibold">Apenas uma Ferramenta</div>
                </div>
              </div>

              {/* Consultorias Tradicionais */}
              <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800/80 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-slate-800 grid place-items-center text-slate-400 mb-6 mx-auto">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 text-center font-display mb-4">Consultorias Comuns</h3>
                  <ul className="space-y-3 text-xs text-slate-400">
                    <li className="flex items-start gap-2">
                      <X className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Focam apenas em pareceres teóricos e análise de documentos frios.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Não disputam sessões eletrônicas ao vivo ou dão lances.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Cobram honorários mensais fixos exorbitantes de consultores.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                      <span>Lentidão operacional incompatível com a velocidade do edital.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-4 border-t border-slate-800">
                  <div className="text-slate-500 text-center text-sm font-semibold">Teoria sem Execução</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "cases":
        const visibleCases = cases.filter(c => c.visibleInPresentation);
        const activeCase = visibleCases[activeCaseIndex];
        
        if (visibleCases.length === 0) {
          return (
            <div className="max-w-5xl mx-auto px-6 text-center py-12 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-sm">Nenhum case de sucesso ativado para a apresentação. Ative-os no painel de administração.</p>
            </div>
          );
        }

        return (
          <div className="max-w-5xl mx-auto px-6 space-y-8 py-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Cases de Sucesso (Carrossel)</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-white font-display">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">{slide.subtitle}</p>
            </div>
            
            {/* Carousel Container */}
            <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 items-center bg-slate-900/60 border border-slate-800/80 p-8 md:p-10 rounded-3xl shadow-lift backdrop-blur-md hover:border-emerald-500/20 transition-all duration-300">
              
              {/* Left Column: Details */}
              <div className="space-y-4 text-left flex flex-col justify-between h-full min-h-[300px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                      {activeCase.segment}
                    </span>
                    <span className="text-xs text-slate-500">
                      Case {activeCaseIndex + 1} de {visibleCases.length}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">{activeCase.client}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">{activeCase.description}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div>
                    <div className="text-emerald-400 font-extrabold text-xl sm:text-2xl">{activeCase.results}</div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1">Resultado de Parceria Wise</span>
                  </div>

                  {/* Carousel Controls */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => setActiveCaseIndex((prev) => (prev - 1 + visibleCases.length) % visibleCases.length)}
                      className="h-8 w-8 rounded-full border border-slate-800 grid place-items-center text-slate-400 hover:text-white hover:border-emerald-400/30 transition-colors"
                      title="Anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex gap-1.5">
                      {visibleCases.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveCaseIndex(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            i === activeCaseIndex ? "w-6 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "w-1.5 bg-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setActiveCaseIndex((prev) => (prev + 1) % visibleCases.length)}
                      className="h-8 w-8 rounded-full border border-slate-800 grid place-items-center text-slate-400 hover:text-white hover:border-emerald-400/30 transition-colors"
                      title="Próximo"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right Column: Image */}
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-20 blur-xl rounded-2xl pointer-events-none" />
                {activeCase.imageUrl ? (
                  <img
                    src={activeCase.imageUrl}
                    alt={activeCase.client}
                    className="relative w-full h-64 sm:h-80 object-cover rounded-2xl border border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                  />
                ) : (
                  <div className="relative w-full h-64 sm:h-80 bg-slate-850 rounded-2xl border border-slate-800 grid place-items-center text-slate-600">
                    <Briefcase className="h-12 w-12" />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "onboarding": {
        const onboardingStepsList = (slide.items && slide.items.length > 0)
          ? slide.items
          : [
              {
                time: "Dias 1 a 3",
                title: "Auditoria Completa",
                desc: "Auditoria operacional, levantamento de certidões vigentes e identificação de eventuais bloqueios de habilitação."
              },
              {
                time: "Dias 4 a 6",
                title: "Cadastros Governamentais",
                desc: "Credenciamento no Compras.gov.br e portais municipais/estaduais estratégicos para a sua área de atuação."
              },
              {
                time: "Dias 7 a 9",
                title: "Mapeamento Comercial",
                desc: "Filtro dinâmico das primeiras licitações e editais compatíveis com a capacidade de entrega da sua empresa."
              },
              {
                time: "Dia 10 em diante",
                title: "Participação e Disputa",
                desc: "Envio de propostas comerciais e participação nos primeiros pregões em tempo real, acompanhado por nossa banca jurídica."
              }
            ];

        return (
          <div className="max-w-5xl mx-auto px-6 space-y-8 py-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">{slide.badge || "Plano de Entrada"}</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-white font-display">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-sm md:text-lg text-slate-350 max-w-2xl mx-auto font-light">{slide.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 pt-6 relative">
              {/* Horizontal line for timeline connection in desktop */}
              <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-emerald-500/20 via-emerald-500/40 to-emerald-500/20 z-0" />
              
              {onboardingStepsList.map((st, i) => (
                <div key={i} className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-lift relative z-10 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="h-10 w-10 rounded-full bg-emerald border-2 border-emerald-300 grid place-items-center text-slate-950 font-bold text-sm shadow-[0_0_12px_rgba(16,185,129,0.4)]">
                      {i + 1}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">{st.time}</div>
                    <h3 className="text-sm font-bold text-slate-100">{st.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">{st.desc || st.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "final":
        return (
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8 py-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 border border-emerald/20 px-3.5 py-1 text-xs font-semibold text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" /> Próximos Passos
              </span>
              <h2 className="text-4xl md:text-6xl font-bold font-display text-white">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-base sm:text-xl text-slate-300 max-w-xl mx-auto">{slide.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center max-w-3xl mx-auto pt-6">
              {/* Left Column: QR Code & CTA */}
              <div className="space-y-4">
                {renderQRCode()}
                <div className="text-xs text-slate-400 mt-2">
                  Aponte a câmera do celular para abrir o WhatsApp
                </div>
              </div>

              {/* Right Column: Next steps & contact */}
              <div className="text-left space-y-5 bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-lift backdrop-blur-md hover:border-emerald-500/20 transition-all duration-300">
                <h3 className="font-bold text-slate-200 text-sm border-b border-slate-850 pb-2 uppercase tracking-wider text-emerald-400">Como iniciamos:</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <span><strong>Diagnóstico Gratuito:</strong> Analisamos a documentação da sua empresa.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <span><strong>Mapeamento Comercial:</strong> Encontramos os primeiros editais ideais.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <span><strong>Início Operacional:</strong> Preparamos a documentação para disputa.</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-emerald hover:bg-emerald/90 text-white font-semibold py-2.5 px-4 transition-colors text-sm shadow-glow"
                  >
                    <MessageCircle className="h-4.5 w-4.5" /> Falar com Especialista
                  </a>
                  
                  <div className="flex justify-between items-center text-xs text-slate-400 px-1 pt-1.5">
                    <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-emerald" /> Comercial</span>
                    <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-emerald" /> contato@wiselicitacoes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "presentation-faq":
        return (
          <div className="max-w-4xl mx-auto px-6 space-y-8 py-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">FAQ Interativo</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-white font-display">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">{slide.subtitle}</p>
            </div>
            
            <div className="max-w-2xl mx-auto space-y-3 pt-4">
              {(presentationData.faqs || []).map((faq) => {
                const isOpen = activeFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`border rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
                      isOpen
                        ? "bg-slate-900/80 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                        : "bg-slate-900/30 border-slate-800/80 hover:border-slate-700"
                    }`}
                    onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                  >
                    <div className="p-5 flex items-center justify-between gap-4">
                      <span className="font-semibold text-sm sm:text-base text-slate-100 text-left">
                        {faq.q}
                      </span>
                      <div className={`h-6 w-6 rounded-full border border-slate-800 flex items-center justify-center shrink-0 transition-transform ${isOpen ? "rotate-180 text-emerald-400 border-emerald-500/30" : "text-slate-400"}`}>
                        <ChevronRight className="h-4 w-4 rotate-90" />
                      </div>
                    </div>
                    
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? "max-h-[200px] border-t border-slate-800/60" : "max-h-0"
                      }`}
                    >
                      <div className="p-5 text-xs sm:text-sm text-slate-300 text-left leading-relaxed font-light bg-slate-950/40">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "presentation-pricing":
        return (
          <div className="max-w-5xl mx-auto px-6 space-y-8 py-8 animate-fade-in">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Proposta Comercial</span>
              <h2 className="text-3xl md:text-5xl font-semibold text-white font-display">
                {slide.title}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                {slide.subtitle}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center items-stretch gap-6 pt-4 max-w-5xl mx-auto">
              {((slide.items && slide.items.length > 0) 
                ? slide.items 
                : (presentationData.pricing?.models || [])
              ).filter((m: any) => m.visible !== false).map((model: any, idx: number) => {
                // Split comma-separated details to show as list items
                const detailsList = model.details
                  ? model.details.split(",").map(d => d.trim()).filter(Boolean)
                  : [];
                
                return (
                  <div
                    key={model.id}
                    className="w-full md:w-[320px] max-w-sm p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 relative bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 shadow-lift group"
                  >
                    
                    <div>
                      <h3 className="text-lg font-bold font-display text-slate-100 text-center">
                        {model.name}
                      </h3>
                      
                      <div className="my-6 text-center">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-1">Investimento</span>
                        <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                          {model.cost}
                        </div>
                      </div>
                      
                      <ul className="space-y-3 border-t border-slate-800/80 pt-6">
                        {detailsList.map((detail, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                            <span className="leading-normal">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-light">
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" /> Transparência Wise
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "custom":
        return (
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6 py-8">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald/10 border border-emerald/20 px-3.5 py-1 text-xs font-semibold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Wise Apresentação
              </span>
              <h2 className="text-4xl md:text-6xl font-bold font-display text-white">{slide.title}</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto rounded-full my-3" />
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
                {slide.subtitle}
              </p>
            </div>
            
            {slide.customContent && (
              <div className="max-w-2xl mx-auto bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl shadow-lift backdrop-blur-md hover:border-emerald-500/20 transition-all duration-300 text-left">
                <p className="text-sm sm:text-base text-slate-300 whitespace-pre-wrap leading-relaxed font-light">
                  {slide.customContent}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center text-white p-12">
            <h2 className="text-2xl font-bold">Slide em Branco</h2>
            <p className="text-slate-400 mt-2">Nenhum conteúdo configurado para o tipo {slide.type}.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col select-none text-slate-100 overflow-hidden font-sans">
      {/* Background gradients for Stripes/Linear aesthetic */}
      <div className="absolute top-[-20%] left-[-10%] h-[70%] w-[50%] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[70%] w-[50%] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Glowing vertical separator accent lines */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent pointer-events-none" />

      {/* Presentation Header */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img
            src={wiseLogo}
            alt="Wise Logo"
            className="h-8 w-8 rounded-lg object-cover shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          />
          <span className="text-sm font-semibold tracking-tight text-slate-100">
            Wise <span className="text-emerald-400 font-light">Apresentação</span>
          </span>
          <span className="text-xs text-slate-500 border border-slate-800 px-2 py-0.5 rounded-full font-mono bg-slate-900/40">
            {slide?.label}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 tabular-nums mr-2">
            {index + 1} / {visibleSlides.length}
          </span>

          {!isFullscreen && (
            <>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-all shadow-glow disabled:opacity-50"
                title="Baixar toda a apresentação em PDF horizontal"
              >
                {isGeneratingPdf ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Gerando PDF...</>
                ) : (
                  <><Download className="h-3.5 w-3.5" /> Baixar PDF</>
                )}
              </button>

              <button
                onClick={handleDownloadPptx}
                disabled={isGeneratingPptx}
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400 hover:text-white hover:bg-blue-500/20 transition-all shadow-glow disabled:opacity-50"
                title="Baixar apresentação em PowerPoint (.pptx)"
              >
                {isGeneratingPptx ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Gerando PPT...</>
                ) : (
                  <><FileText className="h-3.5 w-3.5 text-blue-400" /> Baixar PPT</>
                )}
              </button>
            </>
          )}

          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-900 hover:border-emerald-500/30 transition-colors bg-slate-950"
            title={isFullscreen ? "Sair de Tela Cheia" : "Entrar em Tela Cheia"}
          >
            {isFullscreen ? (
              <><Minimize className="h-3.5 w-3.5" /> Sair da Tela Cheia</>
            ) : (
              <><Maximize className="h-3.5 w-3.5" /> Tela Cheia</>
            )}
          </button>

          {!isFullscreen && (
            <button
              onClick={onExit}
              aria-label="Sair da apresentação"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-900 hover:border-emerald-500/30 transition-colors bg-slate-950"
            >
              <X className="h-3.5 w-3.5" /> Sair da Sessão
            </button>
          )}
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-y-auto relative z-10 flex items-center justify-center py-6">
        <div key={index} className="slide-stage w-full">
          {renderSlideContent()}
        </div>
      </div>

      {/* Progress timeline */}
      <div className="relative z-10 flex items-center justify-center gap-2 py-4 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
        {visibleSlides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Ir para ${s.label}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index ? "w-10 bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "w-3.5 bg-slate-800 hover:bg-slate-700"
            }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => go(-1)}
        disabled={index === 0}
        aria-label="Slide anterior"
        className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-slate-900 border border-slate-800 grid place-items-center text-slate-300 disabled:opacity-20 hover:text-white hover:bg-slate-800 hover:border-emerald-500/20 transition-all shadow-lift"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => go(1)}
        disabled={index === visibleSlides.length - 1}
        aria-label="Próximo slide"
        className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-emerald text-white grid place-items-center disabled:opacity-20 hover:brightness-110 transition-all shadow-glow"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Off-screen PDF Exporter Stage - All slides pre-rendered at fixed 1600x900 */}
      <div 
        id="pdf-export-stage"
        style={{ 
          position: "fixed", 
          left: "-9999px", 
          top: "0px", 
          width: "1600px", 
          zIndex: -9999,
          backgroundColor: "#020617",
          pointerEvents: "none" 
        }}
      >
        {visibleSlides.map((sItem, sIdx) => (
          <div
            key={sItem.id}
            id={`pdf-slide-page-${sIdx}`}
            style={{
              width: "1600px",
              height: "900px",
              backgroundColor: "#020617",
              color: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "40px",
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img src={wiseLogo} alt="Wise" className="h-8 w-8 rounded-lg object-cover" />
                <span className="text-lg font-bold text-white">Wise <span className="text-emerald-400 font-light">Apresentação</span></span>
              </div>
              <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
                {sItem.label}
              </span>
            </div>

            {/* Content Body */}
            <div className="flex-1 flex items-center justify-center py-4 w-full">
              <div className="w-full">
                {renderSlideContent(sItem)}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-900 pt-3 text-xs font-mono text-slate-500">
              <span>Wise Licitações & Consultoria Comercial</span>
              <span>Página {sIdx + 1} de {visibleSlides.length}</span>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Export Progress Overlay Modal */}
      {isGeneratingPdf && (
        <div className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <div className="text-center space-y-2 max-w-sm">
            <h3 className="text-xl font-bold text-white font-display">Exportando Apresentação em PDF</h3>
            <p className="text-sm font-mono text-emerald-400 font-semibold">{pdfProgress}</p>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Gerando arquivo PDF horizontal (A4) preservando o tema escuro, dados, imagens e tabelas originais...
            </p>
          </div>
        </div>
      )}

      {/* Native Landscape Print & PDF Stage */}
      {typeof document !== "undefined" && createPortal(
        <div id="presentation-print-container" className="hidden print:block bg-slate-950 text-slate-100">
          {visibleSlides.map((sItem, sIdx) => (
            <div key={sItem.id} className="pdf-print-slide-page bg-slate-950 text-slate-100">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <img src={wiseLogo} alt="Wise" className="h-8 w-8 rounded-lg object-cover" />
                  <span className="text-lg font-bold text-white">Wise <span className="text-emerald-400 font-light">Apresentação</span></span>
                </div>
                <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
                  {sItem.label}
                </span>
              </div>

              {/* Content Body */}
              <div className="flex-1 flex items-center justify-center py-4 w-full">
                <div className="w-full">
                  {renderSlideContent(sItem)}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-900 pt-3 text-xs font-mono text-slate-500">
                <span>Wise Licitações & Consultoria Comercial</span>
                <span>Página {sIdx + 1} de {visibleSlides.length}</span>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
