import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LogOut, 
  UserCheck, 
  X, 
  Sparkles, 
  RotateCcw, 
  KeyRound,
  Building2,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CrmUser } from '@/types/crm';
import { CrmStorage } from '@/lib/crmStorage';
import { AnalystDashboard } from './AnalystDashboard';
import { ClientDashboard } from './ClientDashboard';
import { CrmLoginModal } from './CrmLoginModal';
import { toast } from 'sonner';

interface CrmPortalProps {
  onExit: () => void;
}

export function CrmPortal({ onExit }: CrmPortalProps) {
  const [currentUser, setCurrentUser] = useState<CrmUser | null>(() => CrmStorage.getCurrentUser());
  const [showLoginModal, setShowLoginModal] = useState<boolean>(!CrmStorage.getCurrentUser());

  useEffect(() => {
    if (!currentUser) {
      setShowLoginModal(true);
    }
  }, [currentUser]);

  const handleLogout = () => {
    CrmStorage.setCurrentUser(null);
    setCurrentUser(null);
    setShowLoginModal(true);
    toast.info('Sessão encerrada.');
  };

  const handleSwitchUser = (newUser: CrmUser) => {
    CrmStorage.setCurrentUser(newUser);
    setCurrentUser(newUser);
    setShowLoginModal(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* Top CRM Navigation Bar */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 flex items-center justify-between gap-4 shadow-sm">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold py-1 px-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Site</span>
          </button>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary text-primary-foreground rounded-xl shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight leading-none">Wise CRM</span>
                <span className="text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  B2B Multi-Tenant
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground hidden sm:block">Gestão de Licitações & Portal do Cliente</span>
            </div>
          </div>
        </div>

        {/* User Info / Controls */}
        {currentUser ? (
          <div className="flex items-center gap-3">
            
            {/* User Profile Pill */}
            <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/40 border border-border rounded-xl">
              <img 
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
              <div className="hidden md:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-foreground leading-tight">{currentUser.name}</span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                    currentUser.role === 'analyst' 
                      ? (currentUser.isMaster || currentUser.email?.toLowerCase() === 'marcelin5522@gmail.com' || currentUser.id === 'usr-analyst-master'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                          : 'bg-primary/20 text-primary border border-primary/30')
                      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {currentUser.role === 'analyst' 
                      ? (currentUser.isMaster || currentUser.email?.toLowerCase() === 'marcelin5522@gmail.com' || currentUser.id === 'usr-analyst-master' ? '👑 Analista Master' : '🛡️ Analista') 
                      : '👔 Empresário'}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{currentUser.email}</span>
              </div>
            </div>

            {/* Quick Profile Switcher */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLoginModal(true)}
              className="text-xs gap-1.5 border-border"
            >
              <RotateCcw className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Trocar Perfil</span>
            </Button>

            {/* Logout */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>

          </div>
        ) : (
          <Button size="sm" onClick={() => setShowLoginModal(true)} className="gap-2 text-xs font-semibold">
            <Lock className="w-4 h-4" />
            <span>Fazer Login</span>
          </Button>
        )}

      </header>

      {/* Main CRM Body */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
        {currentUser ? (
          currentUser.role === 'analyst' ? (
            <AnalystDashboard 
              currentUser={currentUser} 
              onSwitchUser={handleSwitchUser} 
            />
          ) : (
            <ClientDashboard 
              currentUser={currentUser} 
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold">Acesso ao Portal CRM Wise Licitações</h2>
            <p className="text-muted-foreground max-w-md text-sm">
              Por favor, realize o login com sua conta de Analista ou de Empresário para visualizar o dashboard.
            </p>
            <Button onClick={() => setShowLoginModal(true)} className="gap-2 font-semibold">
              <Lock className="w-4 h-4" />
              Abrir Login
            </Button>
          </div>
        )}
      </main>

      {/* Login Modal */}
      <CrmLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleSwitchUser}
      />

    </div>
  );
}
