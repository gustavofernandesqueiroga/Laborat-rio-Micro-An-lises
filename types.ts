
export enum UnitType {
  AUTONOMOUS = 'Autônoma (Tele-atendimento)',
  CLASSIC = 'Clássica (Com Recepção)',
  PROCESSING = 'Centro de Processamento'
}

export enum LayoutType {
  COMPACT = 'Compacto (35m²)',
  LINEAR = 'Linear (45m²)',
  HUB = 'Hub (60m²)'
}

export interface Unit {
  id: string;
  name: string;
  address: string;
  city: string;
  type: UnitType;
  phone: string;
  hours: string;
  coordinates: { lat: number; lng: number };
  layoutType?: LayoutType;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'Sangue' | 'Imagem' | 'Checkup' | 'Outros' | 'Veterinário';
  price?: string;
  isJaja24h?: boolean;
}

export interface Checkup {
  id: string;
  name: string;
  exams: string[];
  description: string;
  price?: string;
  oldPrice?: string;
}

export interface ExamPrep {
  id: string;
  exam: string;
  instructions: string[];
  fasting?: string;
}

export interface ExamResult {
  id: string;
  name: string;
  status: 'Pronto' | 'Em Processamento';
  date: string;
  resultUrl?: string;
}

export interface PatientResult {
  protocol: string;
  password?: string;
  patientName: string;
  date: string;
  exams: ExamResult[];
  email?: string;
  phone?: string;
  notified?: boolean;
}
