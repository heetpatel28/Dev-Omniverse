
import React, { useState, useEffect } from 'react';
import { SERVICES, LANGUAGES } from '../data/constants';
import { DomainId, ServiceItem, Language, GeneratedFile } from '../types';
import { generateOmniverseCode } from '../services/geminiService';
import { Search, Play, Copy, Check, Terminal, Loader2, ChevronDown, Code, FileCode, Server, Database, Layers, Download, FileText } from 'lucide-react';
import JSZip from 'jszip';

interface CodeGeneratorProps {
  domainId: DomainId;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ domainId }) => {
  // --- Data State ---
  const [services, setServices] = useState<ServiceItem[]>([]);
  
  // --- Selection State (Cascading) ---
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedStack, setSelectedStack] = useState<Language | null>(null);
  const [selectedCoreLang, setSelectedCoreLang] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');

  // --- UI State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [prompt, setPrompt] = useState('');
  
  // --- Output State ---
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // --- Initialization ---
  useEffect(() => {
    const domainServices = SERVICES[domainId] || [];
    setServices(domainServices);
    resetForm();
  }, [domainId]);

  const resetForm = () => {
    setSelectedService(null);
    setSelectedStack(null);
    setSelectedCoreLang('');
    setSelectedComponent('');
    setSelectedVersion('');
    setSearchQuery('');
    setGeneratedFiles([]);
    setPrompt('');
    setActiveFileIndex(0);
  };

  // --- Handlers ---

  // Step 1: Service Selection
  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setSearchQuery(service.name);
    setIsSearchFocused(false);
    
    // Reset subsequent steps
    setSelectedStack(null);
    setSelectedCoreLang('');
    setSelectedComponent('');
    setSelectedVersion('');
    setGeneratedFiles([]);

    // Auto-suggest Stack (Step 2)
    if (service.defaultLanguage && LANGUAGES[service.defaultLanguage]) {
      const suggestedStack = LANGUAGES[service.defaultLanguage];
      handleSelectStack(suggestedStack);
    }

    setPrompt(`Generate the ${service.name} microservice. \n\nRequirements:\n- Production-ready implementation\n- Include extensive JavaDocs/Comments\n- Follow Enterprise Design Patterns`);
  };

  // Step 2: Stack Selection
  const handleSelectStack = (stack: Language) => {
    setSelectedStack(stack);
    // Reset subsequent steps
    setSelectedCoreLang(stack.coreLanguage || ''); // Auto-select core if only one implies
    setSelectedComponent('');
    setSelectedVersion(stack.defaultVersion);
  };

  // Step 3: Core Language Selection
  const handleSelectCore = (core: string) => {
    setSelectedCoreLang(core);
    setSelectedComponent(''); 
  };

  // Step 4: Component Selection
  const handleSelectComponent = (comp: string) => {
    setSelectedComponent(comp);
  };

  // Step 5: Version Selection
  const handleSelectVersion = (ver: string) => {
    setSelectedVersion(ver);
  };

  // --- Generation Logic ---
  const parseResponse = (responseText: string): GeneratedFile[] => {
    const fileRegex = /<<<<FILE: (.*?)>>>>([\s\S]*?)<<<<ENDFILE>>>>/g;
    const files: GeneratedFile[] = [];
    let match;
    
    while ((match = fileRegex.exec(responseText)) !== null) {
      if (match[1] && match[2]) {
        files.push({ 
          name: match[1].trim(), 
          content: match[2].trim() 
        });
      }
    }

    // Fallback if regex fails (legacy or error format)
    if (files.length === 0) {
      files.push({
        name: 'output.txt',
        content: responseText
      });
    }
    
    return files;
  };

  const handleGenerate = async () => {
    if (!selectedService || !selectedStack) return;

    setIsGenerating(true);
    setGeneratedFiles([]);

    try {
      const rawResponse = await generateOmniverseCode({
        domainId,
        serviceId: selectedService.name,
        languageId: selectedStack.name,
        componentId: selectedComponent,
        version: selectedVersion,
        prompt
      });
      
      const files = parseResponse(rawResponse);
      setGeneratedFiles(files);
      setActiveFileIndex(0);

    } catch (e) {
      setGeneratedFiles([{
        name: 'error.log',
        content: "// System Error: Code generation module unreachable."
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedFiles.length === 0) return;
    const content = generatedFiles[activeFileIndex]?.content || '';
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    if (generatedFiles.length === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      
      // Add files to zip
      generatedFiles.forEach(file => {
        // Sanitize filename (remove leading ./ or /)
        const cleanName = file.name.replace(/^\.?\//, '');
        zip.file(cleanName, file.content);
      });

      // Generate blob
      const blob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedService?.name.replace(/\s+/g, '_').toLowerCase() || 'project'}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error("Failed to zip files", error);
    } finally {
      setIsZipping(false);
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to get all available stacks for dropdown
  const allStacks = Object.values(LANGUAGES);
  
  // Helpers for Dropdown Options (Cascading Logic)
  const coreOptions = selectedStack ? (selectedStack.coreLanguage ? [selectedStack.coreLanguage] : []) : [];
  const componentOptions = selectedStack?.components || [];
  const versionOptions = selectedStack?.versions || [];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 overflow-hidden">
      {/* Configuration Toolbar */}
      <div className="border-b border-slate-800 p-6 flex flex-col gap-5 bg-slate-900/50 backdrop-blur-sm z-30 shadow-xl shrink-0">
        
        {/* Step 1: Service Selection (Full Width) */}
        <div className="relative z-50 w-full">
            <label className="block text-xs font-bold text-blue-400 mb-1.5 uppercase tracking-wider">
              Step 1: Select Microservice
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-text shadow-sm"
                placeholder="Search industry-standard services (e.g., 'Payment Gateway')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => setIsSearchFocused(true)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                autoComplete="off"
              />
              
              {isSearchFocused && (
                <div className="absolute mt-1 w-full max-h-[400px] overflow-y-auto bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 custom-scrollbar">
                  {filteredServices.length > 0 ? filteredServices.map(service => (
                    <button
                      key={service.id}
                      onClick={() => handleSelectService(service)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-blue-600/20 hover:text-blue-300 transition-colors border-b border-slate-700/50 last:border-0 flex justify-between items-center group"
                    >
                      <span className="font-medium text-slate-200 group-hover:text-white">{service.name}</span>
                      {service.defaultLanguage && (
                        <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700/50">
                          {service.defaultLanguage}
                        </span>
                      )}
                    </button>
                  )) : (
                    <div className="px-4 py-3 text-sm text-slate-500">No services found.</div>
                  )}
                </div>
              )}
            </div>
        </div>

        {/* Steps 2-5: Cascading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-1">
          
          {/* Step 2: Language Stack */}
          <div className="relative z-40 opacity-100 transition-opacity">
            <label className={`block text-[10px] font-bold mb-1.5 uppercase tracking-wider ${selectedService ? 'text-blue-400' : 'text-slate-600'}`}>
              Step 2: Tech Stack
            </label>
            <div className="relative">
              <select
                disabled={!selectedService}
                className="block w-full pl-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                value={selectedStack?.id || ''}
                onChange={(e) => handleSelectStack(LANGUAGES[e.target.value])}
              >
                <option value="" disabled>Select Stack...</option>
                {allStacks.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Step 3: Core Language */}
          <div className="relative z-30">
             <label className={`block text-[10px] font-bold mb-1.5 uppercase tracking-wider ${selectedStack ? 'text-blue-400' : 'text-slate-600'}`}>
               Step 3: Core Language
             </label>
             <div className="relative">
               <select
                  disabled={!selectedStack}
                  className="block w-full pl-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  value={selectedCoreLang}
                  onChange={(e) => handleSelectCore(e.target.value)}
               >
                  <option value="" disabled>Select Core...</option>
                  {coreOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
               </select>
               <Code className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
             </div>
          </div>

          {/* Step 4: Component */}
          <div className="relative z-20">
             <label className={`block text-[10px] font-bold mb-1.5 uppercase tracking-wider ${selectedCoreLang ? 'text-blue-400' : 'text-slate-600'}`}>
               Step 4: Component
             </label>
             <div className="relative">
               <select
                  disabled={!selectedCoreLang}
                  className="block w-full pl-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  value={selectedComponent}
                  onChange={(e) => handleSelectComponent(e.target.value)}
               >
                  <option value="" disabled>Select Component...</option>
                  {componentOptions.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
               </select>
               <Layers className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
             </div>
          </div>

          {/* Step 5: Version */}
          <div className="relative z-10">
            <label className={`block text-[10px] font-bold mb-1.5 uppercase tracking-wider ${selectedComponent ? 'text-blue-400' : 'text-slate-600'}`}>
              Step 5: Version
            </label>
            <div className="relative">
              <select
                disabled={!selectedComponent}
                className="block w-full pl-3 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                value={selectedVersion}
                onChange={(e) => handleSelectVersion(e.target.value)}
              >
                <option value="" disabled>Select Version...</option>
                {versionOptions.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        
        {/* Left: Prompt Input */}
        <div className="lg:w-1/3 border-r border-slate-800 flex flex-col bg-slate-900/30 overflow-hidden">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
             <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
               <Terminal className="w-4 h-4 text-blue-400" />
               Engine Configuration
             </h3>
             <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 border border-slate-700">Internal Use Only</span>
          </div>
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
             <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 shrink-0">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Server className="w-3 h-3" /> Target Manifest
                </h4>
                <ul className="text-sm space-y-2 text-slate-300 font-mono text-xs">
                  <li className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500">Service:</span> 
                    <span className="text-blue-300 text-right truncate max-w-[150px]">{selectedService?.name || 'Pending...'}</span>
                  </li>
                  <li className="flex justify-between pt-1">
                    <span className="text-slate-500">Core:</span> 
                    <span className="text-emerald-400">{selectedCoreLang || '-'}</span>
                  </li>
                  <li className="flex justify-between pt-1">
                    <span className="text-slate-500">Lib:</span> 
                    <span className="text-slate-300 truncate max-w-[150px]">{selectedComponent || '-'}</span>
                  </li>
                  <li className="flex justify-between pt-1">
                    <span className="text-slate-500">Ver:</span> 
                    <span className="text-slate-300">{selectedVersion || '-'}</span>
                  </li>
                </ul>
             </div>

             <div className="flex-1 flex flex-col min-h-[120px]">
               <label className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
                 <Code className="w-3 h-3" /> Implementation Constraints
               </label>
               <textarea 
                 className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-sm font-mono text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none leading-relaxed"
                 placeholder="Define specific patterns (e.g., 'Use Lombok', 'Implement Strategy Pattern')..."
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
               />
             </div>
          </div>
          <div className="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedVersion}
              className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold transition-all border
                ${isGenerating || !selectedVersion
                  ? 'bg-slate-800 text-slate-500 border-slate-800 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)] active:scale-[0.98]'
                }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Artifact...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Generate Source Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Code Output (Tabbed Interface) - Relative parent for absolute footer */}
        <div className="flex-1 flex flex-col bg-[#0d1117] relative min-h-0">
          
          {/* Tabs & Actions Header */}
          <div className="h-12 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-2 shrink-0 z-20">
             <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar h-full max-w-[70%]">
               {generatedFiles.length > 0 ? (
                 generatedFiles.map((file, idx) => (
                   <button
                     key={idx}
                     onClick={() => setActiveFileIndex(idx)}
                     className={`flex items-center gap-2 px-4 h-full text-xs font-mono border-b-2 transition-colors whitespace-nowrap
                       ${activeFileIndex === idx 
                         ? 'border-blue-500 text-white bg-slate-800' 
                         : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                       }`}
                   >
                     <FileText className="w-3 h-3" />
                     {file.name}
                   </button>
                 ))
               ) : (
                 <span className="px-4 text-xs text-slate-500 font-mono flex items-center gap-2 uppercase tracking-wide">
                   <Server className="w-3 h-3" /> Awaiting Generation
                 </span>
               )}
             </div>

             <div className="flex items-center gap-2 shrink-0">
               {generatedFiles.length > 0 && (
                   <button 
                     onClick={handleCopy}
                     className="text-xs flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors px-2 py-1.5 rounded hover:bg-slate-800"
                   >
                     {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                   </button>
               )}
             </div>
          </div>

          {/* Editor Content - Added pb-24 for footer clearance */}
          <div className="flex-1 overflow-auto relative custom-scrollbar bg-[#0d1117] pb-24">
            {generatedFiles.length > 0 ? (
              <pre className="p-6 text-sm font-mono leading-relaxed">
                <code className="text-blue-100/90 whitespace-pre-wrap">
                  {generatedFiles[activeFileIndex]?.content}
                </code>
              </pre>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 opacity-50">
                <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 stroke-[1.5]" />
                </div>
                <p className="text-sm font-mono tracking-widest uppercase">Select Config & Generate</p>
                <p className="text-xs text-slate-600 mt-2">Ready for deployment</p>
              </div>
            )}
          </div>

          {/* Footer - Download Button (Absolute Positioned for reliability) */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800 bg-slate-900 flex justify-center items-center z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
            <button 
              onClick={handleDownloadZip}
              disabled={isZipping || generatedFiles.length === 0 || isGenerating}
              className={`
                flex items-center gap-3 px-8 py-3 rounded-lg font-bold text-sm transition-all w-full md:w-auto justify-center
                ${generatedFiles.length > 0 && !isGenerating
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 active:scale-[0.98]' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                }
              `}
            >
              {isZipping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {isZipping ? "Compressing Archive..." : "Download Project as ZIP"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
