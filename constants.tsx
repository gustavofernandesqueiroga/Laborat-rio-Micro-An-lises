
import { Unit, UnitType, Service, ExamPrep, Checkup, LayoutType } from './types';

export const UNITS: Unit[] = [
  // 8 Smart Units (Atendimento)
  {
    id: 'smart-miramar',
    name: 'Smart Unit Miramar (Sede)',
    address: 'Av. Epitácio Pessoa, 2500 - Miramar',
    city: 'João Pessoa',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 18:00',
    coordinates: { lat: -7.1195, lng: -34.8550 },
    layoutType: LayoutType.HUB
  },
  {
    id: 'smart-bessa',
    name: 'Smart Unit Bessa',
    address: 'Av. Gov. Argemiro de Figueiredo, 1500 - Bessa',
    city: 'João Pessoa',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 17:00',
    coordinates: { lat: -7.0850, lng: -34.8300 },
    layoutType: LayoutType.LINEAR
  },
  {
    id: 'smart-mangabeira',
    name: 'Smart Unit Mangabeira',
    address: 'Rua Josefa Taveira, 1200 - Mangabeira',
    city: 'João Pessoa',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 17:00',
    coordinates: { lat: -7.1650, lng: -34.8350 },
    layoutType: LayoutType.HUB
  },
  {
    id: 'smart-manaira',
    name: 'Smart Unit Manaíra',
    address: 'Av. João Câncio da Silva, 800 - Manaíra',
    city: 'João Pessoa',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 18:00',
    coordinates: { lat: -7.1000, lng: -34.8300 },
    layoutType: LayoutType.LINEAR
  },
  {
    id: 'smart-tambau',
    name: 'Smart Unit Tambaú',
    address: 'Av. Alm. Tamandaré, 450 - Tambaú',
    city: 'João Pessoa',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 18:00',
    coordinates: { lat: -7.1150, lng: -34.8250 },
    layoutType: LayoutType.COMPACT
  },
  {
    id: 'smart-bancarios',
    name: 'Smart Unit Bancários',
    address: 'Rua Walfredo Macedo Brandão, 100 - Bancários',
    city: 'João Pessoa',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 17:00',
    coordinates: { lat: -7.1500, lng: -34.8450 },
    layoutType: LayoutType.COMPACT
  },
  {
    id: 'smart-altiplano',
    name: 'Smart Unit Altiplano',
    address: 'Av. João Cirilo da Silva, 120 - Altiplano',
    city: 'João Pessoa',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 17:00',
    coordinates: { lat: -7.1300, lng: -34.8350 },
    layoutType: LayoutType.COMPACT
  },
  {
    id: 'smart-valentina',
    name: 'Smart Unit Valentina',
    address: 'Rua Marieta Araújo Nascimento, 50 - Valentina',
    city: 'João Pessoa',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 17:00',
    coordinates: { lat: -7.1800, lng: -34.8500 },
    layoutType: LayoutType.LINEAR
  },
  // 4 Logistic Points (MAT/Logística)
  {
    id: 'log-rodoviaria',
    name: 'Ponto Logístico Rodoviária',
    address: 'Terminal Rodoviário de João Pessoa - Varadouro',
    city: 'João Pessoa',
    type: UnitType.AUTONOMOUS,
    phone: '(83) 3022-1000',
    hours: '24h (Logística)',
    coordinates: { lat: -7.1250, lng: -34.8850 }
  },
  {
    id: 'log-aeroporto',
    name: 'Ponto Logístico Aeroporto',
    address: 'Aeroporto Internacional Castro Pinto',
    city: 'João Pessoa',
    type: UnitType.AUTONOMOUS,
    phone: '(83) 3022-1000',
    hours: '24h (Logística)',
    coordinates: { lat: -7.1450, lng: -34.9500 }
  },
  {
    id: 'log-manaira-shopping',
    name: 'Ponto Logístico Manaíra Shopping',
    address: 'Av. Gov. Flávio Ribeiro Coutinho - Manaíra',
    city: 'João Pessoa',
    type: UnitType.AUTONOMOUS,
    phone: '(83) 3022-1000',
    hours: '10:00 - 22:00',
    coordinates: { lat: -7.0950, lng: -34.8350 }
  },
  {
    id: 'log-mangabeira-shopping',
    name: 'Ponto Logístico Mangabeira Shopping',
    address: 'Av. Hilton Souto Maior - Mangabeira',
    city: 'João Pessoa',
    type: UnitType.AUTONOMOUS,
    phone: '(83) 3022-1000',
    hours: '10:00 - 22:00',
    coordinates: { lat: -7.1600, lng: -34.8400 }
  },
  // Litoral Paraibano
  {
    id: 'smart-cabedelo',
    name: 'Smart Unit Cabedelo',
    address: 'Rua Duque de Caxias, 120 - Centro',
    city: 'Cabedelo',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 17:00',
    coordinates: { lat: -6.9800, lng: -34.8330 },
    layoutType: LayoutType.LINEAR
  },
  {
    id: 'smart-santa-rita',
    name: 'Smart Unit Santa Rita',
    address: 'Av. Flávio Ribeiro Coutinho, 500 - Centro',
    city: 'Santa Rita',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 17:00',
    coordinates: { lat: -7.1140, lng: -34.9730 },
    layoutType: LayoutType.LINEAR
  },
  {
    id: 'smart-bayeux',
    name: 'Smart Unit Bayeux',
    address: 'Av. Liberdade, 1500 - Centro',
    city: 'Bayeux',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 17:00',
    coordinates: { lat: -7.1250, lng: -34.9320 },
    layoutType: LayoutType.COMPACT
  },
  {
    id: 'smart-conde',
    name: 'Smart Unit Conde',
    address: 'Rua Manoel Alves, S/N - Centro',
    city: 'Conde',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 12:00',
    coordinates: { lat: -7.2590, lng: -34.9070 },
    layoutType: LayoutType.COMPACT
  },
  {
    id: 'smart-lucena',
    name: 'Smart Unit Lucena',
    address: 'Av. Américo Falcão, S/N - Centro',
    city: 'Lucena',
    type: UnitType.CLASSIC,
    phone: '(83) 3022-1000',
    hours: '06:00 - 12:00',
    coordinates: { lat: -6.9010, lng: -34.8450 },
    layoutType: LayoutType.COMPACT
  }
];

export const EXAM_PREPS: ExamPrep[] = [
  {
    id: 'p1',
    exam: 'Glicemia de Jejum',
    fasting: '8 a 12 horas',
    instructions: [
      'Não ingerir bebidas alcoólicas 72h antes.',
      'Manter dieta habitual.',
      'Água é permitida com moderação.'
    ]
  },
  {
    id: 'p2',
    exam: 'Hemograma Completo',
    fasting: '3 horas desejável',
    instructions: [
      'Evitar exercícios físicos intensos 24h antes.',
      'Informar medicamentos em uso.'
    ]
  },
  {
    id: 'p3',
    exam: 'Perfil Lipídico',
    fasting: '12 horas rigorosas',
    instructions: [
      'Jejum obrigatório de 12 horas para análise de triglicerídeos.',
      'Evitar dietas restritivas na véspera.'
    ]
  },
  {
    id: 'p4',
    exam: 'TSH / Hormônios',
    instructions: [
      'Coletar preferencialmente pela manhã.',
      'Anotar horário da última dose de medicamento para tireoide.'
    ]
  }
];

// Portfólio Curva A (Conforme PDF)
export const SERVICES: Service[] = [
  { id: 'S001', name: 'Hemograma Completo', description: 'Análise completa das células sanguíneas.', category: 'Sangue', price: 'R$ 35,00', isJaja24h: true },
  { id: 'S002', name: 'Glicemia de Jejum', description: 'Diagnóstico e monitoramento de diabetes.', category: 'Sangue', price: 'R$ 15,00', isJaja24h: true },
  { id: 'S003', name: 'Perfil Lipídico', description: 'Colesterol total e frações.', category: 'Sangue', price: 'R$ 65,00' },
  { id: 'S004', name: 'TSH / T4 Livre', description: 'Avaliação da função tireoidiana.', category: 'Sangue', price: 'R$ 85,00', isJaja24h: true },
  { id: 'S005', name: 'Ureia e Creatinina', description: 'Avaliação da função renal.', category: 'Sangue', price: 'R$ 30,00', isJaja24h: true },
  { id: 'S006', name: 'Sumário de Urina (EAS)', description: 'Análise física, química e sedimentoscopia.', category: 'Outros', price: 'R$ 25,00', isJaja24h: true },
  { id: 'S007', name: 'Parasitológico (EPF)', description: 'Pesquisa de parasitas nas fezes.', category: 'Outros', price: 'R$ 25,00' },
  { id: 'S008', name: 'Beta HCG', description: 'Diagnóstico de gravidez (Quantitativo).', category: 'Sangue', price: 'R$ 45,00', isJaja24h: true },
  { id: 'S009', name: 'Vitamina D (25-OH)', description: 'Níveis de vitamina D no organismo.', category: 'Sangue', price: 'R$ 90,00' },
  { id: 'S010', name: 'Ferritina', description: 'Reserva de ferro no organismo.', category: 'Sangue', price: 'R$ 55,00' },
  { id: 'S011', name: 'TSH Reflex', description: 'Avaliação da tireoide com cascata automática.', category: 'Sangue', price: 'R$ 95,00' },
  { id: 'S012', name: 'Vitamina B12', description: 'Níveis de cobalamina no sangue.', category: 'Sangue', price: 'R$ 45,00' },
  { id: 'S013', name: 'Ferro Sérico', description: 'Dosagem de ferro circulante.', category: 'Sangue', price: 'R$ 25,00' },
  { id: 'S014', name: 'CK Total', description: 'Marcador de lesão muscular e cardíaca.', category: 'Sangue', price: 'R$ 35,00' },
  { id: 'S015', name: 'AST/TGO', description: 'Avaliação da função hepática.', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'S016', name: 'Ácido Úrico', description: 'Avaliação dos níveis de ácido úrico.', category: 'Sangue', price: 'R$ 15,00' },
  { id: 'S017', name: 'ALT/TGP', description: 'Avaliação da função hepática (TGP).', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'S018', name: 'Amilase', description: 'Avaliação da função pancreática.', category: 'Sangue', price: 'R$ 25,00' },
  { id: 'S019', name: 'Bilirrubinas (Total e Frações)', description: 'Avaliação da função biliar e hepática.', category: 'Sangue', price: 'R$ 25,00' },
  { id: 'S020', name: 'Cálcio Iônico', description: 'Dosagem de cálcio livre no sangue.', category: 'Sangue', price: 'R$ 30,00' },
  { id: 'S021', name: 'Coagulograma', description: 'Avaliação da coagulação sanguínea.', category: 'Sangue', price: 'R$ 45,00' },
  { id: 'S022', name: 'Cortisol Basal', description: 'Avaliação da função adrenal.', category: 'Sangue', price: 'R$ 55,00' },
  { id: 'S023', name: 'Curva Glicêmica (GTT)', description: 'Teste de tolerância à glicose.', category: 'Sangue', price: 'R$ 60,00' },
  { id: 'S024', name: 'Eletrólitos (Na, K, Cl)', description: 'Dosagem de sódio, potássio e cloro.', category: 'Sangue', price: 'R$ 45,00' },
  { id: 'S025', name: 'Estradiol', description: 'Avaliação hormonal feminina.', category: 'Sangue', price: 'R$ 65,00' },
  { id: 'S026', name: 'Fosfatase Alcalina', description: 'Marcador biliar e ósseo.', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'S027', name: 'Gama GT', description: 'Avaliação da função biliar.', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'S028', name: 'Hemoglobina Glicada (HbA1c)', description: 'Média da glicemia dos últimos 3 meses.', category: 'Sangue', price: 'R$ 40,00', isJaja24h: true },
  { id: 'S029', name: 'Insulina de Jejum', description: 'Avaliação da produção de insulina.', category: 'Sangue', price: 'R$ 45,00' },
  { id: 'S030', name: 'Magnésio', description: 'Dosagem de magnésio no sangue.', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'S031', name: 'PCR Ultrassensível', description: 'Marcador de inflamação e risco cardíaco.', category: 'Sangue', price: 'R$ 45,00', isJaja24h: true },
  { id: 'S032', name: 'Prolactina', description: 'Avaliação hormonal da hipófise.', category: 'Sangue', price: 'R$ 55,00' },
  { id: 'S033', name: 'PSA Total', description: 'Rastreamento de alterações na próstata.', category: 'Sangue', price: 'R$ 65,00' },
  { id: 'S034', name: 'Testosterona Total', description: 'Avaliação hormonal masculina e feminina.', category: 'Sangue', price: 'R$ 75,00' },
  { id: 'S035', name: 'Triglicerídeos', description: 'Dosagem de gorduras no sangue.', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'S036', name: 'Vitamina B9 (Ácido Fólico)', description: 'Níveis de folato no organismo.', category: 'Sangue', price: 'R$ 45,00' },
  { id: 'S037', name: 'Zinco', description: 'Dosagem de zinco no sangue.', category: 'Sangue', price: 'R$ 85,00' },
  { id: 'V001', name: 'Hemograma Veterinário', description: 'Análise hematológica para animais de pequeno e grande porte.', category: 'Veterinário', price: 'R$ 45,00' },
  { id: 'V002', name: 'Bioquímico Renal Pet', description: 'Avaliação da função renal para cães e gatos.', category: 'Veterinário', price: 'R$ 75,00' },
  { id: 'V003', name: 'ALT/TGP Veterinário', description: 'Função hepática para pets.', category: 'Veterinário', price: 'R$ 35,00' },
  { id: 'V004', name: 'AST/TGO Veterinário', description: 'Avaliação hepática e muscular pet.', category: 'Veterinário', price: 'R$ 35,00' },
  { id: 'V005', name: 'Creatinina Veterinária', description: 'Função renal pet.', category: 'Veterinário', price: 'R$ 30,00' },
  { id: 'V006', name: 'Glicemia Veterinária', description: 'Nível de açúcar no sangue pet.', category: 'Veterinário', price: 'R$ 25,00' },
  { id: 'V007', name: 'Perfil Hepático Pet', description: 'Combo de exames para fígado pet.', category: 'Veterinário', price: 'R$ 120,00' },
  { id: 'V008', name: 'Perfil Lipídico Pet', description: 'Avaliação de gorduras pet.', category: 'Veterinário', price: 'R$ 110,00' },
  { id: 'V009', name: 'Pesquisa de Hemoparasitas', description: 'Pesquisa de Ehrlichia e Babesia.', category: 'Veterinário', price: 'R$ 85,00' },
  { id: 'V010', name: 'Sumário de Urina Veterinário', description: 'Análise de urina pet.', category: 'Veterinário', price: 'R$ 45,00' },
  { id: 'V011', name: 'T4 Total Veterinário', description: 'Avaliação da tireoide pet.', category: 'Veterinário', price: 'R$ 95,00' },
  { id: 'V012', name: 'Ureia Veterinária', description: 'Avaliação da função renal pet.', category: 'Veterinário', price: 'R$ 30,00' },
  { id: 'S038', name: 'Dengue NS1', description: 'Diagnóstico precoce da Dengue.', category: 'Sangue', price: 'R$ 85,00', isJaja24h: true },
  { id: 'S039', name: 'Dengue IgG/IgM', description: 'Pesquisa de anticorpos para Dengue.', category: 'Sangue', price: 'R$ 75,00' },
  { id: 'S040', name: 'Zika Virus (Sorologia)', description: 'Pesquisa de anticorpos para Zika.', category: 'Sangue', price: 'R$ 120,00' },
  { id: 'S041', name: 'Chikungunya (Sorologia)', description: 'Pesquisa de anticorpos para Chikungunya.', category: 'Sangue', price: 'R$ 120,00' },
  { id: 'S042', name: 'Vitamina A', description: 'Dosagem de Retinol no sangue.', category: 'Sangue', price: 'R$ 95,00' },
  { id: 'S043', name: 'Vitamina E', description: 'Dosagem de Tocoferol no sangue.', category: 'Sangue', price: 'R$ 95,00' },
  { id: 'S044', name: 'Vitamina K', description: 'Avaliação dos níveis de Vitamina K.', category: 'Sangue', price: 'R$ 110,00' },
  { id: 'S045', name: 'Vitamina B1', description: 'Dosagem de Tiamina no sangue.', category: 'Sangue', price: 'R$ 85,00' },
  { id: 'S046', name: 'Vitamina B6', description: 'Dosagem de Piridoxina no sangue.', category: 'Sangue', price: 'R$ 85,00' },
  { id: 'S047', name: 'Microalbuminúria', description: 'Avaliação precoce de lesão renal.', category: 'Outros', price: 'R$ 45,00' },
  { id: 'S048', name: 'Clearence de Creatinina', description: 'Avaliação da taxa de filtração glomerular.', category: 'Outros', price: 'R$ 55,00' },
  { id: 'S049', name: 'Proteinúria 24h', description: 'Dosagem de proteínas na urina de 24h.', category: 'Outros', price: 'R$ 40,00' },
  { id: 'S050', name: 'PSA Livre', description: 'Complemento na avaliação da próstata.', category: 'Sangue', price: 'R$ 75,00' },
  { id: 'S051', name: 'CA-125', description: 'Marcador tumoral (Ovário).', category: 'Sangue', price: 'R$ 110,00' },
  { id: 'S052', name: 'CEA', description: 'Antígeno Carcinoembrionário.', category: 'Sangue', price: 'R$ 85,00' },
  { id: 'S053', name: 'AFP', description: 'Alfa-fetoproteína (Marcador tumoral).', category: 'Sangue', price: 'R$ 85,00' },
  { id: 'S054', name: 'CA 19-9', description: 'Marcador tumoral (Pâncreas/Vias Biliares).', category: 'Sangue', price: 'R$ 110,00' },
  { id: 'S055', name: 'Pesquisa de Sangue Oculto', description: 'Rastreamento de sangramento intestinal.', category: 'Outros', price: 'R$ 30,00' },
  { id: 'S056', name: 'Urocultura com Antibiograma', description: 'Identificação de bactérias na urina.', category: 'Outros', price: 'R$ 65,00' },
  { id: 'S057', name: 'Swab Nasal (COVID/Influenza)', description: 'Teste rápido para vírus respiratórios.', category: 'Outros', price: 'R$ 120,00', isJaja24h: true },
  { id: 'S058', name: 'VDRL (Sífilis)', description: 'Triagem para Sífilis.', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'S059', name: 'HIV 1 e 2 (Sorologia)', description: 'Triagem para vírus HIV.', category: 'Sangue', price: 'R$ 45,00' },
  { id: 'S060', name: 'HBsAg (Hepatite B)', description: 'Marcador de infecção por Hepatite B.', category: 'Sangue', price: 'R$ 35,00' },
  { id: 'S061', name: 'Anti-HCV (Hepatite C)', description: 'Pesquisa de anticorpos para Hepatite C.', category: 'Sangue', price: 'R$ 45,00' },
  { id: 'S062', name: 'Preventivo (Citopatológico)', description: 'Rastreamento de câncer do colo do útero.', category: 'Outros', price: 'R$ 70,00' },
  { id: 'S063', name: 'Potássio', description: 'Níveis de potássio no sangue.', category: 'Sangue', price: 'R$ 15,00' },
  { id: 'S064', name: 'Sódio', description: 'Níveis de sódio no sangue.', category: 'Sangue', price: 'R$ 15,00' },
  { id: 'S065', name: 'Frutosamina', description: 'Monitoramento da glicemia nas últimas 2-3 semanas.', category: 'Sangue', price: 'R$ 45,00' },
  { id: 'S066', name: 'LDL-C', description: 'Colesterol de baixa densidade (RUIM).', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'S067', name: 'HDL-C', description: 'Colesterol de alta densidade (BOM).', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'S068', name: 'Colesterol Total', description: 'Soma de todos os tipos de colesterol.', category: 'Sangue', price: 'R$ 15,00' },
  { id: 'S069', name: 'Colesterol Não HDL-C', description: 'Avaliação de risco cardiovascular.', category: 'Sangue', price: 'R$ 25,00' },
  { id: 'S070', name: 'Cálcio Sérico', description: 'Dosagem de cálcio total no sangue.', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'S071', name: 'Transferrina', description: 'Proteína transportadora de ferro.', category: 'Sangue', price: 'R$ 35,00' },
  { id: 'S072', name: 'Homocisteína', description: 'Marcador de risco cardiovascular e deficiência de vitaminas.', category: 'Sangue', price: 'R$ 95,00' },
  { id: 'S073', name: 'Fósforo', description: 'Níveis de fósforo no sangue.', category: 'Sangue', price: 'R$ 20,00' },
  { id: 'V013', name: 'Perfil Geriátrico Cão', description: 'Check-up completo para cães idosos.', category: 'Veterinário', price: 'R$ 250,00' },
  { id: 'V014', name: 'Perfil Geriátrico Gato', description: 'Check-up completo para gatos idosos.', category: 'Veterinário', price: 'R$ 250,00' },
  { id: 'V015', name: 'Perfil Pré-Operatório Pet', description: 'Exames essenciais antes de cirurgias.', category: 'Veterinário', price: 'R$ 180,00' },
  { id: 'V016', name: 'Dosagem de Fenobarbital', description: 'Monitoramento de medicação anticonvulsivante.', category: 'Veterinário', price: 'R$ 95,00' },
  { id: 'V017', name: 'Pesquisa de Malassezia', description: 'Identificação de fungos em ouvidos/pele.', category: 'Veterinário', price: 'R$ 45,00' },
  { id: 'V018', name: 'Citologia de Pele Pet', description: 'Análise microscópica de lesões cutâneas.', category: 'Veterinário', price: 'R$ 65,00' },
  { id: 'V019', name: 'Cultura com Antibiograma Pet', description: 'Identificação de bactérias e sensibilidade.', category: 'Veterinário', price: 'R$ 110,00' },
  { id: 'V020', name: 'Perfil Endócrino Pet', description: 'Avaliação hormonal completa para pets.', category: 'Veterinário', price: 'R$ 220,00' },
  { id: 'V021', name: 'Pesquisa de Leishmaniose', description: 'Diagnóstico de Calazar em cães.', category: 'Veterinário', price: 'R$ 95,00' },
  { id: 'V022', name: 'Pesquisa de Dirofilaria', description: 'Teste para verme do coração.', category: 'Veterinário', price: 'R$ 85,00' }
];

export const ESTIMATED_TIMES = {
  HOME: {
    average: '30-45 min',
    description: 'Tempo médio de coleta incluindo deslocamento do Guepardo.',
    historicalBasis: 'Baseado na média de coletas do último trimestre.'
  },
  LAB: {
    average: '15-20 min',
    description: 'Tempo médio de espera e atendimento em nossas Smart Units.',
    historicalBasis: 'Baseado no fluxo médio de atendimento presencial.'
  }
};

// Combos Estratégicos (Conforme PDF)
export const CHECKUPS: Checkup[] = [
  {
    id: 'COMBO-BASIC',
    name: 'Combo Básico',
    description: 'Check-up essencial para monitoramento de rotina. Ótimo custo-benefício.',
    exams: ['Hemograma', 'Glicemia', 'Perfil Lipídico', 'Sumário de Urina'],
    oldPrice: 'R$ 140,00',
    price: 'R$ 110,00'
  },
  {
    id: 'COMBO-FIT',
    name: 'Combo Fitness/Performance',
    description: 'Focado em praticantes de atividade física e monitoramento hormonal.',
    exams: ['TSH / T4 Livre', 'Vitamina D', 'Ferritina', 'CK Total'],
    oldPrice: 'R$ 265,00',
    price: 'R$ 199,00'
  },
  {
    id: 'COMBO-WOMAN',
    name: 'Combo Saúde da Mulher',
    description: 'Cuidado integral para a saúde feminina.',
    exams: ['Combo Básico', 'TSH / T4 Livre', 'Preventivo (Citopatológico)'],
    oldPrice: 'R$ 295,00',
    price: 'R$ 230,00'
  },
  {
    id: 'COMBO-MAN',
    name: 'Combo Saúde do Homem',
    description: 'Rastreamento preventivo completo para a saúde masculina.',
    exams: ['Hemograma', 'Perfil Lipídico', 'Glicemia', 'PSA Total', 'TSH', 'Ácido Úrico'],
    oldPrice: 'R$ 285,00',
    price: 'R$ 215,00'
  },
  {
    id: 'COMBO-KIDS',
    name: 'Combo Check-up Kids',
    description: 'Exames essenciais para o acompanhamento do crescimento infantil.',
    exams: ['Hemograma', 'Glicemia', 'Parasitológico (EPF)', 'Sumário de Urina'],
    oldPrice: 'R$ 100,00',
    price: 'R$ 79,00'
  },
  {
    id: 'COMBO-HEART',
    name: 'Combo Coração Protegido',
    description: 'Monitoramento detalhado de riscos cardiovasculares.',
    exams: ['Perfil Lipídico', 'Glicemia', 'PCR Ultrassensível', 'Hemoglobina Glicada'],
    oldPrice: 'R$ 165,00',
    price: 'R$ 135,00'
  },
  {
    id: 'COMBO-VITAMINS',
    name: 'Super Combo Vitaminas',
    description: 'Avaliação completa dos micronutrientes essenciais.',
    exams: ['Vitamina D', 'Vitamina B12', 'Vitamina B9 (Ácido Fólico)', 'Ferritina'],
    oldPrice: 'R$ 235,00',
    price: 'R$ 180,00'
  }
];
