
import { GoogleGenAI } from "@google/genai";
import { GenerationRequest } from "../types";

// In Vite, use import.meta.env
// Fallback to process.env for standard node environments if needed, but primarily support Vite structure
const apiKey = import.meta.env ? import.meta.env.VITE_API_KEY : process.env.API_KEY;

if (!apiKey) {
  console.error("API Key is missing. Ensure VITE_API_KEY is set in .env");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const generateOmniverseCode = async (request: GenerationRequest): Promise<string> => {
  const modelId = 'gemini-2.5-flash';

  // Check if this is a request for the specific Portfolio Project
  const isPortfolio = request.serviceId.includes('DevOmniverse');

  const systemPrompt = `
    You are the "DevOmniverse Engine", a proprietary Enterprise Architecture Generator.
    
    TASK: Generate a production-ready, multi-file project structure.
    
    CONTEXT:
    - Domain: ${request.domainId}
    - Microservice: ${request.serviceId}
    - Stack: ${request.languageId}
    - Version: ${request.version}
    - Component: ${request.componentId || 'Standard Library'}

    ${isPortfolio ? `
    ================================================================================
    CRITICAL INSTRUCTION: PORTFOLIO PROJECT GENERATION MODE
    ================================================================================
    The user is generating the "Universal Service Registry & Code Generator" (DevOmniverse).
    You MUST generate a COMPLETE, SECURE, FULL-STACK solution that runs "AS IS" via Docker.

    ARCHITECTURE:
    1. Backend: Java 17+, Spring Boot 3.2+ (Maven).
    2. Frontend: React 18+, TypeScript, Vite, Tailwind CSS.
    3. Infrastructure: Docker (Multi-stage), Nginx (Reverse Proxy), Docker Compose.
    4. Database: PostgreSQL.

    SECURITY MANDATES (ZERO TOLERANCE - OWASP TOP 10):
    1. BACKEND (Spring Security 6):
       - Stateless Authentication with JWT (JSON Web Token).
       - Role-Based Access Control (RBAC) on ALL endpoints.
       - Password Hashing: BCrypt.
       - CorsConfiguration: Allow origin http://localhost (for local docker testing).
    2. DEVOPS (Hardened):
       - Nginx: "server_tokens off;", Force HTTPS, HSTS, CSP.
       - Docker: Run as non-root user (USER 1001).
       - Docker Compose: orchestrate 'backend', 'frontend' (nginx), and 'db' (postgres).

    ********************************************************************************
    REQUIRED FILES - GENERATE IN THIS EXACT ORDER (INFRASTRUCTURE FIRST):
    ********************************************************************************
    
    1. README.md (Detailed instructions: 'docker-compose up --build')
    2. docker-compose.yml (Define services: 'backend', 'frontend', 'db'. Backend must wait for DB.)
    3. backend/Dockerfile (Multi-stage: Build with Maven, Run with eclipse-temurin:17-jre-alpine. Create non-root user.)
    4. frontend/Dockerfile (Multi-stage: Build Node.js, Copy build to nginx:alpine. Config Nginx.)
    5. nginx/nginx.conf (Reverse proxy '/api/' -> 'http://backend:8080'. Serve '/' -> /usr/share/nginx/html. Add Security Headers.)
    
    6. backend/pom.xml (Dependencies: web, security, data-jpa, postgresql, jjwt, lombok)
    7. backend/src/main/resources/application.properties (DB URL: jdbc:postgresql://db:5432/devomniverse)
    8. backend/src/main/java/com/devomniverse/DevOmniverseApplication.java
    9. backend/src/main/java/com/devomniverse/config/SecurityConfig.java (JWT Filter chain)
    10. backend/src/main/java/com/devomniverse/controller/AuthController.java
    
    11. frontend/package.json
    12. frontend/vite.config.ts (Server proxy: '/api' -> target: 'http://backend:8080')
    13. frontend/src/App.tsx (Main layout)
    14. frontend/src/services/api.ts (Axios instance)

    DO NOT SKIP ANY FILES. DO NOT BE LAZY. GENERATE FULL CONTENT FOR ALL 14 FILES.

    ` : `
    GENERAL GENERATION RULES:
    1. STRICTLY adhere to ${request.languageId} best practices.
    2. Implement strict input validation and error handling.
    3. Include extensive Javadoc/Comments explaining the architecture.
    `}
    
    OUTPUT FORMAT (STRICT):
    Use the following delimiters for every file. Do not wrap in markdown code blocks.
    
    <<<<FILE: path/to/filename.ext>>>>
    [Source Code Content]
    <<<<ENDFILE>>>>
    
    <<<<FILE: another/file.ext>>>>
    [Source Code Content]
    <<<<ENDFILE>>>>
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: request.prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1, // Highly deterministic for code
        maxOutputTokens: 20000, // Maximized for full project generation
      }
    });

    return response.text || "// Error: Module generation failed. Retry.";
  } catch (error) {
    console.error("Engine Error:", error);
    return `<<<<FILE: error.log>>>>\nError generating module: ${error instanceof Error ? error.message : 'Unknown internal error'}\n<<<<ENDFILE>>>>`;
  }
};
