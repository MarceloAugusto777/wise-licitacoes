import { 
  CrmCompany, 
  CrmUser, 
  CrmTender, 
  CrmDocument, 
  CrmNotification,
  TenderStatus 
} from '@/types/crm';

export const DEFAULT_COMPANIES: CrmCompany[] = [
  {
    id: 'comp-crm-positivo',
    name: 'CRM POSITIVO',
    cnpj: '12.345.678/0001-90',
    segment: 'Tecnologia / Soluções Corporativas',
    responsibleName: 'Empresário Responsável',
    phone: '(11) 98888-7777',
    email: 'contato@crmpositivo.com.br',
  },
  {
    id: 'comp-1',
    name: 'MedSaúde Distribuidora Hospitalar Ltda',
    cnpj: '33.456.789/0001-22',
    segment: 'Saúde / Hospitalar',
    responsibleName: 'Dr. Roberto Mendes',
    phone: '(11) 98765-4321',
    email: 'diretoria@medsaude.com.br',
  },
  {
    id: 'comp-2',
    name: 'Construtora Silva & Filhos Engenharia',
    cnpj: '98.765.432/0001-10',
    segment: 'Engenharia / Obras Públicas',
    responsibleName: 'Eng. Carlos Eduardo Silva',
    phone: '(11) 97123-8899',
    email: 'contato@construtorasilva.com.br',
  }
];

export const DEFAULT_USERS: CrmUser[] = [
  {
    id: 'usr-analyst-master',
    name: 'Marcelo Augusto (Analista Master)',
    email: 'marcelin5522@gmail.com',
    role: 'analyst',
    isMaster: true,
    passwordHint: 'wise2026',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-analyst-equipe',
    name: 'Analista de Operações (Equipe Wise)',
    email: 'analista@wiselicitacoes.com.br',
    role: 'analyst',
    isMaster: false,
    allowedCompanyIds: ['comp-crm-positivo', 'comp-1'],
    passwordHint: 'wise2026',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-client-crm-positivo',
    name: 'Empresário (CRM POSITIVO)',
    email: 'diretoria@crmpositivo.com.br',
    role: 'client',
    companyId: 'comp-crm-positivo',
    passwordHint: 'positivo2026',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-client-1',
    name: 'Dr. Roberto Mendes (Diretor)',
    email: 'diretoria@medsaude.com.br',
    role: 'client',
    companyId: 'comp-1',
    passwordHint: 'medsaude123',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-client-2',
    name: 'Mariana Medeiros (Gerente Comercial)',
    email: 'mariana.comercial@medsaude.com.br',
    role: 'client',
    companyId: 'comp-1',
    passwordHint: 'medsaude2026',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-client-3',
    name: 'Eng. Carlos Eduardo Silva (Sócio)',
    email: 'contato@construtorasilva.com.br',
    role: 'client',
    companyId: 'comp-2',
    passwordHint: 'silva2026',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  }
];

export const DEFAULT_TENDERS: CrmTender[] = [
  {
    id: 'ten-crm-1',
    companyId: 'comp-crm-positivo',
    companyName: 'CRM POSITIVO',
    orgao: 'Secretaria de Inovação e Tecnologia - SP',
    editalNumero: 'PE nº 52/2026',
    objeto: 'Contratação de plataforma corporativa e sistema de gestão integrada em nuvem.',
    valorEstimado: 680000.00,
    valorFinal: 645000.00,
    dataSessao: '2026-09-10T10:00',
    status: 'vencida',
    portal: 'Comprasnet (GOV.BR)',
    modalidade: 'Pregão Eletrônico',
    observacoes: 'Homologação confirmada! Contrato assinado. Equipe Wise acompanhou todo o certame.',
    createdAt: '2026-08-15',
    history: [
      { id: 'h1', timestamp: '2026-08-15 10:00', authorName: 'Marcelo Augusto (Master)', description: 'Edital captado e aprovado com a diretoria da CRM POSITIVO.' },
      { id: 'h2', timestamp: '2026-08-20 15:30', authorName: 'Analista Wise', description: 'Documentação e proposta técnica cadastradas com sucesso.' },
      { id: 'h3', timestamp: '2026-09-10 11:45', authorName: 'Analista Wise', description: 'Disputa finalizada em 1º lugar com economia estratégica.' }
    ]
  },
  {
    id: 'ten-crm-2',
    companyId: 'comp-crm-positivo',
    companyName: 'CRM POSITIVO',
    orgao: 'Tribunal de Contas do Estado',
    editalNumero: 'PE nº 19/2026',
    objeto: 'Prestação de serviços continuados de suporte e tecnologia da informação.',
    valorEstimado: 1250000.00,
    dataSessao: '2026-09-22T14:00',
    status: 'proposta_cadastrada',
    portal: 'Licitações-e (Banco do Brasil)',
    modalidade: 'Pregão Eletrônico',
    observacoes: 'Proposta enviada dentro dos prazos. Sessão de disputa agendada para 22/09 às 14h.',
    createdAt: '2026-08-28',
    history: [
      { id: 'h1', timestamp: '2026-08-28 09:00', authorName: 'Analista Wise', description: 'Impugnação técnica aceita e proposta formatada.' }
    ]
  },
  {
    id: 'ten-101',
    companyId: 'comp-1',
    companyName: 'MedSaúde Distribuidora Hospitalar Ltda',
    orgao: 'Hospital das Clínicas de SP',
    editalNumero: 'PE nº 142/2026',
    objeto: 'Aquisição de insumos médico-hospitalares e seringas descartáveis de alta precisão.',
    valorEstimado: 450000.00,
    valorFinal: 412000.00,
    dataSessao: '2026-09-02T09:00',
    status: 'vencida',
    portal: 'Comprasnet (GOV.BR)',
    modalidade: 'Pregão Eletrônico',
    observacoes: 'Homologado! Contrato assinado e em fase de entrega do lote 1.',
    createdAt: '2026-08-10',
    history: [
      { id: 'h1', timestamp: '2026-08-10 10:00', authorName: 'Analista Wise', description: 'Licitação captada e cadastrada.' },
      { id: 'h2', timestamp: '2026-08-15 14:30', authorName: 'Analista Wise', description: 'Proposta cadastrada no portal Comprasnet.' },
      { id: 'h3', timestamp: '2026-08-20 11:00', authorName: 'Analista Wise', description: 'Sessão pública realizada. Empresa classificada em 1º lugar.' },
      { id: 'h4', timestamp: '2026-08-24 16:00', authorName: 'Analista Wise', description: 'Adjudicada e Homologada com sucesso!' }
    ]
  },
  {
    id: 'ten-102',
    companyId: 'comp-1',
    companyName: 'MedSaúde Distribuidora Hospitalar Ltda',
    orgao: 'Secretaria Municipal de Saúde de Campinas',
    editalNumero: 'PE nº 88/2026',
    objeto: 'Fornecimento continuado de medicamentos essenciais da farmácia básica.',
    valorEstimado: 890000.00,
    dataSessao: '2026-08-28T10:00',
    status: 'proposta_cadastrada',
    portal: 'Licitações-e (Banco do Brasil)',
    modalidade: 'Pregão Eletrônico',
    observacoes: 'Proposta de preços e documentação cadastradas no sistema do Banco do Brasil. Sessão amanhã às 10h.',
    createdAt: '2026-08-18',
    history: [
      { id: 'h1', timestamp: '2026-08-18 09:15', authorName: 'Analista Wise', description: 'Edital lido e aprovado pela diretoria.' },
      { id: 'h2', timestamp: '2026-08-25 17:00', authorName: 'Analista Wise', description: 'Proposta e documentos inseridos no sistema.' }
    ]
  },
  {
    id: 'ten-103',
    companyId: 'comp-1',
    companyName: 'MedSaúde Distribuidora Hospitalar Ltda',
    orgao: 'Ministério da Saúde - Central de Compras',
    editalNumero: 'PE nº 205/2026',
    objeto: 'Registro de Preços para equipamentos de diagnóstico por imagem e ultrassom.',
    valorEstimado: 2300000.00,
    dataSessao: '2026-09-15T14:00',
    status: 'analise',
    portal: 'Comprasnet',
    modalidade: 'Pregão Eletrônico SRP',
    observacoes: 'Aguardando envio dos prospectos técnicos pelo fabricante para inclusão na proposta.',
    createdAt: '2026-08-24',
    history: [
      { id: 'h1', timestamp: '2026-08-24 11:30', authorName: 'Analista Wise', description: 'Oportunidade captada. Enviada ficha técnica para análise do cliente.' }
    ]
  },
  {
    id: 'ten-201',
    companyId: 'comp-2',
    companyName: 'Construtora Silva & Filhos Engenharia',
    orgao: 'Prefeitura Municipal de Osasco',
    editalNumero: 'Concorrência nº 12/2026',
    objeto: 'Reforma e ampliação da EMEF Prof. José Alencar com pavimentação e infraestrutura.',
    valorEstimado: 1750000.00,
    dataSessao: '2026-09-05T09:30',
    status: 'habilitação',
    portal: 'BLL Compras Pública',
    modalidade: 'Concorrência Pública',
    observacoes: 'Certidões e Atestados de Capacidade Técnica organizados em dossiê.',
    createdAt: '2026-08-12',
    history: [
      { id: 'h1', timestamp: '2026-08-12 14:00', authorName: 'Analista Wise', description: 'Leitura do Edital e verificação de requisitos de qualificação técnica.' },
      { id: 'h2', timestamp: '2026-08-22 10:00', authorName: 'Analista Wise', description: 'Dossier de Habilitação montado com engenheiro responsável.' }
    ]
  },
  {
    id: 'ten-202',
    companyId: 'comp-2',
    companyName: 'Construtora Silva & Filhos Engenharia',
    orgao: 'DER-SP (Departamento de Estradas de Rodagem)',
    editalNumero: 'PE nº 44/2026',
    objeto: 'Manutenção preventiva e reparos asfálticos na Rodovia SP-075.',
    valorEstimado: 3100000.00,
    valorFinal: 2950000.00,
    dataSessao: '2026-08-14T10:00',
    status: 'vencida',
    portal: 'Bec SP',
    modalidade: 'Pregão Eletrônico',
    observacoes: 'Adjudicada! Ordem de serviço prevista para início de setembro.',
    createdAt: '2026-08-01',
    history: [
      { id: 'h1', timestamp: '2026-08-01 09:00', authorName: 'Analista Wise', description: 'Edital selecionado para participação.' },
      { id: 'h2', timestamp: '2026-08-14 11:30', authorName: 'Analista Wise', description: 'Disputa de lances finalizada em 1º lugar.' }
    ]
  }
];

export const DEFAULT_DOCUMENTS: CrmDocument[] = [
  {
    id: 'doc-1',
    companyId: 'comp-1',
    companyName: 'MedSaúde Distribuidora Hospitalar Ltda',
    nome: 'Certidão Negativa de Débitos Tributários Federais e Dívida Ativa da União',
    tipo: 'CND Federal',
    dataEmissao: '2026-06-01',
    dataVencimento: '2026-11-28',
    status: 'valido',
    observacao: 'Emita regular pelo site da Receita Federal.'
  },
  {
    id: 'doc-2',
    companyId: 'comp-1',
    companyName: 'MedSaúde Distribuidora Hospitalar Ltda',
    nome: 'Certificado de Regularidade do FGTS (CRF)',
    tipo: 'FGTS',
    dataEmissao: '2026-08-10',
    dataVencimento: '2026-09-08',
    status: 'atencao',
    observacao: 'Vence em menos de 15 dias. Analista programará renovação automática junto à Caixa.'
  },
  {
    id: 'doc-3',
    companyId: 'comp-2',
    companyName: 'Construtora Silva & Filhos Engenharia',
    nome: 'Certidão Negativa de Débitos Trabalhistas (CNDT)',
    tipo: 'Trabalhista',
    dataEmissao: '2026-05-15',
    dataVencimento: '2026-11-10',
    status: 'valido'
  },
  {
    id: 'doc-4',
    companyId: 'comp-2',
    companyName: 'Construtora Silva & Filhos Engenharia',
    nome: 'Certidão Negativa de Débitos Municipais (Prefeitura de SP)',
    tipo: 'CND Municipal',
    dataEmissao: '2026-02-20',
    dataVencimento: '2026-08-20',
    status: 'vencido',
    observacao: 'Vencida recentemente. Pedido de renovação já protocolado na Secretaria de Finanças.'
  }
];

export const DEFAULT_NOTIFICATIONS: CrmNotification[] = [
  {
    id: 'notif-1',
    companyId: 'comp-1',
    title: '🏆 Licitação Vencida!',
    message: 'A licitação PE nº 142/2026 (Hospital das Clínicas de SP) foi adjudicada e homologada em favor da MedSaúde!',
    timestamp: '2026-08-24 16:00',
    read: false,
    type: 'success',
    tenderId: 'ten-101'
  },
  {
    id: 'notif-2',
    companyId: 'comp-1',
    title: '📋 Proposta Cadastrada',
    message: 'Proposta e documentos de habilitação inseridos no sistema para o PE nº 88/2026 (Sec. Saúde Campinas). Sessão amanhã às 10h.',
    timestamp: '2026-08-25 17:00',
    read: true,
    type: 'info',
    tenderId: 'ten-102'
  },
  {
    id: 'notif-3',
    companyId: 'comp-2',
    title: '⚠️ Alerta de Documentação',
    message: 'A CND Municipal da Construtora Silva venceu em 20/08. A equipe Wise já protocolou o pedido de emissão da nova certidão.',
    timestamp: '2026-08-21 09:00',
    read: false,
    type: 'warning'
  },
  {
    id: 'notif-4',
    companyId: 'comp-2',
    title: '🎉 Homologação de Contrato',
    message: 'O DER-SP homologou a licitação PE nº 44/2026 no valor de R$ 2.950.000,00.',
    timestamp: '2026-08-14 11:30',
    read: true,
    type: 'success',
    tenderId: 'ten-202'
  }
];

// Storage Keys
const STORAGE_KEYS = {
  COMPANIES: 'wise_crm_companies',
  USERS: 'wise_crm_users',
  TENDERS: 'wise_crm_tenders',
  DOCUMENTS: 'wise_crm_documents',
  NOTIFICATIONS: 'wise_crm_notifications',
  CURRENT_USER: 'wise_crm_current_user'
};

export class CrmStorage {
  static getCompanies(): CrmCompany[] {
    if (typeof window === 'undefined') return DEFAULT_COMPANIES;
    const raw = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    if (!raw) {
      this.saveCompanies(DEFAULT_COMPANIES);
      return DEFAULT_COMPANIES;
    }
    try {
      const parsed: CrmCompany[] = JSON.parse(raw);
      // Mescla com DEFAULT_COMPANIES garantindo que novas empresas padrão existam
      let updated = false;
      const merged = [...parsed];
      for (const def of DEFAULT_COMPANIES) {
        if (!merged.some(c => c.id === def.id || c.name.toLowerCase() === def.name.toLowerCase())) {
          merged.push(def);
          updated = true;
        }
      }
      if (updated) {
        this.saveCompanies(merged);
      }
      return merged;
    } catch {
      return DEFAULT_COMPANIES;
    }
  }

  static saveCompanies(companies: CrmCompany[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
    }
  }

  static addCompany(company: CrmCompany): CrmCompany {
    const list = this.getCompanies();
    const updated = [company, ...list];
    this.saveCompanies(updated);
    return company;
  }

  static updateCompany(companyId: string, partial: Partial<CrmCompany>): CrmCompany | null {
    const list = this.getCompanies();
    let updatedCompany: CrmCompany | null = null;
    const updated = list.map(c => {
      if (c.id === companyId) {
        updatedCompany = { ...c, ...partial };
        return updatedCompany;
      }
      return c;
    });
    if (updatedCompany) {
      this.saveCompanies(updated);
    }
    return updatedCompany;
  }

  static getUsers(): CrmUser[] {
    if (typeof window === 'undefined') return DEFAULT_USERS;
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      this.saveUsers(DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    try {
      const parsed: CrmUser[] = JSON.parse(raw);
      let updated = false;
      const merged = [...parsed];
      for (const def of DEFAULT_USERS) {
        const foundIndex = merged.findIndex(u => u.email.toLowerCase() === def.email.toLowerCase());
        if (foundIndex === -1) {
          merged.push(def);
          updated = true;
        } else {
          // Atualiza se for analista master
          if (def.isMaster && !merged[foundIndex].isMaster) {
            merged[foundIndex].isMaster = true;
            updated = true;
          }
        }
      }
      if (updated) {
        this.saveUsers(merged);
      }
      return merged;
    } catch {
      return DEFAULT_USERS;
    }
  }

  static saveUsers(users: CrmUser[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }

  static addUser(user: CrmUser): CrmUser {
    const list = this.getUsers();
    const updated = [user, ...list];
    this.saveUsers(updated);
    return user;
  }

  static updateUser(userId: string, partial: Partial<CrmUser>): CrmUser | null {
    const list = this.getUsers();
    let updatedUser: CrmUser | null = null;
    const updated = list.map(u => {
      if (u.id === userId) {
        updatedUser = { ...u, ...partial };
        return updatedUser;
      }
      return u;
    });
    if (updatedUser) {
      this.saveUsers(updated);
      // Se for o usuário atual, atualiza também
      const curr = this.getCurrentUser();
      if (curr && curr.id === userId) {
        this.setCurrentUser(updatedUser);
      }
    }
    return updatedUser;
  }

  static deleteUser(userId: string) {
    const list = this.getUsers();
    const filtered = list.filter(u => u.id !== userId);
    this.saveUsers(filtered);
  }

  static getTenders(): CrmTender[] {
    if (typeof window === 'undefined') return DEFAULT_TENDERS;
    const raw = localStorage.getItem(STORAGE_KEYS.TENDERS);
    if (!raw) {
      this.saveTenders(DEFAULT_TENDERS);
      return DEFAULT_TENDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TENDERS;
    }
  }

  static saveTenders(tenders: CrmTender[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.TENDERS, JSON.stringify(tenders));
    }
  }

  static getDocuments(): CrmDocument[] {
    if (typeof window === 'undefined') return DEFAULT_DOCUMENTS;
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!raw) {
      this.saveDocuments(DEFAULT_DOCUMENTS);
      return DEFAULT_DOCUMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_DOCUMENTS;
    }
  }

  static saveDocuments(documents: CrmDocument[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    }
  }

  static getNotifications(): CrmNotification[] {
    if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      this.saveNotifications(DEFAULT_NOTIFICATIONS);
      return DEFAULT_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }

  static saveNotifications(notifications: CrmNotification[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }

  static getCurrentUser(): CrmUser | null {
    if (typeof window === 'undefined') return DEFAULT_USERS[0];
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      return null;
    }
    try {
      const parsed: CrmUser = JSON.parse(raw);
      // Sempre sincroniza com a lista de usuários mais atualizada
      const all = this.getUsers();
      const found = all.find(u => u.id === parsed.id || u.email.toLowerCase() === parsed.email.toLowerCase());
      if (found) {
        if (JSON.stringify(found) !== JSON.stringify(parsed)) {
          this.setCurrentUser(found);
        }
        return found;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: CrmUser | null) {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
  }

  // Helper to add notification
  static addNotification(notif: Omit<CrmNotification, 'id' | 'timestamp' | 'read'>) {
    const list = this.getNotifications();
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newNotif: CrmNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      timestamp: formattedDate,
      read: false
    };

    const updated = [newNotif, ...list];
    this.saveNotifications(updated);
    return newNotif;
  }

  // Reset to initial demo data
  static resetToDefaultData() {
    this.saveCompanies(DEFAULT_COMPANIES);
    this.saveUsers(DEFAULT_USERS);
    this.saveTenders(DEFAULT_TENDERS);
    this.saveDocuments(DEFAULT_DOCUMENTS);
    this.saveNotifications(DEFAULT_NOTIFICATIONS);
  }
}
