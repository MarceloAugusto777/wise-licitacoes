export type UserRole = 'analyst' | 'client';

export type TenderStatus = 
  | 'captada'
  | 'analise'
  | 'habilitação'
  | 'proposta_cadastrada'
  | 'em_disputa'
  | 'vencida'
  | 'perdida'
  | 'cancelada';

export type DocumentStatus = 'valido' | 'atencao' | 'vencido';

export interface CrmUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isMaster?: boolean; // Analista Master com controle total e gestão de equipe
  companyId?: string; // Obrigatório para cliente (empresário)
  allowedCompanyIds?: string[]; // IDs de empresas permitidas para este analista ('all' ou lista de IDs)
  passwordHint?: string;
  avatarUrl?: string;
  phone?: string;
  createdAt?: string;
}

export interface CrmCompany {
  id: string;
  name: string;
  cnpj: string;
  segment: string;
  responsibleName: string;
  phone: string;
  email: string;
  activeTendersCount?: number;
  totalWonAmount?: number;
}

export interface CrmTenderHistory {
  id: string;
  timestamp: string;
  authorName: string;
  description: string;
}

export interface CrmTender {
  id: string;
  companyId: string;
  companyName?: string;
  orgao: string;
  editalNumero: string;
  objeto: string;
  valorEstimado: number;
  valorFinal?: number;
  dataSessao: string; // ISO date string
  status: TenderStatus;
  portal: string; // e.g. Comprasnet, Licitações-e, BLL
  modalidade: string; // e.g. Pregão Eletrônico, Concorrência
  observacoes?: string;
  createdAt: string;
  history?: CrmTenderHistory[];
}

export interface CrmDocument {
  id: string;
  companyId: string;
  companyName?: string;
  nome: string;
  tipo: 'CND Federal' | 'CND Estadual' | 'CND Municipal' | 'FGTS' | 'Trabalhista' | 'Balanço' | 'Outro';
  dataEmissao: string;
  dataVencimento: string;
  status: DocumentStatus;
  observacao?: string;
}

export interface CrmNotification {
  id: string;
  companyId: string; // Target company or 'all'
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  tenderId?: string;
}
