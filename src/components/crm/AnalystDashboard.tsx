import { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Filter, 
  TrendingUp, 
  Award, 
  FileText, 
  AlertTriangle, 
  KeyRound, 
  Copy, 
  Check, 
  Edit, 
  Trash2, 
  Send, 
  Clock, 
  Calendar, 
  DollarSign, 
  ExternalLink,
  ShieldCheck, 
  UserCheck, 
  RotateCcw, 
  Sparkles, 
  ChevronDown, 
  X,
  UserPlus,
  Users,
  Shield,
  Briefcase,
  Lock,
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  CrmCompany, 
  CrmTender, 
  CrmDocument, 
  CrmUser, 
  TenderStatus,
  DocumentStatus 
} from '@/types/crm';
import { CrmStorage } from '@/lib/crmStorage';
import { toast } from 'sonner';

interface AnalystDashboardProps {
  currentUser: CrmUser;
  onSwitchUser: (user: CrmUser) => void;
}

export function AnalystDashboard({ currentUser, onSwitchUser }: AnalystDashboardProps) {
  // Verifica se o analista é o Master
  const isMaster = Boolean(
    currentUser.isMaster || 
    currentUser.email?.toLowerCase() === 'marcelin5522@gmail.com' ||
    currentUser.id === 'usr-analyst-master'
  );

  const [companies, setCompanies] = useState<CrmCompany[]>(() => CrmStorage.getCompanies());
  const [tenders, setTenders] = useState<CrmTender[]>(() => CrmStorage.getTenders());
  const [documents, setDocuments] = useState<CrmDocument[]>(() => CrmStorage.getDocuments());
  const [users, setUsers] = useState<CrmUser[]>(() => CrmStorage.getUsers());

  // Permissões de empresas para o analista conectado
  const allowedCompanies = isMaster 
    ? companies 
    : companies.filter(c => {
        if (!currentUser.allowedCompanyIds || currentUser.allowedCompanyIds.includes('all')) return true;
        return currentUser.allowedCompanyIds.includes(c.id);
      });

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');

  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [showNewTenderModal, setShowNewTenderModal] = useState(false);
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [showNewAnalystModal, setShowNewAnalystModal] = useState(false);
  const [showTeamPermissionsModal, setShowTeamPermissionsModal] = useState(false);
  const [editingPermissionsUser, setEditingPermissionsUser] = useState<CrmUser | null>(null);

  // Modal e Formulário de Edição de Acesso do Empresário (Analista Master)
  const [showEditClientUserModal, setShowEditClientUserModal] = useState(false);
  const [editingClientUser, setEditingClientUser] = useState<CrmUser | null>(null);
  const [editClientForm, setEditClientForm] = useState({
    name: '',
    email: '',
    passwordHint: '',
    phone: ''
  });

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Formulário Nova Licitação
  const [newTender, setNewTender] = useState<Partial<CrmTender>>({
    companyId: allowedCompanies[0]?.id || companies[0]?.id || 'comp-crm-positivo',
    orgao: '',
    editalNumero: '',
    objeto: '',
    valorEstimado: 100000,
    dataSessao: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
    status: 'captada',
    portal: 'Comprasnet',
    modalidade: 'Pregão Eletrônico',
    observacoes: ''
  });

  // Formulário Nova Empresa
  const [newCompany, setNewCompany] = useState({
    name: '',
    cnpj: '',
    segment: '',
    responsibleName: '',
    phone: '',
    email: '',
    passwordHint: 'wise2026'
  });

  // Formulário Novo Analista
  const [newAnalyst, setNewAnalyst] = useState({
    name: '',
    email: '',
    phone: '',
    passwordHint: 'wise2026',
    isMaster: false,
    allCompanies: true,
    selectedCompanyIds: [] as string[]
  });

  // Listas filtradas com base nas empresas que o analista tem permissão de ver
  const filteredTenders = tenders.filter(t => {
    const hasAccess = isMaster || allowedCompanies.some(ac => ac.id === t.companyId);
    if (!hasAccess) return false;
    if (selectedCompanyId === 'all') return true;
    return t.companyId === selectedCompanyId;
  });

  const filteredDocuments = documents.filter(d => {
    const hasAccess = isMaster || allowedCompanies.some(ac => ac.id === d.companyId);
    if (!hasAccess) return false;
    if (selectedCompanyId === 'all') return true;
    return d.companyId === selectedCompanyId;
  });

  // Métricas
  const activeTenders = filteredTenders.filter(t => t.status !== 'vencida' && t.status !== 'perdida' && t.status !== 'cancelada');
  const wonTenders = filteredTenders.filter(t => t.status === 'vencida');
  const totalWonAmount = wonTenders.reduce((acc, curr) => acc + (curr.valorFinal || curr.valorEstimado), 0);
  const totalVolumeManaged = filteredTenders.reduce((acc, curr) => acc + curr.valorEstimado, 0);
  const warningDocs = filteredDocuments.filter(d => d.status === 'atencao' || d.status === 'vencido');

  // Copiar Credenciais
  const handleCopyCredentials = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    toast.success('Acesso copiado com sucesso!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Abrir Modal de Edição de Acesso do Empresário
  const handleOpenEditClientUser = (u: CrmUser) => {
    setEditingClientUser(u);
    setEditClientForm({
      name: u.name,
      email: u.email,
      passwordHint: u.passwordHint || 'wise2026',
      phone: u.phone || ''
    });
    setShowEditClientUserModal(true);
  };

  // Salvar Edição de Acesso do Empresário (E-mail, Senha, Nome, Telefone)
  const handleSaveClientUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClientUser) return;
    
    if (!editClientForm.name.trim()) {
      toast.error('O nome do empresário é obrigatório.');
      return;
    }
    if (!editClientForm.email.trim() || !editClientForm.email.includes('@')) {
      toast.error('Informe um e-mail válido para o empresário.');
      return;
    }

    const emailTrimmed = editClientForm.email.toLowerCase().trim();

    // Valida duplicidade de e-mail com outro usuário
    const existingWithEmail = users.find(
      u => u.id !== editingClientUser.id && u.email.toLowerCase().trim() === emailTrimmed
    );
    if (existingWithEmail) {
      toast.error('Este e-mail já está sendo utilizado por outro usuário no sistema!');
      return;
    }

    const updatedUser = CrmStorage.updateUser(editingClientUser.id, {
      name: editClientForm.name.trim(),
      email: emailTrimmed,
      passwordHint: editClientForm.passwordHint.trim() || 'wise2026',
      phone: editClientForm.phone.trim()
    });

    if (editingClientUser.companyId) {
      CrmStorage.updateCompany(editingClientUser.companyId, {
        email: emailTrimmed,
        responsibleName: editClientForm.name.trim(),
        phone: editClientForm.phone.trim()
      });

      // Registra notificação para o empresário
      CrmStorage.addNotification({
        companyId: editingClientUser.companyId,
        title: '🔑 Credenciais de Acesso Atualizadas',
        message: `O Analista Master atualizou o e-mail de acesso para: ${emailTrimmed}.`,
        type: 'info'
      });
    }

    setUsers(CrmStorage.getUsers());
    setCompanies(CrmStorage.getCompanies());
    setShowEditClientUserModal(false);
    setEditingClientUser(null);
    toast.success(`E-mail de acesso e credenciais de ${editClientForm.name} atualizados com sucesso!`);
  };

  // Cadastrar Nova Empresa (ex: CRM POSITIVO)
  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.cnpj || !newCompany.email) {
      toast.error('Preencha os campos obrigatórios da empresa!');
      return;
    }

    const companyId = 'comp-' + Date.now();
    const createdComp: CrmCompany = {
      id: companyId,
      name: newCompany.name.trim(),
      cnpj: newCompany.cnpj.trim(),
      segment: newCompany.segment.trim() || 'Geral / Tecnologia',
      responsibleName: newCompany.responsibleName.trim() || 'Empresário Responsável',
      phone: newCompany.phone.trim(),
      email: newCompany.email.trim()
    };

    // Cria automaticamente o usuário do empresário
    const clientUser: CrmUser = {
      id: 'usr-client-' + Date.now(),
      name: (newCompany.responsibleName || newCompany.name) + ` (${newCompany.name})`,
      email: newCompany.email.trim(),
      role: 'client',
      companyId: companyId,
      passwordHint: newCompany.passwordHint || 'wise2026',
      phone: newCompany.phone.trim(),
      createdAt: new Date().toISOString()
    };

    CrmStorage.addCompany(createdComp);
    CrmStorage.addUser(clientUser);

    // Notificação global
    CrmStorage.addNotification({
      companyId: 'all',
      title: '🏢 Nova Empresa Parceira Integrada',
      message: `A empresa ${createdComp.name} (CNPJ: ${createdComp.cnpj}) foi cadastrada na carteira da Wise Licitações.`,
      type: 'info'
    });

    // Notificação de boas-vindas no painel da empresa
    CrmStorage.addNotification({
      companyId: companyId,
      title: '👋 Boas-vindas ao Portal Wise CRM!',
      message: `O painel da sua empresa ${createdComp.name} está conectado com a equipe de analistas. Seus editais e certidões serão acompanhados por aqui.`,
      type: 'success'
    });

    setCompanies(CrmStorage.getCompanies());
    setUsers(CrmStorage.getUsers());
    setShowNewCompanyModal(false);
    setNewCompany({
      name: '',
      cnpj: '',
      segment: '',
      responsibleName: '',
      phone: '',
      email: '',
      passwordHint: 'wise2026'
    });

    toast.success(`Empresa ${createdComp.name} e login do empresário criados com sucesso!`);
  };

  // Cadastrar Novo Analista com Permissões de Empresas
  const handleCreateAnalyst = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnalyst.name || !newAnalyst.email) {
      toast.error('Preencha o nome e e-mail do analista!');
      return;
    }

    const assignedCompanies = newAnalyst.allCompanies 
      ? ['all'] 
      : newAnalyst.selectedCompanyIds;

    if (!newAnalyst.allCompanies && assignedCompanies.length === 0) {
      toast.error('Selecione pelo menos uma empresa ou marque "Acesso a Todas as Empresas".');
      return;
    }

    const createdAnalyst: CrmUser = {
      id: 'usr-analyst-' + Date.now(),
      name: newAnalyst.name.trim(),
      email: newAnalyst.email.trim().toLowerCase(),
      phone: newAnalyst.phone.trim(),
      role: 'analyst',
      isMaster: Boolean(newAnalyst.isMaster),
      allowedCompanyIds: assignedCompanies,
      passwordHint: newAnalyst.passwordHint || 'wise2026',
      createdAt: new Date().toISOString()
    };

    CrmStorage.addUser(createdAnalyst);

    // Resumo dos nomes das empresas para notificação
    const targetCompNames = newAnalyst.allCompanies
      ? 'Todas as empresas parceiras'
      : companies
          .filter(c => newAnalyst.selectedCompanyIds.includes(c.id))
          .map(c => c.name)
          .join(', ');

    // Notificação para toda a equipe
    CrmStorage.addNotification({
      companyId: 'all',
      title: `👤 Novo Analista Integrado: ${createdAnalyst.name}`,
      message: `O analista ${createdAnalyst.name} ingressou na equipe com permissão para gerenciar: ${targetCompNames}.`,
      type: 'info'
    });

    // Notificação direta para as empresas atribuídas
    const targetCompanyIds = newAnalyst.allCompanies 
      ? companies.map(c => c.id) 
      : newAnalyst.selectedCompanyIds;

    targetCompanyIds.forEach(cId => {
      CrmStorage.addNotification({
        companyId: cId,
        title: `🤝 Novo Analista Designado`,
        message: `O analista técnico ${createdAnalyst.name} foi designado pela Wise Licitações para acompanhar seus processos licitatórios.`,
        type: 'info'
      });
    });

    setUsers(CrmStorage.getUsers());
    setShowNewAnalystModal(false);
    setNewAnalyst({
      name: '',
      email: '',
      phone: '',
      passwordHint: 'wise2026',
      isMaster: false,
      allCompanies: true,
      selectedCompanyIds: []
    });

    toast.success(`Analista ${createdAnalyst.name} cadastrado com sucesso e permissões configuradas!`);
  };

  // Salvar Edição de Permissões de um Analista Existente
  const handleSavePermissionsEdit = () => {
    if (!editingPermissionsUser) return;

    CrmStorage.updateUser(editingPermissionsUser.id, {
      allowedCompanyIds: editingPermissionsUser.allowedCompanyIds
    });

    // Notifica sobre a alteração
    const compNames = (!editingPermissionsUser.allowedCompanyIds || editingPermissionsUser.allowedCompanyIds.includes('all'))
      ? 'Todas as empresas'
      : companies
          .filter(c => editingPermissionsUser.allowedCompanyIds?.includes(c.id))
          .map(c => c.name)
          .join(', ');

    CrmStorage.addNotification({
      companyId: 'all',
      title: `⚙️ Permissões Atualizadas: ${editingPermissionsUser.name}`,
      message: `A carteira de empresas do analista ${editingPermissionsUser.name} foi atualizada para: ${compNames}.`,
      type: 'info'
    });

    setUsers(CrmStorage.getUsers());
    setEditingPermissionsUser(null);
    toast.success('Permissões do analista atualizadas com sucesso!');
  };

  // Criar Licitação
  const handleCreateTender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTender.orgao || !newTender.editalNumero || !newTender.objeto) {
      toast.error('Preencha os campos obrigatórios!');
      return;
    }

    const comp = companies.find(c => c.id === newTender.companyId);
    const created: CrmTender = {
      id: 'ten-' + Date.now(),
      companyId: newTender.companyId || companies[0]?.id || 'comp-crm-positivo',
      companyName: comp?.name || 'Empresa Cliente',
      orgao: newTender.orgao,
      editalNumero: newTender.editalNumero,
      objeto: newTender.objeto,
      valorEstimado: Number(newTender.valorEstimado) || 0,
      dataSessao: newTender.dataSessao || new Date().toISOString(),
      status: newTender.status as TenderStatus || 'captada',
      portal: newTender.portal || 'Comprasnet',
      modalidade: newTender.modalidade || 'Pregão Eletrônico',
      observacoes: newTender.observacoes || '',
      createdAt: new Date().toISOString().split('T')[0],
      history: [
        {
          id: 'h-' + Date.now(),
          timestamp: new Date().toLocaleString('pt-BR'),
          authorName: currentUser.name,
          description: 'Licitação cadastrada no sistema pelo analista.'
        }
      ]
    };

    const updated = [created, ...tenders];
    setTenders(updated);
    CrmStorage.saveTenders(updated);

    // Notificação para o cliente
    CrmStorage.addNotification({
      companyId: created.companyId,
      title: '🎯 Nova Oportunidade Cadastrada',
      message: `Novo certame identificado: ${created.orgao} - ${created.editalNumero} no valor de ${created.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}.`,
      type: 'info',
      tenderId: created.id
    });

    toast.success('Licitação adicionada com sucesso e cliente notificado!');
    setShowNewTenderModal(false);
  };

  // Atualizar Status da Licitação
  const handleUpdateStatus = (tenderId: string, newStatus: TenderStatus) => {
    const updated = tenders.map(t => {
      if (t.id === tenderId) {
        const statusLabels: Record<TenderStatus, string> = {
          captada: 'Captada / Em Triagem',
          analise: 'Em Análise de Viabilidade',
          habilitação: 'Preparando Habilitação',
          proposta_cadastrada: 'Proposta Cadastrada no Portal',
          em_disputa: 'Em Disputa de Lances',
          vencida: 'Vencida / Homologada 🏆',
          perdida: 'Encerrada / Não Vencida',
          cancelada: 'Cancelada pelo Órgão'
        };

        const notifType = newStatus === 'vencida' ? 'success' : newStatus === 'perdida' ? 'warning' : 'info';
        
        CrmStorage.addNotification({
          companyId: t.companyId,
          title: `Status Atualizado: ${statusLabels[newStatus]}`,
          message: `A licitação ${t.editalNumero} (${t.orgao}) teve seu status alterado para "${statusLabels[newStatus]}".`,
          type: notifType,
          tenderId: t.id
        });

        return {
          ...t,
          status: newStatus,
          history: [
            ...(t.history || []),
            {
              id: 'h-' + Date.now(),
              timestamp: new Date().toLocaleString('pt-BR'),
              authorName: currentUser.name,
              description: `Status alterado para ${statusLabels[newStatus]}.`
            }
          ]
        };
      }
      return t;
    });

    setTenders(updated);
    CrmStorage.saveTenders(updated);
    toast.success('Status atualizado e notificação enviada ao cliente!');
  };

  const getStatusBadge = (status: TenderStatus) => {
    switch (status) {
      case 'vencida':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">🏆 Vencida</span>;
      case 'em_disputa':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">⚡ Em Disputa</span>;
      case 'proposta_cadastrada':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">📋 Proposta Cadastrada</span>;
      case 'habilitação':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">📁 Habilitação</span>;
      case 'analise':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">🔎 Em Análise</span>;
      case 'perdida':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-destructive/10 text-destructive border border-destructive/20">❌ Não Vencida</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-muted text-muted-foreground">📌 Captada</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-card via-card to-primary/5 border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Painel de Gestão Operacional
            </h1>
            {isMaster ? (
              <span className="text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                👑 Analista Master
              </span>
            ) : (
              <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                🛡️ Analista da Equipe
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isMaster 
              ? 'Você tem controle total sobre clientes, empresas parceiras e permissões da equipe de analistas.'
              : `Você está gerenciando ${allowedCompanies.length} empresa(s) atribuída(s) pela gestão.`}
          </p>
        </div>

        {/* Master Quick Actions */}
        {isMaster && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowNewCompanyModal(true)}
              className="gap-1.5 text-xs font-semibold border-primary/30 text-primary hover:bg-primary/10"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>+ Nova Empresa</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setShowNewAnalystModal(true)}
              className="gap-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Novo Analista</span>
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTeamPermissionsModal(true)}
              className="gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Equipe & Permissões</span>
            </Button>
          </div>
        )}
      </div>

      {/* Filter and Primary Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
        
        {/* Company Filter Selector */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 sm:w-72">
            <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
              Filtrar por Empresa Parceira
            </label>
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">🌐 Todas as Empresas Permitidas ({allowedCompanies.length})</option>
              {allowedCompanies.map(c => (
                <option key={c.id} value={c.id}>🏢 {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {isMaster && (
            <Button 
              size="sm" 
              onClick={() => setShowNewAnalystModal(true)}
              className="gap-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Novo Analista</span>
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCredentialsModal(true)}
            className="gap-2 text-xs border-border hover:bg-muted text-foreground"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
            <span>Dados de Acesso (Empresários & Equipe)</span>
          </Button>

          <Button 
            size="sm" 
            onClick={() => setShowNewTenderModal(true)}
            className="gap-2 text-xs font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Licitação</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Licitações Ativas</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold tracking-tight">{activeTenders.length}</div>
          <p className="text-[11px] text-muted-foreground">Em processamento pela equipe</p>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Volume Sob Gestão</span>
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
            {totalVolumeManaged.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-muted-foreground">Soma dos editais gerenciados</p>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Contratos Homologados</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {totalWonAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            🏆 {wonTenders.length} licitações vencidas
          </p>
        </div>

        <div className="bg-card border border-border p-4 rounded-xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Alertas de Certidões</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {warningDocs.length}
          </div>
          <p className="text-[11px] text-muted-foreground">Documentos a renovar em breve</p>
        </div>
      </div>

      {/* Main Content Grid: Tenders Table + Certidões */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tenders Table (2 cols) */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>Gestão de Licitações</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                  {filteredTenders.length}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">Pipeline sincronizado em tempo real com os empresários parceiros</p>
            </div>
          </div>

          <div className="divide-y divide-border overflow-x-auto">
            {filteredTenders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Nenhuma licitação encontrada para a seleção atual.
              </div>
            ) : (
              filteredTenders.map(t => (
                <div key={t.id} className="p-4 hover:bg-muted/30 transition-colors space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{t.orgao}</span>
                        <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                          {t.editalNumero}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{t.objeto}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(t.status)}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2 pt-2 border-t border-border/50">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        💰 {t.valorEstimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(t.dataSessao).toLocaleDateString('pt-BR')} às {new Date(t.dataSessao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-primary" />
                        <span className="font-medium text-foreground">{t.companyName}</span>
                      </span>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-medium">Alterar Status:</span>
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateStatus(t.id, e.target.value as TenderStatus)}
                        className="bg-background border border-border rounded px-2 py-1 text-xs font-medium focus:ring-1 focus:ring-primary"
                      >
                        <option value="captada">📌 Captada</option>
                        <option value="analise">🔎 Em Análise</option>
                        <option value="habilitação">📁 Habilitação</option>
                        <option value="proposta_cadastrada">📋 Cadastrada</option>
                        <option value="em_disputa">⚡ Em Disputa</option>
                        <option value="vencida">🏆 Vencida</option>
                        <option value="perdida">❌ Não Vencida</option>
                      </select>
                    </div>
                  </div>

                  {t.observacoes && (
                    <div className="text-xs bg-muted/50 p-2 rounded-lg text-muted-foreground border border-border/50">
                      💬 <strong className="text-foreground">Obs:</strong> {t.observacoes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* CNDs / Documents Vault Sidebar (1 col) */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Controle de Certidões (CNDs)</span>
            </h3>
            <p className="text-xs text-muted-foreground">Monitoramento de prazos de validade</p>
          </div>

          <div className="p-4 space-y-3 overflow-y-auto max-h-[500px]">
            {filteredDocuments.map(doc => (
              <div 
                key={doc.id} 
                className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  doc.status === 'vencido' 
                    ? 'bg-destructive/10 border-destructive/30 text-destructive' 
                    : doc.status === 'atencao'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-card border-border text-foreground'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="truncate pr-2">{doc.nome}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${
                    doc.status === 'vencido' ? 'bg-destructive text-destructive-foreground' :
                    doc.status === 'atencao' ? 'bg-amber-500 text-white' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {doc.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>🏢 {doc.companyName?.split(' ')[0]}</span>
                  <span>Vence: <strong>{new Date(doc.dataVencimento).toLocaleDateString('pt-BR')}</strong></span>
                </div>

                {doc.observacao && (
                  <p className="text-[11px] text-muted-foreground italic border-t border-border/40 pt-1 mt-1">
                    {doc.observacao}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: CADASTRAR NOVA EMPRESA (EX: CRM POSITIVO)      */}
      {/* ======================================================== */}
      {showNewCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-card-foreground">
            
            <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Cadastrar Empresa Parceira</h2>
                  <p className="text-xs text-muted-foreground">Adicione um novo cliente e gere o acesso ao painel do empresário</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNewCompanyModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Razão Social / Nome Fantasia *</Label>
                <Input 
                  placeholder="Ex: CRM POSITIVO" 
                  value={newCompany.name}
                  onChange={e => setNewCompany({ ...newCompany, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">CNPJ *</Label>
                  <Input 
                    placeholder="00.000.000/0001-00" 
                    value={newCompany.cnpj}
                    onChange={e => setNewCompany({ ...newCompany, cnpj: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Segmento de Atuação</Label>
                  <Input 
                    placeholder="Ex: Tecnologia / TI" 
                    value={newCompany.segment}
                    onChange={e => setNewCompany({ ...newCompany, segment: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nome do Empresário / Diretor Responsável</Label>
                <Input 
                  placeholder="Ex: Carlos Eduardo" 
                  value={newCompany.responsibleName}
                  onChange={e => setNewCompany({ ...newCompany, responsibleName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Telefone / WhatsApp</Label>
                  <Input 
                    placeholder="(11) 98888-7777" 
                    value={newCompany.phone}
                    onChange={e => setNewCompany({ ...newCompany, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">E-mail de Login do Empresário *</Label>
                  <Input 
                    type="email"
                    placeholder="contato@crmpositivo.com.br" 
                    value={newCompany.email}
                    onChange={e => setNewCompany({ ...newCompany, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Senha Padrão Inicial</Label>
                <Input 
                  placeholder="wise2026" 
                  value={newCompany.passwordHint}
                  onChange={e => setNewCompany({ ...newCompany, passwordHint: e.target.value })}
                />
              </div>

              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary shrink-0" />
                <span>O empresário terá login automático e visualizará apenas os editais vinculados a esta empresa.</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowNewCompanyModal(false)}>Cancelar</Button>
                <Button type="submit" className="font-semibold">Cadastrar Empresa & Criar Acesso</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CADASTRAR NOVO ANALISTA & CONFIGURAR PERMISSÕES  */}
      {/* ======================================================== */}
      {showNewAnalystModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-card-foreground">
            
            <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Adicionar Novo Analista à Equipe</h2>
                  <p className="text-xs text-muted-foreground">Configure os dados de acesso e defina quais empresas ele poderá gerenciar</p>
                </div>
              </div>
              <button 
                onClick={() => setShowNewAnalystModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnalyst} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nome Completo do Analista *</Label>
                  <Input 
                    placeholder="Ex: Rafael Souza" 
                    value={newAnalyst.name}
                    onChange={e => setNewAnalyst({ ...newAnalyst, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">E-mail de Login *</Label>
                  <Input 
                    type="email"
                    placeholder="rafael@wiselicitacoes.com.br" 
                    value={newAnalyst.email}
                    onChange={e => setNewAnalyst({ ...newAnalyst, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Telefone / WhatsApp</Label>
                  <Input 
                    placeholder="(11) 97777-6666" 
                    value={newAnalyst.phone}
                    onChange={e => setNewAnalyst({ ...newAnalyst, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Senha Inicial de Acesso</Label>
                  <Input 
                    placeholder="wise2026" 
                    value={newAnalyst.passwordHint}
                    onChange={e => setNewAnalyst({ ...newAnalyst, passwordHint: e.target.value })}
                  />
                </div>
              </div>

              {/* Permissões de Empresas */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Nível de Acesso e Permissões</span>
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Configurado pelo Master</span>
                </div>

                {/* Opção Analista Master */}
                <div className="flex items-center gap-2.5 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="isMasterAnalystCheck"
                    checked={newAnalyst.isMaster}
                    onChange={e => setNewAnalyst({ 
                      ...newAnalyst, 
                      isMaster: e.target.checked,
                      allCompanies: e.target.checked ? true : newAnalyst.allCompanies
                    })}
                    className="w-4 h-4 rounded text-amber-500 border-border focus:ring-amber-500"
                  />
                  <label htmlFor="isMasterAnalystCheck" className="text-xs font-medium cursor-pointer">
                    👑 <strong>Tornar Analista Master:</strong> Acesso irrestrito a todas as empresas, gestão da equipe de analistas e permissão para editar acessos de clientes
                  </label>
                </div>

                {/* Opção Acesso Total */}
                <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border rounded-lg">
                  <input 
                    type="checkbox" 
                    id="allCompaniesCheck"
                    checked={newAnalyst.allCompanies}
                    disabled={newAnalyst.isMaster}
                    onChange={e => setNewAnalyst({ ...newAnalyst, allCompanies: e.target.checked })}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                  />
                  <label htmlFor="allCompaniesCheck" className="text-xs font-medium cursor-pointer">
                    🌐 <strong>Acesso a Todas as Empresas:</strong> Visualizar e acompanhar os editais de todas as empresas da carteira
                  </label>
                </div>

                {/* Checkboxes de Empresas Individuais */}
                {!newAnalyst.allCompanies && (
                  <div className="space-y-1.5 p-3 bg-card border border-border rounded-lg max-h-44 overflow-y-auto">
                    <p className="text-[11px] text-muted-foreground font-semibold mb-2">
                      Selecione individualmente as empresas que este analista poderá acessar:
                    </p>
                    {companies.map(comp => {
                      const isChecked = newAnalyst.selectedCompanyIds.includes(comp.id);
                      return (
                        <label 
                          key={comp.id} 
                          className="flex items-center gap-2.5 p-2 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
                        >
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setNewAnalyst({
                                  ...newAnalyst,
                                  selectedCompanyIds: newAnalyst.selectedCompanyIds.filter(id => id !== comp.id)
                                });
                              } else {
                                setNewAnalyst({
                                  ...newAnalyst,
                                  selectedCompanyIds: [...newAnalyst.selectedCompanyIds, comp.id]
                                });
                              }
                            }}
                            className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                          />
                          <span className="font-semibold text-foreground">{comp.name}</span>
                          <span className="text-muted-foreground text-[11px]">({comp.cnpj})</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowNewAnalystModal(false)}>Cancelar</Button>
                <Button type="submit" className="font-semibold bg-primary hover:bg-primary/90">
                  Salvar Analista e Notificar Equipe
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: GESTÃO DA EQUIPE DE ANALISTAS & PERMISSÕES      */}
      {/* ======================================================== */}
      {showTeamPermissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-card-foreground">
            
            <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Gestão da Equipe & Permissões</h2>
                  <p className="text-xs text-muted-foreground">Gerencie quem tem acesso a quais empresas na carteira da Wise</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTeamPermissionsModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Analistas Cadastrados</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowTeamPermissionsModal(false);
                    setShowNewAnalystModal(true);
                  }}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Novo Analista</span>
                </Button>
              </div>

              {users.filter(u => u.role === 'analyst').map(analyst => {
                const isAnalystMaster = Boolean(analyst.isMaster || analyst.email.toLowerCase() === 'marcelin5522@gmail.com');
                const hasAllAccess = isAnalystMaster || !analyst.allowedCompanyIds || analyst.allowedCompanyIds.includes('all');
                const assignedCount = hasAllAccess ? companies.length : (analyst.allowedCompanyIds?.length || 0);

                return (
                  <div key={analyst.id} className="p-4 bg-muted/20 border border-border rounded-xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                          {analyst.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-foreground">{analyst.name}</span>
                            {isAnalystMaster && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                                👑 Master
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{analyst.email}</span>
                        </div>
                      </div>

                      {!isAnalystMaster && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs gap-1"
                            onClick={() => setEditingPermissionsUser({ ...analyst })}
                          >
                            <Shield className="w-3.5 h-3.5 text-primary" />
                            <span>Configurar Empresas</span>
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              if (window.confirm(`Deseja remover o analista ${analyst.name}?`)) {
                                CrmStorage.deleteUser(analyst.id);
                                setUsers(CrmStorage.getUsers());
                                toast.success(`Analista ${analyst.name} removido.`);
                              }
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Empresas que ele atende */}
                    <div className="text-xs">
                      <span className="text-muted-foreground">Empresas Liberadas: </span>
                      {hasAllAccess ? (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          🌐 Todas as Empresas da Carteira ({companies.length})
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {companies
                            .filter(c => analyst.allowedCompanyIds?.includes(c.id))
                            .map(c => (
                              <span key={c.id} className="bg-primary/10 text-primary border border-primary/20 text-[11px] px-2 py-0.5 rounded-md font-medium">
                                🏢 {c.name}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-muted/40 border-t border-border flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowTeamPermissionsModal(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3.1: EDITAR PERMISSÕES ESPECÍFICAS DE UM ANALISTA   */}
      {/* ======================================================== */}
      {editingPermissionsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-card-foreground">
            
            <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Permissões de {editingPermissionsUser.name}</h3>
                <p className="text-xs text-muted-foreground">Marque quais empresas parceiras este analista poderá acessar</p>
              </div>
              <button 
                onClick={() => setEditingPermissionsUser(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted/30 border border-border rounded-lg">
                <input 
                  type="checkbox"
                  id="editAllCheck"
                  checked={!editingPermissionsUser.allowedCompanyIds || editingPermissionsUser.allowedCompanyIds.includes('all')}
                  onChange={e => {
                    if (e.target.checked) {
                      setEditingPermissionsUser({
                        ...editingPermissionsUser,
                        allowedCompanyIds: ['all']
                      });
                    } else {
                      setEditingPermissionsUser({
                        ...editingPermissionsUser,
                        allowedCompanyIds: []
                      });
                    }
                  }}
                  className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                />
                <label htmlFor="editAllCheck" className="text-xs font-semibold cursor-pointer">
                  🌐 Acesso Total (Todas as Empresas da Carteira)
                </label>
              </div>

              {editingPermissionsUser.allowedCompanyIds && !editingPermissionsUser.allowedCompanyIds.includes('all') && (
                <div className="space-y-1.5 p-3 bg-card border border-border rounded-lg max-h-56 overflow-y-auto">
                  <p className="text-[11px] text-muted-foreground font-semibold mb-2">
                    Selecione as empresas permitidas:
                  </p>
                  {companies.map(comp => {
                    const isChecked = editingPermissionsUser.allowedCompanyIds?.includes(comp.id);
                    return (
                      <label 
                        key={comp.id} 
                        className="flex items-center gap-2.5 p-2 rounded-md hover:bg-muted/50 cursor-pointer text-xs"
                      >
                        <input 
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const current = editingPermissionsUser.allowedCompanyIds || [];
                            const updated = isChecked
                              ? current.filter(id => id !== comp.id)
                              : [...current, comp.id];

                            setEditingPermissionsUser({
                              ...editingPermissionsUser,
                              allowedCompanyIds: updated
                            });
                          }}
                          className="w-4 h-4 rounded text-primary border-border focus:ring-primary"
                        />
                        <span className="font-semibold text-foreground">{comp.name}</span>
                        <span className="text-muted-foreground text-[11px]">({comp.cnpj})</span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditingPermissionsUser(null)}>Cancelar</Button>
                <Button onClick={handleSavePermissionsEdit} className="font-semibold">Salvar Permissões</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: CREDENCIAIS E DADOS DE ACESSO                    */}
      {/* ======================================================== */}
      {showCredentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-card-foreground">
            
            <div className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Credenciais & Acessos</h2>
                  <p className="text-xs text-muted-foreground">
                    Consulte os logins gerados para cada empresário parceiro e membros da equipe Wise
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowCredentialsModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              
              {/* Seção 1: Analistas da Equipe */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span>Equipe de Analistas Wise Licitações ({users.filter(u => u.role === 'analyst').length})</span>
                  </h4>
                  {isMaster && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setShowCredentialsModal(false);
                        setShowNewAnalystModal(true);
                      }}
                      className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white gap-1.5 font-semibold shadow-sm"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Novo Analista</span>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {users.filter(u => u.role === 'analyst').map(analyst => {
                    const isAnalystMaster = Boolean(analyst.isMaster || analyst.email.toLowerCase() === 'marcelin5522@gmail.com');
                    const text = `Acesso Wise CRM - Analista\nNome: ${analyst.name}\nE-mail: ${analyst.email}\nSenha: ${analyst.passwordHint || 'wise2026'}`;
                    return (
                      <div key={analyst.id} className="p-3 bg-muted/20 border border-border rounded-xl flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-foreground">{analyst.name}</span>
                            {isAnalystMaster && (
                              <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded">
                                Master
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            <span>📧 {analyst.email}</span> | <span>🔑 {analyst.passwordHint || 'wise2026'}</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-[11px] px-2 gap-1"
                          onClick={() => handleCopyCredentials(text, analyst.id)}
                        >
                          {copiedIndex === analyst.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIndex === analyst.id ? 'Copiado' : 'Copiar'}</span>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Seção 2: Clientes Empresários */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <h4 className="font-bold text-sm flex items-center gap-2 text-foreground">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span>Empresas Parceiras & Empresários</span>
                  </h4>
                  {isMaster && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowCredentialsModal(false);
                        setShowNewCompanyModal(true);
                      }}
                      className="h-7 text-xs text-primary gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Nova Empresa</span>
                    </Button>
                  )}
                </div>

                {companies.map(comp => {
                  const clientUsers = users.filter(u => u.companyId === comp.id);
                  return (
                    <div key={comp.id} className="border border-border rounded-xl p-4 bg-muted/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-bold text-sm flex items-center gap-2 text-foreground">
                            <span>🏢 {comp.name}</span>
                          </h5>
                          <span className="text-xs text-muted-foreground">CNPJ: {comp.cnpj} | {comp.segment}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {clientUsers.length === 0 ? (
                          <div className="flex items-center justify-between text-xs text-muted-foreground p-3 bg-card rounded-lg border border-border">
                            <span>Nenhum login de empresário gerado para esta empresa ainda.</span>
                            {isMaster && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs gap-1 text-primary border-primary/30"
                                onClick={() => {
                                  const newUsr: CrmUser = {
                                    id: 'usr-client-' + Date.now(),
                                    name: comp.responsibleName || comp.name,
                                    email: comp.email,
                                    role: 'client',
                                    companyId: comp.id,
                                    passwordHint: 'wise2026',
                                    phone: comp.phone,
                                    createdAt: new Date().toISOString()
                                  };
                                  CrmStorage.addUser(newUsr);
                                  setUsers(CrmStorage.getUsers());
                                  handleOpenEditClientUser(newUsr);
                                }}
                              >
                                <Plus className="w-3 h-3" />
                                <span>Criar Acesso</span>
                              </Button>
                            )}
                          </div>
                        ) : (
                          clientUsers.map(usr => {
                            const credentialsText = `Olá, ${usr.name}!\nSeguem seus dados de acesso ao Portal Wise Licitações:\n\n🌐 Empresa: ${comp.name}\n📧 E-mail: ${usr.email}\n🔑 Senha: ${usr.passwordHint || 'wise2026'}\n\nAcesse o portal para acompanhar seus editais em tempo real.`;
                            return (
                              <div key={usr.id} className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border border-border rounded-lg">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-xs text-foreground">{usr.name}</span>
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                                      👔 Empresário
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1 font-mono">
                                    <span>📧 {usr.email}</span>
                                    <span>🔑 Senha: <strong>{usr.passwordHint || 'wise2026'}</strong></span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  {isMaster && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10 font-semibold"
                                      onClick={() => handleOpenEditClientUser(usr)}
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                      <span>Editar Acesso</span>
                                    </Button>
                                  )}

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 text-xs gap-1.5"
                                    onClick={() => handleCopyCredentials(credentialsText, usr.id)}
                                  >
                                    {copiedIndex === usr.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{copiedIndex === usr.id ? 'Copiado!' : 'Copiar WhatsApp'}</span>
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => {
                                      setShowCredentialsModal(false);
                                      onSwitchUser(usr);
                                      toast.info(`Alternado para a visão de ${usr.name} (${comp.name})`);
                                    }}
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Ver como Cliente</span>
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>💡 Você pode copiar os dados e enviar diretamente pelo WhatsApp para o cliente ou para o analista.</span>
              <Button variant="ghost" size="sm" onClick={() => setShowCredentialsModal(false)}>Fechar</Button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 5: CADASTRAR NOVA LICITAÇÃO                        */}
      {/* ======================================================== */}
      {showNewTenderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-card-foreground">
            
            <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold">Cadastrar Nova Licitação</h2>
              <button 
                onClick={() => setShowNewTenderModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTender} className="p-6 space-y-4">
              
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Empresa Cliente *</Label>
                <select
                  value={newTender.companyId}
                  onChange={e => setNewTender({ ...newTender, companyId: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg p-2 text-sm"
                >
                  {allowedCompanies.map(c => (
                    <option key={c.id} value={c.id}>🏢 {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Órgão Público *</Label>
                  <Input 
                    placeholder="Ex: Tribunal de Contas" 
                    value={newTender.orgao}
                    onChange={e => setNewTender({ ...newTender, orgao: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Nº do Edital *</Label>
                  <Input 
                    placeholder="Ex: PE nº 45/2026" 
                    value={newTender.editalNumero}
                    onChange={e => setNewTender({ ...newTender, editalNumero: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Objeto Resumido *</Label>
                <Textarea 
                  placeholder="Descrição resumida do lote ou serviço solicitado no edital..."
                  rows={2}
                  value={newTender.objeto}
                  onChange={e => setNewTender({ ...newTender, objeto: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Valor Estimado (R$)</Label>
                  <Input 
                    type="number"
                    placeholder="500000"
                    value={newTender.valorEstimado}
                    onChange={e => setNewTender({ ...newTender, valorEstimado: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Data e Hora da Sessão</Label>
                  <Input 
                    type="datetime-local"
                    value={newTender.dataSessao}
                    onChange={e => setNewTender({ ...newTender, dataSessao: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Portal do Pregão</Label>
                  <Input 
                    placeholder="Ex: Comprasnet, BLL" 
                    value={newTender.portal}
                    onChange={e => setNewTender({ ...newTender, portal: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Modalidade</Label>
                  <Input 
                    placeholder="Ex: Pregão Eletrônico" 
                    value={newTender.modalidade}
                    onChange={e => setNewTender({ ...newTender, modalidade: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Observações Iniciais</Label>
                <Input 
                  placeholder="Ex: Proposta já enviada para cotação com fornecedores" 
                  value={newTender.observacoes}
                  onChange={e => setNewTender({ ...newTender, observacoes: e.target.value })}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowNewTenderModal(false)}>Cancelar</Button>
                <Button type="submit" className="font-semibold">Cadastrar e Notificar Cliente</Button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: EDITAR ACESSO DO EMPRESÁRIO (ANALISTA MASTER)     */}
      {/* ======================================================== */}
      {showEditClientUserModal && editingClientUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-card-foreground">
            
            <div className="p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Editar Acesso do Empresário</h2>
                  <p className="text-xs text-muted-foreground">Atualize o e-mail de login e credenciais da conta</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowEditClientUserModal(false);
                  setEditingClientUser(null);
                }}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClientUser} className="p-6 space-y-4">
              
              {/* Contexto da Empresa */}
              {editingClientUser.companyId && (
                <div className="p-3 bg-muted/40 border border-border rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Empresa Parceira:</span>
                    <strong className="text-foreground">
                      {companies.find(c => c.id === editingClientUser.companyId)?.name || 'Empresa'}
                    </strong>
                  </div>
                </div>
              )}

              {/* Nome */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nome do Empresário / Responsável *</Label>
                <Input 
                  placeholder="Nome do cliente" 
                  value={editClientForm.name}
                  onChange={e => setEditClientForm({ ...editClientForm, name: e.target.value })}
                  required
                />
              </div>

              {/* E-mail de Acesso (Login) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>📧 E-mail de Login do Empresário *</span>
                  </Label>
                  <span className="text-[10px] text-amber-500 font-semibold">Acesso ao Portal</span>
                </div>
                <Input 
                  type="email"
                  placeholder="email@empresa.com.br" 
                  value={editClientForm.email}
                  onChange={e => setEditClientForm({ ...editClientForm, email: e.target.value })}
                  className="font-mono"
                  required
                />
                <p className="text-[11px] text-muted-foreground">
                  Este é o e-mail que o empresário deve usar para entrar na plataforma.
                </p>
              </div>

              {/* Senha de Acesso */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Senha de Acesso</Label>
                <Input 
                  placeholder="wise2026" 
                  value={editClientForm.passwordHint}
                  onChange={e => setEditClientForm({ ...editClientForm, passwordHint: e.target.value })}
                  className="font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Senha que o empresário utiliza para login. Ele também pode alterá-la no painel dele.
                </p>
              </div>

              {/* Telefone / WhatsApp */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Telefone / WhatsApp</Label>
                <Input 
                  placeholder="(11) 98888-7777" 
                  value={editClientForm.phone}
                  onChange={e => setEditClientForm({ ...editClientForm, phone: e.target.value })}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowEditClientUserModal(false);
                    setEditingClientUser(null);
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="font-semibold gap-1.5 bg-primary hover:bg-primary/90"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
