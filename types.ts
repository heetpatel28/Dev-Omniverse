
export type DomainId = 
  | 'software-dev' 
  | 'cloud' 
  | 'data-science' 
  | 'security' 
  | 'ai-ml' 
  | 'infra' 
  | 'emerging-tech';

export interface Domain {
  id: DomainId;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultLanguage?: string; // Added to suggest language
}

export type LanguageType = 'core' | 'stack' | 'infra' | 'mobile' | 'data' | 'specialized';

export interface Language {
  id: string;
  name: string;
  type: LanguageType;
  versions: string[];
  defaultVersion: string;
  coreLanguage?: string; // e.g., "JavaScript"
  components?: string[];   // Changed from string to string[] for dropdown selection
}

export interface GenerationRequest {
  domainId: DomainId;
  serviceId: string;
  languageId: string;
  componentId?: string; // Added to track specific component selection
  version: string;
  prompt: string;
}

export interface GeneratedFile {
  name: string;
  content: string;
  language?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isCode?: boolean;
}