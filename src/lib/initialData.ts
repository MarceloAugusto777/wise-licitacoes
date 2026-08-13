export interface SectionItem {
  icon?: string;
  title: string;
  text: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  segment: string;
  results: string;
  description: string;
  visibleInSite: boolean;
  visibleInPresentation: boolean;
  imageUrl?: string;
}

export interface SiteData {
  hero: {
    badge: string;
    title: string;
    text: string;
    bullets: string[];
    ctaText: string;
    whatsappText: string;
    visible: boolean;
  };
  trustBar: {
    visible: boolean;
    items: { icon: string; label: string }[];
  };
  pain: {
    badge: string;
    title: string;
    description: string;
    visible: boolean;
    items: SectionItem[];
  };
  process: {
    badge: string;
    title: string;
    description: string;
    visible: boolean;
    items: SectionItem[];
  };
  benefits: {
    badge: string;
    title: string;
    visible: boolean;
    items: SectionItem[];
  };
  specialties: {
    badge: string;
    title: string;
    description: string;
    visible: boolean;
    cards: {
      icon: string;
      tag: string;
      title: string;
      items: string[];
    }[];
  };
  differentiators: {
    badge: string;
    title: string;
    visible: boolean;
    items: SectionItem[];
  };
  bigCTA: {
    title: string;
    text: string;
    ctaText: string;
    whatsappText: string;
    visible: boolean;
  };
  faq: {
    badge: string;
    title: string;
    description: string;
    visible: boolean;
    items: { q: string; a: string }[];
  };
  leadForm: {
    badge: string;
    title: string;
    description: string;
    visible: boolean;
    bullets: string[];
  };
}

export interface SlideItem {
  id?: string;
  icon?: string;
  title?: string;
  text?: string;
  value?: string;
  label?: string;
  desc?: string;
  time?: string;
  q?: string;
  a?: string;
  name?: string;
  cost?: string;
  details?: string;
  tag?: string;
  items?: string[];
}

export interface SlideData {
  id: string;
  type: string;
  label: string;
  title: string;
  subtitle: string;
  visible: boolean;
  badge?: string;
  customContent?: string;
  items?: SlideItem[];
}

export interface PresentationFaq {
  id: string;
  q: string;
  a: string;
}

export interface PresentationPricingModel {
  id: string;
  name: string;
  cost: string;
  details: string;
  visible?: boolean;
}

export interface PresentationData {
  theme: "dark" | "light";
  slides: SlideData[];
  faqs: PresentationFaq[];
  pricing: {
    title: string;
    subtitle: string;
    models: PresentationPricingModel[];
  };
}

export const defaultSiteData: SiteData = {
  hero: {
    badge: "Assessoria especializada em licitações públicas",
    title: "Sua empresa vende para o privado. Nós ajudamos você a vender também para o Governo.",
    text: "A Wise Licitações conduz todo o processo licitatório — do primeiro edital à assinatura do contrato — para que você foque no que faz melhor: sua operação.",
    bullets: [
      "Assessoria completa",
      "Atendimento personalizado",
      "Especialistas em Licitações",
      "Suporte do início ao fim",
    ],
    ctaText: "Solicitar Consultoria",
    whatsappText: "Falar pelo WhatsApp",
    visible: true,
  },
  trustBar: {
    visible: true,
    items: [
      { icon: "Building2", label: "Órgãos Federais, Estaduais e Municipais" },
      { icon: "HeartPulse", label: "Saúde & Hospitalar" },
      { icon: "HardHat", label: "Engenharia & Obras Públicas" },
      { icon: "Scale", label: "Pregões Eletrônicos & Presenciais" },
    ],
  },
  pain: {
    badge: "O problema",
    title: "Sua empresa está deixando oportunidades passarem?",
    description: "O mercado público representa mais de R$ 1 trilhão movimentados por ano no Brasil. A maioria das empresas fica de fora por razões que podem ser resolvidas.",
    visible: true,
    items: [
      { icon: "Search", title: "Não sabe onde encontrar editais", text: "Milhares de oportunidades publicadas todos os dias — quase todas passam despercebidas." },
      { icon: "Clock", title: "Perde prazos importantes", text: "Um dia de atraso é o suficiente para eliminar a proposta." },
      { icon: "FileText", title: "A burocracia parece complicada", text: "Cada órgão exige uma sequência diferente de documentos, certidões e comprovações." },
      { icon: "AlertTriangle", title: "Tem medo de ser desclassificado", text: "Erros de formalidade custam contratos, tempo e credibilidade." },
      { icon: "Users", title: "Não possui equipe especializada", text: "Contratar um time interno de licitações é caro e leva meses até estar pronto." },
      { icon: "TrendingUp", title: "Não tem tempo para acompanhar", text: "Enquanto você toca o negócio, o mercado público segue movimentando bilhões." },
    ],
  },
  process: {
    badge: "Como trabalhamos",
    title: "Nós cuidamos de tudo.",
    description: "Você recebe o contrato. Nós fazemos o resto.",
    visible: true,
    items: [
      { icon: "Search", title: "Encontramos oportunidades", text: "Monitoramos editais de todo o país compatíveis com o seu negócio." },
      { icon: "FileText", title: "Analisamos o edital", text: "Verificamos exigências, riscos, prazos e viabilidade da participação." },
      { icon: "ClipboardCheck", title: "Planejamos a participação", text: "Definimos estratégia comercial, precificação e postura na disputa." },
      { icon: "FolderCheck", title: "Organizamos a documentação", text: "Cuidamos de certidões, atestados, habilitação e anexos exigidos." },
      { icon: "Send", title: "Protocolamos tudo corretamente", text: "Cadastro, envio de propostas e submissão dentro do prazo." },
      { icon: "Gavel", title: "Participamos da sessão", text: "Atuamos ativamente nos lances, negociações e diligências." },
      { icon: "Scale", title: "Acompanhamos recursos", text: "Impugnações, contrarrazões e defesas quando necessário." },
      { icon: "Handshake", title: "Suporte até o contrato", text: "Homologação, assinatura e orientações para a execução." },
    ],
  },
  benefits: {
    badge: "Benefícios",
    title: "O que muda quando a Wise assume a operação",
    visible: true,
    items: [
      { icon: "Clock", title: "Mais tempo para sua empresa", text: "Você se concentra no core. A gente cuida da operação licitatória." },
      { icon: "FolderCheck", title: "Mais organização", text: "Documentação centralizada, rastreável e sempre atualizada." },
      { icon: "ShieldCheck", title: "Menor risco", text: "Análise técnica de cada edital antes de qualquer investimento." },
      { icon: "Scale", title: "Maior segurança jurídica", text: "Atendimento pautado na Lei 14.133/21 e demais normas vigentes." },
      { icon: "Sparkles", title: "Participação estratégica", text: "Escolhemos batalhas que fazem sentido para o seu negócio." },
      { icon: "TrendingUp", title: "Economia operacional", text: "Sem custo fixo de um departamento interno de licitações." },
    ],
  },
  specialties: {
    badge: "Especialidades",
    title: "Expertise onde as licitações são mais exigentes",
    description: "Atuamos em diversos segmentos, com forte especialização em dois mercados estratégicos e altamente regulados.",
    visible: true,
    cards: [
      {
        icon: "HeartPulse",
        tag: "Saúde & Hospitalar",
        title: "Conhecemos as exigências regulatórias, documentais e operacionais do setor.",
        items: [
          "Medicamentos e insumos",
          "Materiais e equipamentos hospitalares",
          "Odontologia e laboratórios",
          "Produtos para saúde",
          "Clínicas e distribuidores",
          "Registros ANVISA e certificações",
        ],
      },
      {
        icon: "HardHat",
        tag: "Engenharia",
        title: "Domínio dos requisitos técnicos para obras, serviços e projetos públicos.",
        items: [
          "Construção civil e obras públicas",
          "Engenharia elétrica, mecânica e ambiental",
          "Reformas e manutenção predial",
          "Pavimentação e serviços técnicos",
          "ART, atestados e acervo técnico",
          "Qualificação técnica e operacional",
        ],
      },
    ],
  },
  differentiators: {
    badge: "Diferenciais",
    title: "Por que empresas escolhem a Wise",
    visible: true,
    items: [
      { title: "Análise criteriosa dos editais", text: "Avaliamos viabilidade, riscos e margens antes de qualquer movimento." },
      { title: "Atendimento consultivo", text: "Você conversa com especialistas, não com um call center." },
      { title: "Comunicação clara", text: "Sem juridiquês. Sem burocracia disfarçada. Direto ao ponto." },
      { title: "Planejamento estratégico", text: "Definimos junto quais disputas fazem sentido para o seu negócio." },
      { title: "Organização documental", text: "Certidões, atestados e habilitação sempre em dia e rastreáveis." },
      { title: "Acompanhamento completo", text: "Presença ativa em pregões, recursos e diligências." },
      { title: "Redução de riscos", text: "Prevenção de desclassificações, penalidades e retrabalhos." },
      { title: "Suporte contínuo", text: "Do primeiro edital estudado até a assinatura do contrato." },
    ],
  },
  bigCTA: {
    title: "Sua empresa pode estar perdendo excelentes oportunidades de negócio.",
    text: "Solicite uma conversa sem compromisso e descubra como participar de licitações de forma segura, organizada e estratégica.",
    ctaText: "Solicitar consultoria gratuita",
    whatsappText: "Falar pelo WhatsApp",
    visible: true,
  },
  faq: {
    badge: "Dúvidas frequentes",
    title: "Perguntas que empresários costumam fazer",
    description: "Não encontrou o que procurava? Fale com um especialista.",
    visible: true,
    items: [
      {
        q: "Minha empresa nunca participou de licitações. Vocês atendem?",
        a: "Sim. Grande parte dos nossos clientes começa do zero. Nós estruturamos toda a habilitação, cadastros e documentação necessária para iniciar.",
      },
      {
        q: "Preciso ter equipe interna de licitações?",
        a: "Não. A Wise atua como seu departamento externo de licitações — do monitoramento de editais à assinatura do contrato.",
      },
      {
        q: "Vocês garantem que minha empresa vai ganhar licitações?",
        a: "Não fazemos promessas de vitória — isso seria irresponsável. O que garantimos é participação técnica, estratégica e sem falhas formais, aumentando significativamente suas chances reais.",
      },
      {
        q: "Como funciona a cobrança?",
        a: "Trabalhamos com modelos sob medida conforme o volume e o setor de atuação. Detalhamos tudo na consultoria inicial, sem compromisso.",
      },
      {
        q: "Vocês atuam em todo o Brasil?",
        a: "Sim. Nossa atuação é 100% remota e cobre pregões eletrônicos e presenciais em órgãos federais, estaduais e municipais.",
      },
      {
        q: "Quanto tempo até participar do primeiro pregão?",
        a: "Depende do estágio da sua empresa. Com documentação em dia, é possível participar já nas primeiras semanas.",
      },
    ],
  },
  leadForm: {
    badge: "Fale com um especialista",
    title: "Vamos entender o potencial da sua empresa no mercado público.",
    description: "Uma conversa objetiva, sem compromisso, para mapear oportunidades reais para o seu segmento.",
    visible: true,
    bullets: [
      "Resposta em até 1 dia útil",
      "Diagnóstico gratuito da situação da sua empresa",
      "Sem venda agressiva, sem pressão",
    ],
  },
};

export const defaultPresentationData: PresentationData = {
  theme: "dark",
  slides: [
    {
      id: "slide-1",
      type: "hero",
      label: "Abertura",
      badge: "Wise Licitações",
      title: "Wise Licitações: Sua Ponte para o Mercado Público",
      subtitle: "Apresentação comercial e estratégica de assessoria em licitações públicas para empresas que buscam expandir faturamento.",
      visible: true,
      items: [
        { title: "Assessoria completa" },
        { title: "Atendimento personalizado" },
        { title: "Especialistas em Licitações" },
        { title: "Suporte do início ao fim" },
      ],
    },
    {
      id: "slide-market",
      type: "market",
      label: "O Mercado",
      badge: "Oportunidade Comercial",
      title: "Por que vender para o Governo hoje?",
      subtitle: "O mercado público é o maior comprador do país e representa oportunidades bilionárias em todos os setores.",
      visible: true,
      items: [
        { value: "R$ 1,3 Trilhão", label: "Movimentação Anual", desc: "O Governo é o maior comprador de produtos e serviços do país.", icon: "Coins" },
        { value: "+1.500", label: "Novos Editais Diários", desc: "Oportunidades em praticamente todos os segmentos comerciais.", icon: "BarChart3" },
        { value: "Lei 14.133/21", label: "Ambiente Moderno", desc: "Nova lei de licitações com processos mais transparentes e ágeis.", icon: "Scale" },
        { value: "Prioridade PME", label: "Benefícios Exclusivos", desc: "Empresas de menor porte possuem vantagens e editais exclusivos de até R$ 80k.", icon: "Sparkles" },
      ],
    },
    {
      id: "slide-2",
      type: "pain",
      label: "O Problema",
      badge: "Desafios Comerciais",
      title: "Os desafios de vender para o Governo",
      subtitle: "Descubra por que a maioria das empresas desiste ou falha antes mesmo de participar das disputas.",
      visible: true,
      items: [
        { icon: "Search", title: "Não sabe onde encontrar editais", text: "Milhares de oportunidades publicadas todos os dias — quase todas passam despercebidas." },
        { icon: "Clock", title: "Perde prazos importantes", text: "Um dia de atraso é o suficiente para eliminar a proposta." },
        { icon: "FileText", title: "A burocracia parece complicada", text: "Cada órgão exige uma sequência diferente de documentos, certidões e comprovações." },
        { icon: "AlertTriangle", title: "Tem medo de ser desclassificado", text: "Erros de formalidade custam contratos, tempo e credibilidade." },
        { icon: "Users", title: "Não possui equipe especializada", text: "Contratar um time interno de licitações é caro e leva meses até estar pronto." },
        { icon: "TrendingUp", title: "Não tem tempo para acompanhar", text: "Enquanto você toca o negócio, o mercado público segue movimentando bilhões." },
      ],
    },
    {
      id: "slide-3",
      type: "process",
      label: "Assessoria Completa",
      badge: "Metodologia Wise",
      title: "Como trabalhamos: Nós cuidamos de tudo!",
      subtitle: "Você mantém o foco na sua operação, nossa equipe especializada executa cada etapa do processo licitatório.",
      visible: true,
      items: [
        { icon: "Search", title: "Encontramos oportunidades", text: "Monitoramos editais de todo o país compatíveis com o seu negócio." },
        { icon: "FileText", title: "Analisamos o edital", text: "Verificamos exigências, riscos, prazos e viabilidade da participação." },
        { icon: "ClipboardCheck", title: "Planejamos a participação", text: "Definimos estratégia comercial, precificação e postura na disputa." },
        { icon: "FolderCheck", title: "Organizamos a documentação", text: "Cuidamos de certidões, atestados, habilitação e anexos exigidos." },
      ],
    },
    {
      id: "slide-4",
      type: "benefits",
      label: "Nossos Benefícios",
      badge: "Retorno sobre o Investimento",
      title: "O que muda com a Wise Licitações",
      subtitle: "Segurança jurídica total, economia operacional e estratégia assertiva para vencer mais contratos.",
      visible: true,
      items: [
        { icon: "Clock", title: "Mais tempo para sua empresa", text: "Você se concentra no core. A gente cuida da operação licitatória." },
        { icon: "FolderCheck", title: "Mais organização", text: "Documentação centralizada, rastreável e sempre atualizada." },
        { icon: "ShieldCheck", title: "Menor risco", text: "Análise técnica de cada edital antes de qualquer investimento." },
        { icon: "Scale", title: "Maior segurança jurídica", text: "Atendimento pautado na Lei 14.133/21 e demais normas vigentes." },
        { icon: "Sparkles", title: "Participação estratégica", text: "Escolhemos batalhas que fazem sentido para o seu negócio." },
        { icon: "TrendingUp", title: "Economia operacional", text: "Sem custo fixo de um departamento interno de licitações." },
      ],
    },
    {
      id: "slide-specs",
      type: "specialties",
      label: "Nossas Especialidades",
      badge: "Especialização Técnica",
      title: "Segmentos com Maior Demanda Pública",
      subtitle: "Atuamos em diversas áreas, com equipes especializadas nos dois setores de maior volume financeiro e rigor do mercado.",
      visible: true,
      items: [
        {
          icon: "HeartPulse",
          tag: "Saúde & Hospitalar",
          title: "Conhecemos as exigências regulatórias, documentais e operacionais do setor.",
          items: [
            "Medicamentos e insumos",
            "Materiais e equipamentos hospitalares",
            "Odontologia e laboratórios",
            "Produtos para saúde",
            "Clínicas e distribuidores",
            "Registros ANVISA e certificações",
          ],
        },
        {
          icon: "HardHat",
          tag: "Engenharia",
          title: "Domínio dos requisitos técnicos para obras, serviços e projetos públicos.",
          items: [
            "Construção civil e obras públicas",
            "Engenharia elétrica, mecânica e ambiental",
            "Reformas e manutenção predial",
            "Pavimentação e serviços técnicos",
            "ART, atestados e acervo técnico",
            "Qualificação técnica e operacional",
          ],
        },
      ],
    },
    {
      id: "slide-diffs",
      type: "differentiators",
      label: "Diferenciais",
      badge: "Por que a Wise?",
      title: "Por que a Wise é diferente",
      subtitle: "Nosso compromisso é com o seu contrato. Não vendemos softwares nem soluções parciais.",
      visible: true,
    },
    {
      id: "slide-tech-edge",
      type: "tech-edge",
      label: "Tecnologia & Robô",
      badge: "Vantagem Tecnológica Insuperável",
      title: "Por que a Wise sai na frente da concorrência?",
      subtitle: "Unimos tecnologia autônoma de lances com inteligência competitiva para colocar sua empresa no 1º lugar do pregão com a maior margem de lucro.",
      visible: true,
      items: [
        {
          icon: "Bot",
          title: "Robô de Lance Autônomo (1º Lugar Garantido)",
          text: "Utilizamos softwares de gestão de licitações equipados com robôs de lances de milissegundos, reagindo instantaneamente no pregão para garantir a sua empresa no 1º lugar com a margem de lucro protegida."
        },
        {
          icon: "BarChart3",
          title: "Relatório Completo de Disputa & Concorrência",
          text: "Emitimos relatórios estratégicos pós-pregão com mapeamento detalhado de itens, valores praticados, margens médias e o raio-X completo das empresas concorrentes para você dominar o mercado."
        },
        {
          icon: "ShieldCheck",
          title: "Blindagem Jurídica & Inabilitação de Adversários",
          text: "Combinamos a inteligência robótica com auditoria jurídica humana para identificar erros nas propostas concorrentes e inabilitar adversários irregulares via recurso."
        }
      ]
    },
    {
      id: "slide-5",
      type: "cases",
      label: "Cases Reais",
      badge: "Cases de Sucesso",
      title: "Resultados práticos de nossos parceiros",
      subtitle: "Veja como empresas de diversos portes alavancaram seu faturamento através de licitações públicas com a nossa assessoria.",
      visible: true,
    },
    {
      id: "slide-onboard",
      type: "onboarding",
      label: "Plano de Ação",
      badge: "Plano de Entrada",
      title: "Como iniciamos as vendas públicas",
      subtitle: "Um cronograma de onboarding prático e estruturado para iniciar a participação da sua empresa em editais.",
      visible: true,
      items: [
        {
          time: "Dias 1 a 3",
          title: "Auditoria Completa",
          desc: "Auditoria operacional, levantamento de certidões vigentes e identificação de eventuais bloqueios de habilitação.",
        },
        {
          time: "Dias 4 a 6",
          title: "Cadastros Governamentais",
          desc: "Credenciamento no Compras.gov.br e portais municipais/estaduais estratégicos para a sua área de atuação.",
        },
        {
          time: "Dias 7 a 9",
          title: "Mapeamento Comercial",
          desc: "Filtro dinâmico das primeiras licitações e editais compatíveis com a capacidade de entrega da sua empresa.",
        },
        {
          time: "Dia 10 em diante",
          title: "Participação e Disputa",
          desc: "Envio de propostas comerciais e participação nos primeiros pregões em tempo real, acompanhado por nossa banca jurídica.",
        },
      ],
    },
    {
      id: "slide-faq",
      type: "presentation-faq",
      label: "FAQ / Dúvidas",
      badge: "FAQ Interativo",
      title: "Principais dúvidas sobre a assessoria",
      subtitle: "Respostas diretas para as perguntas mais frequentes que recebemos de empresários.",
      visible: true,
    },
    {
      id: "slide-pricing",
      type: "presentation-pricing",
      label: "Proposta Comercial",
      badge: "Proposta Comercial",
      title: "Nossos Modelos de Parceria",
      subtitle: "Uma estrutura de custos justa e focada no seu crescimento em contratos públicos.",
      visible: true,
    },
    {
      id: "slide-6",
      type: "final",
      label: "Próximos Passos",
      badge: "Próximos Passos",
      title: "Pronto para faturar alto com o Governo?",
      subtitle: "Escaneie o QR Code ou clique abaixo para iniciar seu diagnóstico gratuito de potencial do mercado público.",
      visible: true,
    },
  ],
  faqs: [
    {
      id: "faq-1",
      q: "Como funciona a cobrança da assessoria?",
      a: "Trabalhamos com uma taxa de setup inicial (para auditoria e cadastros) + comissão de sucesso (success fee) apenas sobre os contratos efetivamente vencidos. Alinhamento total com seus resultados.",
    },
    {
      id: "faq-2",
      q: "Minha empresa precisa ter um especialista interno?",
      a: "Não. Nós funcionamos como o seu departamento terceirizado de licitações completo. Cuidamos dos portais, dos lances ao vivo, da documentação e dos recursos jurídicos.",
    },
    {
      id: "faq-3",
      q: "E se perdermos a licitação disputada?",
      a: "Você não paga nenhuma taxa de comissão/sucesso. Nós dividimos o risco operacional comercial e só ganhamos quando você ganhar.",
    },
  ],
  pricing: {
    title: "Proposta Comercial Sob Medida",
    subtitle: "Escolha o modelo de parceria que faz sentido para a sua empresa hoje.",
    models: [
      {
        id: "price-1",
        name: "Setup Operacional",
        cost: "R$ 1.500",
        details: "Auditoria documental completa, cadastros nos principais portais públicos, regularização do SICAF.",
        visible: true,
      },
      {
        id: "price-2",
        name: "Taxa Operacional Mensal",
        cost: "Sob Consulta",
        details: "Monitoramento diário de editais, time de consultores dedicados ao seu produto, participação de lances semanais.",
        visible: true,
      },
      {
        id: "price-3",
        name: "Comissão de Sucesso",
        cost: "2% a 5%",
        details: "Apenas sobre contratos homologados e vencidos. Defesas jurídicas e recursos inclusos sem taxa extra.",
        visible: true,
      },
    ],
  },
};

export const defaultCases: CaseStudy[] = [
  {
    id: "case-1",
    client: "MedHealth Distribuidora",
    segment: "Saúde & Hospitalar",
    results: "+ R$ 4,2 Milhões homologados em 6 meses",
    description: "Distribuidora de insumos médicos que nunca havia participado de licitações. Estruturamos toda a documentação, regularizações da Anvisa e participamos de 14 pregões eletrônicos federais, vencendo 5 contratos de grande porte.",
    visibleInSite: true,
    visibleInPresentation: true,
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "case-2",
    client: "EngeForte Engenharia",
    segment: "Engenharia & Obras",
    results: "Contrato de R$ 8,9 Milhões em consórcio municipal",
    description: "Empresa de construção civil média que precisava de qualificação técnica complexa. Auxiliamos na formação do consórcio, validação de certidões e defesa de recurso contra concorrente desclassificado, garantindo a execução da obra.",
    visibleInSite: true,
    visibleInPresentation: true,
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "case-3",
    client: "LimpPro Facilities",
    segment: "Serviços Recorrentes",
    results: "R$ 2,5 Milhões em contratos anuais recorrentes",
    description: "Prestadora de serviços de limpeza e segurança terceirizada. Mapeamos oportunidades estaduais e municipais, otimizando os lances de preço e reduzindo o tempo de fechamento operacional de novos postos de trabalho públicos.",
    visibleInSite: true,
    visibleInPresentation: true,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  },
];
