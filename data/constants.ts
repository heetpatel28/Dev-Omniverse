
import { Domain, ServiceItem, Language, DomainId } from '../types';

export const DOMAINS: Domain[] = [
  { id: 'software-dev', name: 'Software Development', icon: 'code', description: 'Full-stack, Mobile, and Backend patterns', color: 'text-blue-400' },
  { id: 'cloud', name: 'Cloud Computing', icon: 'cloud', description: 'AWS, Azure, GCP infrastructure', color: 'text-orange-400' },
  { id: 'data-science', name: 'Data Science', icon: 'database', description: 'ETL, Big Data, and Analytics', color: 'text-yellow-400' },
  { id: 'security', name: 'Cyber Security', icon: 'shield', description: 'Pentesting, Auth, and Compliance', color: 'text-red-400' },
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: 'cpu', description: 'NLP, Vision, and Robotics models', color: 'text-purple-400' },
  { id: 'infra', name: 'Infrastructure & DevOps', icon: 'server', description: 'SysAdmin, CI/CD, and Containers', color: 'text-green-400' },
  { id: 'emerging-tech', name: 'Emerging Tech', icon: 'zap', description: 'Blockchain, IoT, and AR/VR', color: 'text-pink-400' },
];

export const LANGUAGES: Record<string, Language> = {
  // --- Stack / Framework Specifics ---
  mern: { 
    id: 'mern', 
    name: 'MERN Stack', 
    type: 'stack', 
    coreLanguage: 'JavaScript',
    components: ['MongoDB Driver', 'Express.js', 'React.js', 'Node.js Runtime', 'Mongoose ODM'],
    versions: ['Node 20 / React 18', 'Node 18 / React 17', 'Legacy (Node 16)'], 
    defaultVersion: 'Node 20 / React 18' 
  },
  mean: { 
    id: 'mean', 
    name: 'MEAN Stack', 
    type: 'stack', 
    coreLanguage: 'JavaScript',
    components: ['MongoDB Driver', 'Express.js', 'Angular CLI', 'Node.js Runtime'],
    versions: ['Angular 17 / Node 20', 'Angular 16 / Node 18', 'Angular 15 / Node 18'], 
    defaultVersion: 'Angular 17 / Node 20' 
  },
  springboot: { 
    id: 'springboot', 
    name: 'Spring Boot', 
    type: 'stack', 
    coreLanguage: 'Java',
    components: ['Spring WebMVC', 'Spring Data JPA', 'Spring Security', 'Spring Cloud Netflix', 'Spring Boot Actuator'],
    versions: ['3.2.x (Java 21)', '3.1.x (Java 17)', '3.0.x (Java 17)', '2.7.x (Java 11)'], 
    defaultVersion: '3.2.x (Java 21)' 
  },
  dotnet: { 
    id: 'dotnet', 
    name: '.NET Core', 
    type: 'stack', 
    coreLanguage: 'C#',
    components: ['ASP.NET Core Web API', 'Entity Framework Core', 'Identity Server', 'Blazor Server'],
    versions: ['.NET 8 (LTS)', '.NET 7', '.NET 6 (LTS)', '.NET Framework 4.8'], 
    defaultVersion: '.NET 8 (LTS)' 
  },
  django: { 
    id: 'django', 
    name: 'Django', 
    type: 'stack', 
    coreLanguage: 'Python',
    components: ['Django REST Framework', 'Django ORM', 'Celery Task Queue', 'Gunicorn'],
    versions: ['Django 5.0 (Py 3.12)', 'Django 4.2 LTS', 'Django 3.2 LTS'], 
    defaultVersion: 'Django 5.0 (Py 3.12)' 
  },
  jamstack: { 
    id: 'jamstack', 
    name: 'JAMstack', 
    type: 'stack', 
    coreLanguage: 'TypeScript',
    components: ['Next.js Framework', 'Vercel Edge Functions', 'Headless CMS', 'Tailwind CSS'],
    versions: ['Next.js 14', 'Next.js 13', 'Gatsby 5'], 
    defaultVersion: 'Next.js 14' 
  },
  
  // --- Mobile Stacks ---
  flutter: { 
    id: 'flutter', 
    name: 'Flutter', 
    type: 'mobile', 
    coreLanguage: 'Dart',
    components: ['Flutter Material', 'Flutter Cupertino', 'Dart VM', 'Bloc State Management'],
    versions: ['3.19.x (Dart 3.3)', '3.16.x', '3.13.x'], 
    defaultVersion: '3.19.x (Dart 3.3)' 
  },
  android: { 
    id: 'android', 
    name: 'Android Native', 
    type: 'mobile', 
    coreLanguage: 'Kotlin',
    components: ['Jetpack Compose', 'Android SDK', 'Retrofit', 'Room Database'],
    versions: ['API 34 (Android 14)', 'API 33 (Android 13)', 'API 31 (Android 12)'], 
    defaultVersion: 'API 34 (Android 14)' 
  },
  swift: { 
    id: 'swift', 
    name: 'iOS Native', 
    type: 'mobile', 
    coreLanguage: 'Swift',
    components: ['SwiftUI', 'UIKit', 'Combine Framework', 'CoreData'],
    versions: ['Swift 5.10 (iOS 17)', 'Swift 5.9', 'Swift 5.7'], 
    defaultVersion: 'Swift 5.10 (iOS 17)' 
  },
  
  // --- Data & Scientific ---
  python_data: { 
    id: 'python_data', 
    name: 'Python Data Stack', 
    type: 'data', 
    coreLanguage: 'Python',
    components: ['Pandas', 'NumPy', 'Scikit-Learn', 'PyTorch', 'TensorFlow'],
    versions: ['Python 3.12', 'Python 3.11', 'Python 3.9'], 
    defaultVersion: 'Python 3.12' 
  },
  sql: { 
    id: 'sql', 
    name: 'SQL Database', 
    type: 'data', 
    coreLanguage: 'SQL',
    components: ['PostgreSQL Core', 'MySQL Engine', 'PL/pgSQL', 'Stored Procedures'],
    versions: ['PostgreSQL 16', 'MySQL 8.3', 'Oracle 21c'], 
    defaultVersion: 'PostgreSQL 16' 
  },

  // --- Core Languages (Generic) ---
  java: { 
    id: 'java', 
    name: 'Java SE', 
    type: 'core', 
    coreLanguage: 'Java',
    components: ['Java Development Kit (JDK)', 'Java Runtime (JRE)', 'Maven Build Tool', 'Gradle Build Tool'],
    versions: ['Java 21 (LTS)', 'Java 17 (LTS)', 'Java 11 (LTS)'], 
    defaultVersion: 'Java 21 (LTS)' 
  },
  python: { 
    id: 'python', 
    name: 'Python Core', 
    type: 'core', 
    coreLanguage: 'Python',
    components: ['Python Interpreter', 'Pip Package Manager', 'Virtualenv', 'AsyncIO'],
    versions: ['3.12', '3.11', '3.10'], 
    defaultVersion: '3.12' 
  },
  typescript: { 
    id: 'typescript', 
    name: 'TypeScript', 
    type: 'core', 
    coreLanguage: 'TypeScript',
    components: ['TSC Compiler', 'Type Definitions', 'ESLint', 'Prettier'],
    versions: ['5.3', '5.2', '5.0'], 
    defaultVersion: '5.3' 
  },
  go: { 
    id: 'go', 
    name: 'Go (Golang)', 
    type: 'core', 
    coreLanguage: 'Go',
    components: ['Go Runtime', 'Gin Web Framework', 'Echo Framework', 'Goroutines'],
    versions: ['1.22', '1.21', '1.20'], 
    defaultVersion: '1.22' 
  },
  
  // --- Infrastructure ---
  terraform: { 
    id: 'terraform', 
    name: 'Terraform', 
    type: 'infra', 
    coreLanguage: 'HCL',
    components: ['AWS Provider', 'Azure Provider', 'GCP Provider', 'Terraform CLI'],
    versions: ['1.7', '1.5+', '1.0'], 
    defaultVersion: '1.7' 
  },
  bash: { 
    id: 'bash', 
    name: 'Shell Scripting', 
    type: 'infra', 
    coreLanguage: 'Bash',
    components: ['Bash Shell', 'Zsh Shell', 'Cron Job', 'Systemd Unit'],
    versions: ['5.2', '4.4', 'POSIX'], 
    defaultVersion: '5.2' 
  },
  solidity: { 
    id: 'solidity', 
    name: 'Solidity', 
    type: 'specialized', 
    coreLanguage: 'Solidity',
    components: ['Smart Contract', 'OpenZeppelin Library', 'Hardhat Environment', 'Truffle Suite'],
    versions: ['0.8.24', '0.8.20', '0.7.x'], 
    defaultVersion: '0.8.24' 
  },
  yaml: { 
    id: 'yaml', 
    name: 'YAML Config', 
    type: 'infra', 
    coreLanguage: 'YAML', 
    components: ['Kubernetes Manifest', 'Docker Compose', 'Ansible Playbook', 'GitHub Actions'], 
    versions: ['1.2', '1.1'], 
    defaultVersion: '1.2' 
  },
};

// Helper to generate services
const createServices = (domainId: DomainId, items: { name: string, lang?: string }[]): ServiceItem[] => {
  return items.map((item, idx) => ({
    id: `${domainId}-${idx}`,
    name: item.name,
    category: domainId,
    description: `Generate ${item.name} module.`,
    defaultLanguage: item.lang
  }));
};

export const SERVICES: Record<DomainId, ServiceItem[]> = {
  'software-dev': createServices('software-dev', [
    // --- THIS PROJECT'S SOURCE CODE (For Portfolio) ---
    { name: 'DevOmniverse Complete Secure Platform', lang: 'springboot' },
    { name: 'DevOmniverse Backend API Service', lang: 'springboot' },
    { name: 'Service Discovery Server (Eureka)', lang: 'springboot' },
    { name: 'API Gateway Service', lang: 'springboot' },
    { name: 'Central Configuration Service', lang: 'springboot' },
    { name: 'Distributed Tracing Service', lang: 'springboot' },
    // --------------------------------------------------
    { name: 'User Authentication Service', lang: 'springboot' }, 
    { name: 'Identity Management Service', lang: 'springboot' }, 
    { name: 'Payment Processing Gateway', lang: 'springboot' },
    { name: 'Inventory Management Service', lang: 'springboot' }, 
    { name: 'Order Fulfillment Service', lang: 'springboot' }, 
    { name: 'Notification Dispatch Service', lang: 'springboot' },
    { name: 'Audit Logging Service', lang: 'springboot' },
    { name: 'Reporting & Analytics Service', lang: 'springboot' },
    { name: 'Customer Profile Service', lang: 'springboot' },
    { name: 'Product Catalog Service', lang: 'springboot' },
    { name: 'Search Engine Service', lang: 'springboot' },
    { name: 'Recommendation Engine', lang: 'python_data' },
    { name: 'Frontend Single Page Application', lang: 'mern' },
    { name: 'Mobile Application (iOS/Android)', lang: 'flutter' },
    { name: 'Admin Dashboard Portal', lang: 'jamstack' },
    { name: 'WebSocket Real-time Service', lang: 'springboot' },
    { name: 'Batch Processing Service', lang: 'springboot' },
  ]),
  'cloud': createServices('cloud', [
    { name: 'AWS Network Infrastructure (VPC)', lang: 'terraform' },
    { name: 'AWS Compute Cluster (EKS)', lang: 'terraform' },
    { name: 'AWS Serverless API (Lambda)', lang: 'typescript' },
    { name: 'AWS Storage Configuration (S3)', lang: 'terraform' },
    { name: 'Azure Active Directory Setup', lang: 'terraform' }, 
    { name: 'Azure Kubernetes Service (AKS)', lang: 'terraform' }, 
    { name: 'Azure Logic App Workflow', lang: 'yaml' },
    { name: 'GCP Cloud Run Service', lang: 'terraform' },
    { name: 'GCP Pub/Sub Messaging', lang: 'terraform' },
    { name: 'Container Registry Setup', lang: 'terraform' },
    { name: 'Load Balancer Configuration', lang: 'terraform' },
    { name: 'CDN Distribution Config', lang: 'terraform' },
  ]),
  'data-science': createServices('data-science', [
    { name: 'ETL Pipeline Orchestrator', lang: 'python_data' }, 
    { name: 'Data Warehouse Schema', lang: 'sql' }, 
    { name: 'Real-time Stream Processor', lang: 'java' },
    { name: 'Predictive Analytics Model', lang: 'python_data' },
    { name: 'Customer Churn Model', lang: 'python_data' },
    { name: 'Fraud Detection Engine', lang: 'python_data' },
    { name: 'Data Visualization Dashboard', lang: 'python_data' }, 
    { name: 'Big Data Batch Job', lang: 'python_data' },
  ]),
  'security': createServices('security', [
    { name: 'OAuth2 Authorization Server', lang: 'springboot' }, 
    { name: 'Key Management Service', lang: 'springboot' }, 
    { name: 'Web Application Firewall Rules', lang: 'bash' },
    { name: 'Intrusion Detection System', lang: 'python' },
    { name: 'Security Information Event Mgmt', lang: 'python' },
    { name: 'Penetration Testing Suite', lang: 'python' }, 
    { name: 'Vulnerability Scanner', lang: 'python' }, 
    { name: 'Zero Trust Network Policy', lang: 'terraform' },
  ]),
  'ai-ml': createServices('ai-ml', [
    { name: 'Large Language Model Chain', lang: 'python_data' }, 
    { name: 'Computer Vision Inference', lang: 'python_data' }, 
    { name: 'Natural Language Processor', lang: 'python_data' }, 
    { name: 'Chatbot Conversational Agent', lang: 'python_data' },
    { name: 'Speech-to-Text Transcriber', lang: 'python_data' }, 
    { name: 'Reinforcement Learning Agent', lang: 'python_data' },
  ]),
  'infra': createServices('infra', [
    { name: 'CI/CD Pipeline Configuration', lang: 'yaml' }, 
    { name: 'Container Orchestration Manifest', lang: 'yaml' }, 
    { name: 'Infrastructure as Code State', lang: 'terraform' },
    { name: 'Reverse Proxy Configuration', lang: 'bash' }, 
    { name: 'System Monitoring Agent', lang: 'bash' },
    { name: 'Log Aggregation Service', lang: 'yaml' }, 
    { name: 'Backup & Recovery Script', lang: 'bash' },
  ]),
  'emerging-tech': createServices('emerging-tech', [
    { name: 'Smart Contract (Token)', lang: 'solidity' }, 
    { name: 'Decentralized App Backend', lang: 'solidity' }, 
    { name: 'IoT Device Firmware', lang: 'python' }, 
    { name: 'IoT Telemetry Ingestor', lang: 'python' },
    { name: 'Blockchain Consensus Node', lang: 'go' },
  ]),
};

export const INITIAL_PROMPT = "Select a microservice to begin architecture generation.";
