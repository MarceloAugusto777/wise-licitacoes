import { useState, useEffect } from "react";
import { 
  X, 
  Settings, 
  LogOut, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Save, 
  Play, 
  Check, 
  Lock,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Info,
  Pencil,
  RotateCcw
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { SiteData, PresentationData, CaseStudy, SlideData, SlideItem, defaultPresentationData } from "@/lib/initialData";

interface AdminPanelProps {
  siteData: SiteData;
  setSiteData: (data: SiteData) => void;
  presentationData: PresentationData;
  setPresentationData: (data: PresentationData) => void;
  cases: CaseStudy[];
  setCases: (cases: CaseStudy[]) => void;
  onStartPresentation: () => void;
}

export function AdminPanel({
  siteData,
  setSiteData,
  presentationData,
  setPresentationData,
  cases,
  setCases,
  onStartPresentation,
}: AdminPanelProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("wise_admin_logged") === "true";
    }
    return false;
  });
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditorPanel, setShowEditorPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<"site" | "presentation" | "cases">("site");

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Temp editing states (deep copies for editing before saving)
  const [editSiteData, setEditSiteData] = useState<SiteData>(siteData);
  const [editPresentationData, setEditPresentationData] = useState<PresentationData>(presentationData);
  const [editCases, setEditCases] = useState<CaseStudy[]>(cases);
  const [editingSlide, setEditingSlide] = useState<SlideData | null>(null);

  const handleResetSlides = () => {
    if (window.confirm("Deseja restaurar a estrutura padrão de todos os slides da apresentação?")) {
      setEditPresentationData({
        ...editPresentationData,
        slides: JSON.parse(JSON.stringify(defaultPresentationData.slides))
      });
      toast.success("Slides padrão restaurados!");
    }
  };

  const handleSaveSlideModal = (updatedSlide: SlideData) => {
    setEditPresentationData({
      ...editPresentationData,
      slides: editPresentationData.slides.map(s => s.id === updatedSlide.id ? updatedSlide : s)
    });
    setEditingSlide(null);
    toast.success(`Slide "${updatedSlide.label}" atualizado com sucesso!`);
  };

  // Open editor and load current data
  const handleOpenEditor = () => {
    setEditSiteData(JSON.parse(JSON.stringify(siteData)));
    setEditPresentationData(JSON.parse(JSON.stringify(presentationData)));
    setEditCases(JSON.parse(JSON.stringify(cases)));
    setShowEditorPanel(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default credentials
    if (email === "admin@wiselicitacoes.com.br" && password === "wise123") {
      localStorage.setItem("wise_admin_logged", "true");
      setIsLoggedIn(true);
      setShowLoginModal(false);
      toast.success("Login administrativo realizado com sucesso!");
    } else {
      toast.error("E-mail ou senha incorretos.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("wise_admin_logged");
    setIsLoggedIn(false);
    setShowEditorPanel(false);
    toast.success("Sessão administrativa encerrada.");
  };

  const handleSaveAll = () => {
    // Save to parent state and LocalStorage
    setSiteData(editSiteData);
    setPresentationData(editPresentationData);
    setCases(editCases);

    localStorage.setItem("wise_site_data", JSON.stringify(editSiteData));
    localStorage.setItem("wise_presentation_data", JSON.stringify(editPresentationData));
    localStorage.setItem("wise_cases_data", JSON.stringify(editCases));

    toast.success("Todas as alterações foram salvas com sucesso!");
    setShowEditorPanel(false);
  };

  // Helper to add case study
  const handleAddCase = () => {
    const newCase: CaseStudy = {
      id: `case-${Date.now()}`,
      client: "Novo Cliente",
      segment: "Segmento",
      results: "Resultado Alcançado",
      description: "Descrição detalhada do caso real de sucesso...",
      visibleInSite: true,
      visibleInPresentation: true,
    };
    setEditCases([...editCases, newCase]);
  };

  const handleDeleteCase = (id: string) => {
    setEditCases(editCases.filter(c => c.id !== id));
  };

  const updateCaseField = (id: string, field: keyof CaseStudy, value: any) => {
    setEditCases(editCases.map(c => {
      if (c.id === id) {
        return { ...c, [field]: value };
      }
      return c;
    }));
  };

  // Helper to add custom slide
  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      type: "custom",
      label: "Slide Customizado",
      title: "Título do Novo Slide",
      subtitle: "Escreva um subtítulo ou explicação curta aqui.",
      customContent: "Escreva o texto principal do slide aqui...",
      visible: true
    };
    setEditPresentationData({
      ...editPresentationData,
      slides: [...editPresentationData.slides, newSlide]
    });
    toast.success("Novo slide personalizado adicionado!");
  };

  const handleMoveSlide = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editPresentationData.slides.length) return;
    
    const updatedSlides = [...editPresentationData.slides];
    const temp = updatedSlides[index];
    updatedSlides[index] = updatedSlides[newIndex];
    updatedSlides[newIndex] = temp;
    
    setEditPresentationData({
      ...editPresentationData,
      slides: updatedSlides
    });
  };

  const handleDeleteSlide = (id: string) => {
    setEditPresentationData({
      ...editPresentationData,
      slides: editPresentationData.slides.filter(s => s.id !== id)
    });
    toast.success("Slide excluído com sucesso!");
  };

  // Dynamic login shortcut (Ctrl+Shift+A) and custom event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        if (isLoggedIn) {
          handleOpenEditor();
        } else {
          setShowLoginModal(true);
        }
      }
    };
    
    const handleOpenLogin = () => {
      setShowLoginModal(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-admin-login", handleOpenLogin);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-admin-login", handleOpenLogin);
    };
  }, [isLoggedIn]);

  return (
    <>
      {/* Trigger floating button for non-logged or logged users */}
      <div className="fixed bottom-24 right-5 z-[45] flex flex-col gap-2">
        {!isLoggedIn ? (
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20 backdrop-blur-sm"
            title="Acesso Administrador (Ctrl+Shift+A)"
          >
            <Lock className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2 rounded-full bg-slate-900/90 text-slate-100 p-1.5 shadow-lift border border-slate-700/50 backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 text-emerald">Admin</span>
              <button
                onClick={handleOpenEditor}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-colors"
                title="Painel de Edição"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button
                onClick={onStartPresentation}
                className="p-1.5 rounded-full hover:bg-emerald/20 text-emerald transition-colors"
                title="Iniciar Apresentação (PowerPoint)"
              >
                <Play className="h-4 w-4" />
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                title="Sair"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="w-full max-w-md rounded-3xl bg-surface border border-hairline shadow-lift p-6 md:p-8 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-ink-soft hover:text-ink transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-navy grid place-items-center mb-4 text-white">
                <Lock className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-display text-ink">Área do Administrador</h2>
              <p className="text-sm text-ink-soft mt-1">Insira suas credenciais para gerenciar a página e a apresentação.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">E-mail</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@wiselicitacoes.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.value ?? e.target.value)}
                  required
                  className="mt-1.5 bg-background border-hairline focus-visible:ring-emerald"
                />
              </div>
              <div>
                <Label htmlFor="admin-password">Senha</Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.value ?? e.target.value)}
                  required
                  className="mt-1.5 bg-background border-hairline focus-visible:ring-emerald"
                />
              </div>

              <div className="rounded-xl bg-surface-warm border border-hairline p-3 flex gap-2.5 text-xs text-ink-soft">
                <Info className="h-4 w-4 text-emerald shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink">Credenciais padrão de teste:</span>
                  <br />
                  E-mail: <code className="bg-hairline px-1 rounded text-ink">admin@wiselicitacoes.com.br</code>
                  <br />
                  Senha: <code className="bg-hairline px-1 rounded text-ink">wise123</code>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-full mt-4"
              >
                Acessar Painel
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* EDITOR CONTROL PANEL */}
      {showEditorPanel && (
        <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-2xl bg-surface border-l border-hairline shadow-lift flex flex-col animate-float-right">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-warm">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald" />
              <h2 className="text-lg font-semibold text-ink">Editor da Wise Licitações</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full h-8"
                onClick={() => setShowEditorPanel(false)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                className="bg-emerald text-primary-foreground hover:bg-emerald/90 rounded-full h-8 flex items-center gap-1"
                onClick={handleSaveAll}
              >
                <Save className="h-3.5 w-3.5" /> Salvar Tudo
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-hairline bg-surface-warm/50 px-4">
            <button
              onClick={() => setActiveTab("site")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === "site"
                  ? "border-emerald text-emerald font-semibold"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              Site (Página de Vendas)
            </button>
            <button
              onClick={() => setActiveTab("presentation")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === "presentation"
                  ? "border-emerald text-emerald font-semibold"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              Slides (PowerPoint)
            </button>
            <button
              onClick={() => setActiveTab("cases")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === "cases"
                  ? "border-emerald text-emerald font-semibold"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              Cases de Sucesso Reais
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. SITE EDITING */}
            {activeTab === "site" && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-soft/30 border border-emerald/10 flex gap-3 text-xs text-ink-soft">
                  <Sparkles className="h-5 w-5 text-emerald shrink-0" />
                  <div>
                    <h4 className="font-semibold text-ink mb-1">Edição da Página Pública</h4>
                    <p>As alterações feitas nesta aba afetam apenas a Landing Page comercial vista pelos visitantes padrão.</p>
                  </div>
                </div>

                {/* Hero Section */}
                <div className="space-y-4 p-4 border border-hairline rounded-2xl bg-surface">
                  <div className="flex items-center justify-between border-b border-hairline pb-2 mb-2">
                    <span className="font-semibold text-ink">Seção Hero (Abertura)</span>
                    <button
                      onClick={() => setEditSiteData({
                        ...editSiteData,
                        hero: { ...editSiteData.hero, visible: !editSiteData.hero.visible }
                      })}
                      className="text-xs flex items-center gap-1"
                    >
                      {editSiteData.hero.visible ? (
                        <><Eye className="h-3.5 w-3.5 text-emerald" /> Visível</>
                      ) : (
                        <><EyeOff className="h-3.5 w-3.5 text-ink-soft" /> Ocultado</>
                      )}
                    </button>
                  </div>
                  
                  {editSiteData.hero.visible && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="hero-badge">Tag do Badge</Label>
                        <Input
                          id="hero-badge"
                          value={editSiteData.hero.badge}
                          onChange={(e) => setEditSiteData({
                            ...editSiteData,
                            hero: { ...editSiteData.hero, badge: e.value ?? e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hero-title">Título Principal (Headline)</Label>
                        <Textarea
                          id="hero-title"
                          rows={2}
                          value={editSiteData.hero.title}
                          onChange={(e) => setEditSiteData({
                            ...editSiteData,
                            hero: { ...editSiteData.hero, title: e.value ?? e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="hero-text">Descrição (Subhead)</Label>
                        <Textarea
                          id="hero-text"
                          rows={3}
                          value={editSiteData.hero.text}
                          onChange={(e) => setEditSiteData({
                            ...editSiteData,
                            hero: { ...editSiteData.hero, text: e.value ?? e.target.value }
                          })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="hero-cta">Texto Botão Consultoria</Label>
                          <Input
                            id="hero-cta"
                            value={editSiteData.hero.ctaText}
                            onChange={(e) => setEditSiteData({
                              ...editSiteData,
                              hero: { ...editSiteData.hero, ctaText: e.value ?? e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="hero-wa">Texto Botão WhatsApp</Label>
                          <Input
                            id="hero-wa"
                            value={editSiteData.hero.whatsappText}
                            onChange={(e) => setEditSiteData({
                              ...editSiteData,
                              hero: { ...editSiteData.hero, whatsappText: e.value ?? e.target.value }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Outras Seções (Visibilidade Simplificada) */}
                <div className="space-y-4 p-4 border border-hairline rounded-2xl bg-surface">
                  <span className="font-semibold text-ink block border-b border-hairline pb-2 mb-2">Visibilidade e Títulos das Demais Seções</span>
                  
                  {/* Pain */}
                  <div className="space-y-3 p-3 border border-hairline/60 rounded-xl bg-surface-warm/40">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">1. O Problema</span>
                      <button
                        onClick={() => setEditSiteData({
                          ...editSiteData,
                          pain: { ...editSiteData.pain, visible: !editSiteData.pain.visible }
                        })}
                        className="text-xs"
                      >
                        {editSiteData.pain.visible ? <span className="text-emerald font-semibold">Ativo</span> : <span className="text-ink-soft">Ocultado</span>}
                      </button>
                    </div>
                    {editSiteData.pain.visible && (
                      <Input
                        value={editSiteData.pain.title}
                        onChange={(e) => setEditSiteData({
                          ...editSiteData,
                          pain: { ...editSiteData.pain, title: e.value ?? e.target.value }
                        })}
                        placeholder="Título da seção"
                      />
                    )}
                  </div>

                  {/* Process */}
                  <div className="space-y-3 p-3 border border-hairline/60 rounded-xl bg-surface-warm/40">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">2. Como Trabalhamos (Processo)</span>
                      <button
                        onClick={() => setEditSiteData({
                          ...editSiteData,
                          process: { ...editSiteData.process, visible: !editSiteData.process.visible }
                        })}
                        className="text-xs"
                      >
                        {editSiteData.process.visible ? <span className="text-emerald font-semibold">Ativo</span> : <span className="text-ink-soft">Ocultado</span>}
                      </button>
                    </div>
                    {editSiteData.process.visible && (
                      <Input
                        value={editSiteData.process.title}
                        onChange={(e) => setEditSiteData({
                          ...editSiteData,
                          process: { ...editSiteData.process, title: e.value ?? e.target.value }
                        })}
                        placeholder="Título da seção"
                      />
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 p-3 border border-hairline/60 rounded-xl bg-surface-warm/40">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">3. Benefícios</span>
                      <button
                        onClick={() => setEditSiteData({
                          ...editSiteData,
                          benefits: { ...editSiteData.benefits, visible: !editSiteData.benefits.visible }
                        })}
                        className="text-xs"
                      >
                        {editSiteData.benefits.visible ? <span className="text-emerald font-semibold">Ativo</span> : <span className="text-ink-soft">Ocultado</span>}
                      </button>
                    </div>
                    {editSiteData.benefits.visible && (
                      <Input
                        value={editSiteData.benefits.title}
                        onChange={(e) => setEditSiteData({
                          ...editSiteData,
                          benefits: { ...editSiteData.benefits, title: e.value ?? e.target.value }
                        })}
                        placeholder="Título da seção"
                      />
                    )}
                  </div>

                  {/* Specialties */}
                  <div className="space-y-3 p-3 border border-hairline/60 rounded-xl bg-surface-warm/40">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">4. Especialidades</span>
                      <button
                        onClick={() => setEditSiteData({
                          ...editSiteData,
                          specialties: { ...editSiteData.specialties, visible: !editSiteData.specialties.visible }
                        })}
                        className="text-xs"
                      >
                        {editSiteData.specialties.visible ? <span className="text-emerald font-semibold">Ativo</span> : <span className="text-ink-soft">Ocultado</span>}
                      </button>
                    </div>
                    {editSiteData.specialties.visible && (
                      <Input
                        value={editSiteData.specialties.title}
                        onChange={(e) => setEditSiteData({
                          ...editSiteData,
                          specialties: { ...editSiteData.specialties, title: e.value ?? e.target.value }
                        })}
                        placeholder="Título da seção"
                      />
                    )}
                  </div>

                  {/* FAQ */}
                  <div className="space-y-3 p-3 border border-hairline/60 rounded-xl bg-surface-warm/40">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">5. FAQ (Perguntas Frequentes)</span>
                      <button
                        onClick={() => setEditSiteData({
                          ...editSiteData,
                          faq: { ...editSiteData.faq, visible: !editSiteData.faq.visible }
                        })}
                        className="text-xs"
                      >
                        {editSiteData.faq.visible ? <span className="text-emerald font-semibold">Ativo</span> : <span className="text-ink-soft">Ocultado</span>}
                      </button>
                    </div>
                    {editSiteData.faq.visible && (
                      <Input
                        value={editSiteData.faq.title}
                        onChange={(e) => setEditSiteData({
                          ...editSiteData,
                          faq: { ...editSiteData.faq, title: e.value ?? e.target.value }
                        })}
                        placeholder="Título da seção"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. PRESENTATION EDITING */}
            {activeTab === "presentation" && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/10 flex gap-3 text-xs text-ink-soft">
                  <Info className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-semibold text-ink mb-1">Edição da Sessão PowerPoint</h4>
                    <p>As alterações nesta aba afetam exclusivamente o modo Apresentação (Slides). O visual e os títulos mostrados para o cliente no site principal não serão afetados.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-hairline pb-2 mb-2">
                    <span className="font-semibold text-ink">Estrutura e Textos dos Slides</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleResetSlides}
                        className="h-8 text-xs flex items-center gap-1 px-3 rounded-full border-hairline hover:bg-slate-100"
                        title="Restaurar lista de slides padrão"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restaurar Padrão
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAddSlide}
                        className="bg-emerald text-primary-foreground hover:bg-emerald/90 rounded-full flex items-center gap-1 h-8 text-xs px-3"
                      >
                        <Plus className="h-3.5 w-3.5" /> Adicionar Slide Customizado
                      </Button>
                    </div>
                  </div>
                  
                  {editPresentationData.slides.map((slide, i) => (
                    <div key={slide.id} className="p-4 border border-hairline rounded-2xl bg-surface space-y-3">
                      <div className="flex items-center justify-between border-b border-hairline pb-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-soft text-emerald shrink-0">Slide {i + 1}</span>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={() => handleMoveSlide(i, 'up')}
                              disabled={i === 0}
                              className="p-1 rounded text-ink-soft hover:text-emerald disabled:opacity-20 transition-all hover:bg-slate-100"
                              title="Mover para cima"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleMoveSlide(i, 'down')}
                              disabled={i === editPresentationData.slides.length - 1}
                              className="p-1 rounded text-ink-soft hover:text-emerald disabled:opacity-20 transition-all hover:bg-slate-100"
                              title="Mover para baixo"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="font-semibold text-ink text-sm truncate max-w-[140px]">{slide.label} <span className="text-[10px] text-ink-soft font-normal">({slide.type})</span></span>
                        </div>

                        {/* Slide Action Buttons: Visibility, Full Edit Modal, Delete */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              const updatedSlides = editPresentationData.slides.map(s => 
                                s.id === slide.id ? { ...s, visible: !s.visible } : s
                              );
                              setEditPresentationData({ ...editPresentationData, slides: updatedSlides });
                            }}
                            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-hairline hover:bg-slate-100 transition-colors"
                            title={slide.visible ? "Ocultar slide da apresentação" : "Ativar slide na apresentação"}
                          >
                            {slide.visible ? (
                              <><Eye className="h-3.5 w-3.5 text-emerald" /> <span className="text-emerald font-semibold">Ativo</span></>
                            ) : (
                              <><EyeOff className="h-3.5 w-3.5 text-ink-soft" /> <span className="text-ink-soft">Ocultado</span></>
                            )}
                          </button>

                          <button
                            onClick={() => setEditingSlide(JSON.parse(JSON.stringify(slide)))}
                            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-semibold"
                            title="Abrir editor completo de blocos e elementos"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Editar
                          </button>

                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="p-1.5 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                            title="Excluir este slide"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {slide.visible && (
                        <div className="space-y-3">
                          {slide.type === "custom" && (
                            <div>
                              <Label htmlFor={`slide-${slide.id}-label`}>Label do Slide (Menu)</Label>
                              <Input
                                id={`slide-${slide.id}-label`}
                                value={slide.label}
                                onChange={(e) => {
                                  const updatedSlides = editPresentationData.slides.map(s => 
                                    s.id === slide.id ? { ...s, label: e.value ?? e.target.value } : s
                                  );
                                  setEditPresentationData({ ...editPresentationData, slides: updatedSlides });
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <Label htmlFor={`slide-${slide.id}-title`}>Título do Slide</Label>
                            <Input
                              id={`slide-${slide.id}-title`}
                              value={slide.title}
                              onChange={(e) => {
                                const updatedSlides = editPresentationData.slides.map(s => 
                                  s.id === slide.id ? { ...s, title: e.value ?? e.target.value } : s
                                );
                                setEditPresentationData({ ...editPresentationData, slides: updatedSlides });
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`slide-${slide.id}-sub`}>Subtítulo / Descrição</Label>
                            <Textarea
                              id={`slide-${slide.id}-sub`}
                              rows={2}
                              value={slide.subtitle}
                              onChange={(e) => {
                                const updatedSlides = editPresentationData.slides.map(s => 
                                  s.id === slide.id ? { ...s, subtitle: e.value ?? e.target.value } : s
                                );
                                setEditPresentationData({ ...editPresentationData, slides: updatedSlides });
                              }}
                            />
                          </div>
                          {slide.type === "custom" && (
                            <div>
                              <Label htmlFor={`slide-${slide.id}-content`}>Conteúdo do Slide (Texto Livre)</Label>
                              <Textarea
                                id={`slide-${slide.id}-content`}
                                rows={4}
                                value={slide.customContent || ""}
                                onChange={(e) => {
                                  const updatedSlides = editPresentationData.slides.map(s => 
                                    s.id === slide.id ? { ...s, customContent: e.value ?? e.target.value } : s
                                  );
                                  setEditPresentationData({ ...editPresentationData, slides: updatedSlides });
                                }}
                                placeholder="Escreva o texto principal do slide aqui..."
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 2.1 PRESENTATION FAQS EDITOR */}
                <div className="space-y-4 pt-6 border-t border-hairline">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">Perguntas Frequentes do PowerPoint (Slide FAQ)</span>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newFaq = {
                          id: `faq-${Date.now()}`,
                          q: "Nova Pergunta / Objeção",
                          a: "Resposta objetiva e clara para quebrar a objeção...",
                        };
                        setEditPresentationData({
                          ...editPresentationData,
                          faqs: [...(editPresentationData.faqs || []), newFaq]
                        });
                      }}
                      className="bg-emerald text-primary-foreground hover:bg-emerald/90 rounded-full h-8 text-xs flex items-center gap-1.5 px-3"
                    >
                      <Plus className="h-3.5 w-3.5" /> Adicionar Pergunta
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(editPresentationData.faqs || []).map((faq, idx) => (
                      <div key={faq.id} className="p-3 border border-hairline rounded-xl bg-surface space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald">Pergunta #{idx + 1}</span>
                          <button
                            onClick={() => {
                              setEditPresentationData({
                                ...editPresentationData,
                                faqs: editPresentationData.faqs.filter(f => f.id !== faq.id)
                              });
                            }}
                            className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                            title="Excluir Pergunta"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div>
                          <Label>Pergunta / Objeção</Label>
                          <Input
                            value={faq.q}
                            onChange={(e) => {
                              const updated = editPresentationData.faqs.map(f =>
                                f.id === faq.id ? { ...f, q: e.value ?? e.target.value } : f
                              );
                              setEditPresentationData({ ...editPresentationData, faqs: updated });
                            }}
                          />
                        </div>
                        <div>
                          <Label>Resposta</Label>
                          <Textarea
                            rows={2}
                            value={faq.a}
                            onChange={(e) => {
                              const updated = editPresentationData.faqs.map(f =>
                                f.id === faq.id ? { ...f, a: e.value ?? e.target.value } : f
                              );
                              setEditPresentationData({ ...editPresentationData, faqs: updated });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2.2 PRESENTATION PRICING EDITOR */}
                <div className="space-y-4 pt-6 border-t border-hairline">
                  <span className="font-semibold text-ink block">Proposta Comercial (Slide Proposta)</span>
                  
                  <div className="space-y-3">
                    <div>
                      <Label>Título do Slide Comercial</Label>
                      <Input
                        value={editPresentationData.pricing?.title || ""}
                        onChange={(e) => setEditPresentationData({
                          ...editPresentationData,
                          pricing: { ...(editPresentationData.pricing || { title: "", subtitle: "", models: [] }), title: e.value ?? e.target.value }
                        })}
                      />
                    </div>
                    
                    <div>
                      <Label>Subtítulo do Slide Comercial</Label>
                      <Textarea
                        rows={2}
                        value={editPresentationData.pricing?.subtitle || ""}
                        onChange={(e) => setEditPresentationData({
                          ...editPresentationData,
                          pricing: { ...(editPresentationData.pricing || { title: "", subtitle: "", models: [] }), subtitle: e.value ?? e.target.value }
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald">Modelos de Cobrança (Tabela de Parceria)</span>
                      <Button
                        size="sm"
                        onClick={() => {
                          const newModel = {
                            id: `price-${Date.now()}`,
                            name: "Novo Modelo Comercial",
                            cost: "Sob Consulta",
                            details: "Item 1, Item 2, Item 3",
                            visible: true,
                          };
                          setEditPresentationData({
                            ...editPresentationData,
                            pricing: {
                              ...(editPresentationData.pricing || { title: "", subtitle: "", models: [] }),
                              models: [...(editPresentationData.pricing?.models || []), newModel]
                            }
                          });
                        }}
                        className="bg-emerald text-primary-foreground hover:bg-emerald/90 rounded-full h-7 text-xs flex items-center gap-1 px-2.5"
                      >
                        <Plus className="h-3 w-3" /> Adicionar Modelo
                      </Button>
                    </div>

                    {(editPresentationData.pricing?.models || []).map((model, idx) => (
                      <div key={model.id} className="p-3 border border-hairline rounded-xl bg-surface space-y-2 relative">
                        <div className="flex items-center justify-between border-b border-hairline/60 pb-1.5 mb-1.5">
                          <span className="text-xs font-semibold text-ink-soft">Modelo #{idx + 1}: {model.name}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const updated = editPresentationData.pricing.models.map(m =>
                                  m.id === model.id ? { ...m, visible: m.visible === false ? true : false } : m
                                );
                                setEditPresentationData({
                                  ...editPresentationData,
                                  pricing: { ...editPresentationData.pricing, models: updated }
                                });
                              }}
                              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-hairline hover:bg-slate-100 transition-colors"
                              title={model.visible !== false ? "Ocultar modelo" : "Ativar modelo"}
                            >
                              {model.visible !== false ? (
                                <><Eye className="h-3 w-3 text-emerald" /> <span className="text-emerald font-semibold">Ativo</span></>
                              ) : (
                                <><EyeOff className="h-3 w-3 text-ink-soft" /> <span className="text-ink-soft">Ocultado</span></>
                              )}
                            </button>

                            <button
                              onClick={() => {
                                const updated = editPresentationData.pricing.models.filter(m => m.id !== model.id);
                                setEditPresentationData({
                                  ...editPresentationData,
                                  pricing: { ...editPresentationData.pricing, models: updated }
                                });
                              }}
                              className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                              title="Excluir este modelo"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Nome do Modelo</Label>
                            <Input
                              value={model.name}
                              onChange={(e) => {
                                const updated = editPresentationData.pricing.models.map(m =>
                                  m.id === model.id ? { ...m, name: e.value ?? e.target.value } : m
                                );
                                setEditPresentationData({
                                  ...editPresentationData,
                                  pricing: { ...editPresentationData.pricing, models: updated }
                                });
                              }}
                            />
                          </div>
                          <div>
                            <Label>Custo / Taxa</Label>
                            <Input
                              value={model.cost}
                              onChange={(e) => {
                                const updated = editPresentationData.pricing.models.map(m =>
                                  m.id === model.id ? { ...m, cost: e.value ?? e.target.value } : m
                                );
                                setEditPresentationData({
                                  ...editPresentationData,
                                  pricing: { ...editPresentationData.pricing, models: updated }
                                });
                              }}
                              className="border-emerald/30 text-emerald font-semibold"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Detalhes / Itens Inclusos (Separar por vírgulas)</Label>
                          <Textarea
                            rows={2}
                            value={model.details}
                            onChange={(e) => {
                              const updated = editPresentationData.pricing.models.map(m =>
                                  m.id === model.id ? { ...m, details: e.value ?? e.target.value } : m
                              );
                              setEditPresentationData({
                                ...editPresentationData,
                                pricing: { ...editPresentationData.pricing, models: updated }
                              });
                            }}
                            placeholder="Ex: Auditoria completa, Cadastros nos portais, SICAF"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 3. CASE STUDIES EDITING */}
            {activeTab === "cases" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-ink">Gerenciar Cases de Sucesso</h3>
                    <p className="text-xs text-ink-soft">Estes cases serão exibidos no Slide 5 da apresentação e também no site se configurados.</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddCase}
                    className="bg-emerald text-primary-foreground hover:bg-emerald/90 rounded-full flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" /> Adicionar Case
                  </Button>
                </div>

                <div className="space-y-4">
                  {editCases.map((cs, idx) => (
                    <div key={cs.id} className="p-4 border border-hairline rounded-2xl bg-surface space-y-4">
                      <div className="flex items-center justify-between border-b border-hairline pb-2">
                        <span className="font-semibold text-ink text-sm">Case #{idx + 1}: {cs.client}</span>
                        <div className="flex items-center gap-3">
                          {/* Visibility toggles */}
                          <label className="flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cs.visibleInPresentation}
                              onChange={(e) => updateCaseField(cs.id, "visibleInPresentation", e.target.checked)}
                              className="rounded border-hairline text-emerald focus:ring-emerald"
                            />
                            <span>No PowerPoint</span>
                          </label>
                          <label className="flex items-center gap-1 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cs.visibleInSite}
                              onChange={(e) => updateCaseField(cs.id, "visibleInSite", e.target.checked)}
                              className="rounded border-hairline text-emerald focus:ring-emerald"
                            />
                            <span>No Site</span>
                          </label>
                          <button
                            onClick={() => handleDeleteCase(cs.id)}
                            className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                            title="Excluir Case"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Nome do Cliente/Empresa</Label>
                          <Input
                            value={cs.client}
                            onChange={(e) => updateCaseField(cs.id, "client", e.value ?? e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Segmento/Mercado</Label>
                          <Input
                            value={cs.segment}
                            onChange={(e) => updateCaseField(cs.id, "segment", e.value ?? e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Resultado em Destaque (Faturamento / Meta)</Label>
                        <Input
                          value={cs.results}
                          onChange={(e) => updateCaseField(cs.id, "results", e.value ?? e.target.value)}
                          className="border-emerald/30 focus-visible:ring-emerald text-emerald font-semibold"
                        />
                      </div>
                      <div>
                        <Label className="block mb-1.5">Imagem do Case (Upload ou URL)</Label>
                        <div className="space-y-2">
                          <div className="flex gap-2 items-center">
                            <Input
                              type="file"
                              accept="image/*"
                              className="bg-background border-hairline h-9 text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground cursor-pointer"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    updateCaseField(cs.id, "imageUrl", reader.result as string);
                                    toast.success(`Imagem "${file.name}" carregada!`);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            {cs.imageUrl && (
                              <button
                                onClick={() => updateCaseField(cs.id, "imageUrl", "")}
                                className="text-xs text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded px-2.5 h-9 transition-colors shrink-0"
                              >
                                Limpar
                              </button>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-ink-soft shrink-0">Ou URL:</span>
                            <Input
                              value={cs.imageUrl || ""}
                              onChange={(e) => updateCaseField(cs.id, "imageUrl", e.value ?? e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="h-7 text-xs bg-background"
                            />
                          </div>

                          {cs.imageUrl && (
                            <div className="mt-2 relative inline-block">
                              <img
                                src={cs.imageUrl}
                                alt="Preview"
                                className="h-16 w-24 object-cover rounded-lg border border-hairline shadow-sm"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>Descrição Completa do Case</Label>
                        <Textarea
                          rows={3}
                          value={cs.description}
                          onChange={(e) => updateCaseField(cs.id, "description", e.value ?? e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {editCases.length === 0 && (
                    <div className="text-center py-10 border border-dashed border-hairline rounded-2xl bg-surface-warm/40">
                      <p className="text-sm text-ink-soft">Nenhum case cadastrado. Clique no botão acima para adicionar.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-hairline bg-surface-warm flex items-center justify-between">
            <span className="text-xs text-ink-soft">Dica: use <kbd className="bg-hairline px-1 rounded text-ink">Ctrl+Shift+A</kbd> para abrir/fechar rapidamente.</span>
            <Button
              className="bg-emerald text-primary-foreground hover:bg-emerald/90 rounded-full flex items-center gap-1.5 shadow-lift"
              onClick={handleSaveAll}
            >
              <Check className="h-4 w-4" /> Salvar Tudo e Fechar
            </Button>
          </div>
        </div>
      )}

      {/* Slide Element-by-Element Full Editing Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-hairline rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-surface-warm">
              <div className="flex items-center gap-2">
                <Pencil className="h-5 w-5 text-emerald" />
                <h3 className="font-bold text-ink text-base">Edição Completa do Slide</h3>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-soft text-emerald font-semibold">
                  {editingSlide.label} ({editingSlide.type})
                </span>
              </div>
              <button
                onClick={() => setEditingSlide(null)}
                className="p-1 rounded-full text-ink-soft hover:text-ink hover:bg-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Label no Menu (Breadcrumb)</Label>
                  <Input
                    value={editingSlide.label || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, label: e.value ?? e.target.value })}
                  />
                </div>
                <div>
                  <Label>Badge / Categoria (opcional)</Label>
                  <Input
                    value={editingSlide.badge || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.value ?? e.target.value })}
                    placeholder="Ex: Metodologia, Oportunidade"
                  />
                </div>
              </div>

              <div>
                <Label>Título Principal do Slide</Label>
                <Input
                  value={editingSlide.title || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.value ?? e.target.value })}
                />
              </div>

              <div>
                <Label>Subtítulo / Descrição do Slide</Label>
                <Textarea
                  rows={3}
                  value={editingSlide.subtitle || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.value ?? e.target.value })}
                />
              </div>

              {/* Custom Slide Content */}
              {editingSlide.type === "custom" && (
                <div>
                  <Label>Texto Livre do Slide Customizado</Label>
                  <Textarea
                    rows={5}
                    value={editingSlide.customContent || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, customContent: e.value ?? e.target.value })}
                    placeholder="Escreva qualquer conteúdo para este slide..."
                  />
                </div>
              )}

              {/* Slide-specific elements editor */}
              {editingSlide.items && editingSlide.items.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-hairline">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold text-ink text-sm">Blocos e Elementos Internos ({editingSlide.items.length})</Label>
                    <Button
                      size="sm"
                      onClick={() => {
                        const newItem: SlideItem = {
                          id: `item-${Date.now()}`,
                          title: "Novo Bloco",
                          text: "Descrição do novo bloco...",
                          value: "Novo Dado",
                          label: "Novo Rótulo",
                          desc: "Descrição...",
                          time: "Passo X",
                        };
                        setEditingSlide({
                          ...editingSlide,
                          items: [...(editingSlide.items || []), newItem]
                        });
                      }}
                      className="h-7 text-xs bg-emerald hover:bg-emerald/90 text-white rounded-full flex items-center gap-1 px-3"
                    >
                      <Plus className="h-3 w-3" /> Adicionar Bloco
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {editingSlide.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="p-3.5 border border-hairline rounded-xl bg-background space-y-2 relative">
                        <div className="flex items-center justify-between border-b border-hairline/60 pb-1.5 mb-1.5">
                          <span className="text-[11px] font-semibold text-emerald">Bloco #{itemIdx + 1}</span>
                          <button
                            onClick={() => {
                              const filtered = editingSlide.items?.filter((_, idx) => idx !== itemIdx);
                              setEditingSlide({ ...editingSlide, items: filtered });
                            }}
                            className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                            title="Remover este bloco"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {item.value !== undefined && (
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-[10px]">Valor / Dado Destacado</Label>
                              <Input
                                className="h-8 text-xs font-mono text-emerald font-semibold"
                                value={item.value || ""}
                                onChange={(e) => {
                                  const updated = [...(editingSlide.items || [])];
                                  updated[itemIdx] = { ...updated[itemIdx], value: e.value ?? e.target.value };
                                  setEditingSlide({ ...editingSlide, items: updated });
                                }}
                              />
                            </div>
                            <div>
                              <Label className="text-[10px]">Rótulo / Legenda</Label>
                              <Input
                                className="h-8 text-xs"
                                value={item.label || ""}
                                onChange={(e) => {
                                  const updated = [...(editingSlide.items || [])];
                                  updated[itemIdx] = { ...updated[itemIdx], label: e.value ?? e.target.value };
                                  setEditingSlide({ ...editingSlide, items: updated });
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {item.time !== undefined && (
                          <div>
                            <Label className="text-[10px]">Etapa / Prazo (Ex: Dias 1 a 3)</Label>
                            <Input
                              className="h-8 text-xs font-mono text-emerald font-semibold"
                              value={item.time || ""}
                              onChange={(e) => {
                                const updated = [...(editingSlide.items || [])];
                                updated[itemIdx] = { ...updated[itemIdx], time: e.value ?? e.target.value };
                                setEditingSlide({ ...editingSlide, items: updated });
                              }}
                            />
                          </div>
                        )}

                        {item.title !== undefined && (
                          <div>
                            <Label className="text-[10px]">Título do Bloco</Label>
                            <Input
                              className="h-8 text-xs"
                              value={item.title || ""}
                              onChange={(e) => {
                                const updated = [...(editingSlide.items || [])];
                                updated[itemIdx] = { ...updated[itemIdx], title: e.value ?? e.target.value };
                                setEditingSlide({ ...editingSlide, items: updated });
                              }}
                            />
                          </div>
                        )}

                        {(item.text !== undefined || item.desc !== undefined) && (
                          <div>
                            <Label className="text-[10px]">Descrição / Detalhes do Bloco</Label>
                            <Textarea
                              rows={2}
                              className="text-xs"
                              value={item.text ?? item.desc ?? ""}
                              onChange={(e) => {
                                const updated = [...(editingSlide.items || [])];
                                const val = e.value ?? e.target.value;
                                updated[itemIdx] = {
                                  ...updated[itemIdx],
                                  text: item.text !== undefined ? val : undefined,
                                  desc: item.desc !== undefined ? val : undefined,
                                };
                                setEditingSlide({ ...editingSlide, items: updated });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-hairline bg-surface-warm flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSlide(null)}
                className="rounded-full text-xs"
              >
                Cancelar
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  if (editingSlide) {
                    handleSaveSlideModal(editingSlide);
                  }
                }}
                className="bg-emerald text-white hover:bg-emerald/90 rounded-full flex items-center gap-1.5 text-xs px-4 shadow-lift"
              >
                <Check className="h-4 w-4" /> Aplicar Alterações no Slide
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
