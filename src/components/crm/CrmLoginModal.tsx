import { useState } from 'react';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  X, 
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CrmUser } from '@/types/crm';
import { CrmStorage } from '@/lib/crmStorage';

interface CrmLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CrmUser) => void;
}

export function CrmLoginModal({ isOpen, onClose, onLoginSuccess }: CrmLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const users = CrmStorage.getUsers();
  const companies = CrmStorage.getCompanies();

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const found = users.find(
      u => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (found) {
      CrmStorage.setCurrentUser(found);
      onLoginSuccess(found);
    } else {
      setErrorMsg('Usuário não encontrado. Utilize uma das contas de teste rápido abaixo.');
    }
  };

  const handleQuickLogin = (user: CrmUser) => {
    CrmStorage.setCurrentUser(user);
    onLoginSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-card-foreground">
        
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 text-primary rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Portal CRM Wise Licitações</h2>
              <p className="text-sm text-muted-foreground">Acesso restrito para Analistas e Empresários Parceiros</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Login Banner */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Acesso Rápido de Teste (1-Clique)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Analyst Buttons */}
              {users.filter(u => u.role === 'analyst').map(u => {
                const isMasterUser = Boolean(u.isMaster || u.email.toLowerCase() === 'marcelin5522@gmail.com');
                return (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u)}
                    className="flex flex-col text-left p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-primary font-medium mb-1">
                      <span>{isMasterUser ? '👑 Analista Master' : '🛡️ Analista Equipe'}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="font-semibold text-xs truncate">{u.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{u.email}</span>
                  </button>
                );
              })}

              {/* Client Buttons */}
              {users.filter(u => u.role === 'client').slice(0, 3).map(u => {
                const comp = companies.find(c => c.id === u.companyId);
                return (
                  <button
                    key={u.id}
                    onClick={() => handleQuickLogin(u)}
                    className="flex flex-col text-left p-3 rounded-lg bg-card border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-emerald-500 font-medium mb-1">
                      <span>👔 Empresário</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="font-semibold text-xs truncate">{comp?.name || u.name}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{u.email}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-card px-3 text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Ou entre com e-mail cadastrado
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="crm-email" className="text-xs font-semibold">E-mail corporativo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="crm-email"
                  type="email"
                  placeholder="seu.email@empresa.com.br"
                  className="pl-9"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="crm-password" className="text-xs font-semibold">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="crm-password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full font-semibold gap-2">
              <KeyRound className="w-4 h-4" />
              Entrar no Portal CRM
            </Button>
          </form>
        </div>

        <div className="px-6 py-4 bg-muted/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Ambiente seguro e criptografado</span>
          </div>
          <span>Wise Licitações 2026</span>
        </div>

      </div>
    </div>
  );
}
