import { useState } from 'react';
import { 
  Building2, 
  Award, 
  TrendingUp, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  AlertTriangle, 
  Users, 
  ArrowRight,
  Sparkles,
  FileText,
  HelpCircle,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  CrmUser, 
  CrmCompany, 
  CrmTender, 
  CrmDocument, 
  CrmNotification, 
  TenderStatus 
} from '@/types/crm';
import { CrmStorage } from '@/lib/crmStorage';
import { toast } from 'sonner';

interface ClientDashboardProps {
  currentUser: CrmUser;
}

export function ClientDashboard({ currentUser }: ClientDashboardProps) {
  const [tenders, setTenders] = useState<CrmTender[]>(() => CrmStorage.getTenders());
  const [documents, setDocuments] = useState<CrmDocument[]>(() => CrmStorage.getDocuments());
  const [notifications, setNotifications] = useState<CrmNotification[]>(() => CrmStorage.getNotifications());
  const [companies] = useState<CrmCompany[]>(() => CrmStorage.getCompanies());
  const [allUsers] = useState<CrmUser[]>(() => CrmStorage.getUsers());

  const [activeTab, setActiveTab] = useState<'funnel' | 'notifications' | 'documents' | 'team'>('funnel');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const myCompanyId = currentUser.companyId || 'comp-1';
  const myCompany = companies.find(c => c.id === myCompanyId) || {
    id: myCompanyId,
    name: 'Sua Empresa',
    cnpj: '00.000.000/0001-00',
    segment: 'Geral',
    responsibleName: currentUser.name,
    phone: '',
    email: currentUser.email
  };

  // Filtered lists for this client company
  const myTenders = tenders.filter(t => t.companyId === myCompanyId);
  const myDocuments = documents.filter(d => d.companyId === myCompanyId);
  const myNotifications = notifications.filter(n => n.companyId === myCompanyId || n.companyId === 'all');
  const myTeamUsers = allUsers.filter(u => u.companyId === myCompanyId);

  const unreadNotifsCount = myNotifications.filter(n => !n.read).length;

  // KPIs
  const wonTenders = myTenders.filter(t => t.status === 'vencida');
  const totalWonAmount = wonTenders.reduce((acc, curr) => acc + (curr.valorFinal || curr.valorEstimado), 0);
  const activeTenders = myTenders.filter(t => t.status !== 'vencida' && t.status !== 'perdida' && t.status !== 'cancelada');
  const winRate = myTenders.length > 0 ? Math.round((wonTenders.length / myTenders.length) * 100) : 0;

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    const updated = notifications.map(n => {
      if (n.companyId === myCompanyId || n.companyId === 'all') {
        return { ...n, read: true };
      }
      return n;
    });
    setNotifications(updated);
    CrmStorage.saveNotifications(updated);
    toast.success('Todas as notificações foram marcadas como lidas.');
  };

  // Filtered tenders for list
  const filteredMyTenders = statusFilter === 'all'
    ? myTenders
    : myTenders.filter(t => t.status === statusFilter);

  // Status Badge Helper
  const getStatusBadge = (status: TenderStatus) => {
    switch (status) {
      case 'vencida':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">🏆 Vencida / Homologada</span>;
      case 'em_disputa':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">⚡ Em Disputa de Lances</span>;
      case 'proposta_cadastrada':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">📋 Proposta Cadastrada</span>;
      case 'habilitação':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">📁 Em Habilitação</span>;
      case 'analise':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">🔎 Em Análise de Viabilidade</span>;
      case 'perdida':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-destructive/10 text-destructive border border-destructive/20">❌ Não Vencida</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-muted text-muted-foreground">📌 Captada / Em Triagem</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Client Welcome Header */}
      <div className="bg-gradient-to-r from-card via-card to-primary/5 border border-border p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
              Portal do Empresário
            </span>
            <span className="text-xs text-muted-foreground">• {myCompany.segment}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{myCompany.name}</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe o desempenho das suas licitações públicas operadas pela <strong>Wise Licitações</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 text-xs relative"
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="w-4 h-4 text-primary" />
            <span>Notificações</span>
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {unreadNotifsCount}
              </span>
            )}
          </Button>

          <Button
            className="gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => window.open(`https://wa.me/5500000000000?text=Ol%C3%A1%2C%20sou%20da%20empresa%20${encodeURIComponent(myCompany.name)}%20e%20gostaria%20de%20falar%20com%20o%20analista.`, '_blank')}
          >
            <MessageCircle className="w-4 h-4" />
            Falar com o Analista
          </Button>
        </div>
      </div>

      {/* KPI Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>VALOR EM CONTRATOS GANHOS</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalWonAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="text-emerald-500 font-bold">+{wonTenders.length} editais</span> homologados
          </p>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>LICITAÇÕES EM ANDAMENTO</span>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold">{activeTenders.length}</div>
          <p className="text-xs text-muted-foreground">Propostas ativas e em disputa</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>TAXA DE CONVERSÃO</span>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{winRate}%</div>
          <p className="text-xs text-muted-foreground">Índice de vitória nos certames</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>CERTIDÕES DE REGULARIDADE</span>
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold">
            {myDocuments.filter(d => d.status === 'valido').length} / {myDocuments.length}
          </div>
          <p className="text-xs text-muted-foreground">CNDs com validade em dia</p>
        </div>

      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('funnel')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'funnel'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Funil de Licitações ({myTenders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap relative ${
            activeTab === 'notifications'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Feed de Notificações</span>
          {unreadNotifsCount > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.2 rounded-full">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'documents'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Central de Certidões ({myDocuments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'team'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Equipe da Empresa ({myTeamUsers.length})</span>
        </button>
      </div>

      {/* TAB CONTENT 1: FUNNEL / TENDERS */}
      {activeTab === 'funnel' && (
        <div className="space-y-4">
          
          {/* Status Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground font-semibold">Filtrar:</span>
            {[
              { id: 'all', label: 'Todas' },
              { id: 'em_disputa', label: '⚡ Em Disputa' },
              { id: 'proposta_cadastrada', label: '📋 Cadastradas' },
              { id: 'habilitação', label: '📁 Habilitação' },
              { id: 'vencida', label: '🏆 Vencidas' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1 rounded-full border transition-all ${
                  statusFilter === f.id
                    ? 'bg-primary/10 border-primary text-primary font-semibold'
                    : 'bg-card border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Tenders Card List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredMyTenders.length === 0 ? (
              <div className="bg-card border border-border p-8 rounded-xl text-center text-muted-foreground text-sm">
                Nenhuma licitação encontrada neste status.
              </div>
            ) : (
              filteredMyTenders.map(t => (
                <div key={t.id} className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4 hover:border-primary/40 transition-all">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{t.modalidade}</span>
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {t.portal}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground mt-0.5">{t.orgao}</h3>
                      <span className="text-xs font-mono text-muted-foreground">{t.editalNumero}</span>
                    </div>

                    <div className="self-start sm:self-auto">
                      {getStatusBadge(t.status)}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{t.objeto}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-muted/30 p-3 rounded-xl border border-border/50 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Valor Estimado</span>
                      <span className="font-bold text-foreground text-sm">
                        {t.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Data da Sessão</span>
                      <span className="font-bold text-foreground text-sm flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(t.dataSessao).toLocaleDateString('pt-BR')} às {new Date(t.dataSessao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Resultado / Final</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                        {t.valorFinal ? t.valorFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Em andamento'}
                      </span>
                    </div>
                  </div>

                  {/* History Timeline */}
                  {t.history && t.history.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        Última Atualização Operacional da Wise:
                      </span>
                      <div className="text-xs bg-card p-3 rounded-lg border border-border/80 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-medium text-foreground">{t.history[t.history.length - 1].description}</span>
                          <span className="block text-[10px] text-muted-foreground">
                            {t.history[t.history.length - 1].timestamp} por {t.history[t.history.length - 1].authorName}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: NOTIFICATIONS FEED (Requested Feature #2) */}
      {activeTab === 'notifications' && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <span>Feed de Notificações em Tempo Real</span>
              </h2>
              <p className="text-xs text-muted-foreground">Histórico de todas as movimentações e atualizações nos seus editais</p>
            </div>

            {unreadNotifsCount > 0 && (
              <Button size="sm" variant="outline" onClick={handleMarkAllRead} className="text-xs">
                Marcar todas como lidas
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {myNotifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Nenhuma notificação registrada até o momento.
              </div>
            ) : (
              myNotifications.map(notif => (
                <div 
                  key={notif.id}
                  className={`p-4 rounded-xl border transition-all ${
                    !notif.read 
                      ? 'bg-primary/5 border-primary/30 shadow-sm' 
                      : 'bg-card border-border/60 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{notif.title}</span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-muted-foreground block pt-1">{notif.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CERTIDÕES / DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Cofre de Certidões & Documentos de Habilitação</span>
            </h2>
            <p className="text-xs text-muted-foreground">Acompanhe a validade e status das certidões da {myCompany.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {myDocuments.map(doc => (
              <div key={doc.id} className="p-4 border border-border rounded-xl bg-card space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-foreground">{doc.nome}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                    doc.status === 'vencido' ? 'bg-destructive text-destructive-foreground' :
                    doc.status === 'atencao' ? 'bg-amber-500 text-white' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span>Tipo: <strong>{doc.tipo}</strong></span>
                    <span>Validade: <strong className="text-foreground">{new Date(doc.dataVencimento).toLocaleDateString('pt-BR')}</strong></span>
                  </div>
                </div>

                {doc.observacao && (
                  <p className="text-xs bg-muted p-2 rounded text-muted-foreground italic">
                    {doc.observacao}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: MULTI-USER TEAM (Requested Feature #3) */}
      {activeTab === 'team' && (
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span>Usuários com Acesso ao Portal ({myCompany.name})</span>
            </h2>
            <p className="text-xs text-muted-foreground">Membros da diretoria e gerência autorizados a visualizar as métricas</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {myTeamUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-3 border border-border rounded-xl bg-muted/20">
                <img 
                  src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                  alt={u.name}
                  className="w-10 h-10 rounded-full object-cover border border-border"
                />
                <div>
                  <h4 className="font-bold text-sm text-foreground">{u.name}</h4>
                  <span className="text-xs text-muted-foreground">{u.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
