import React from 'react';
import { DOMAINS } from '../data/constants';
import { DomainId } from '../types';
import { 
  Code, Cloud, Database, Shield, Cpu, Server, Zap, Layout, Lock, Layers
} from 'lucide-react';

interface SidebarProps {
  selectedDomain: DomainId;
  onSelectDomain: (id: DomainId) => void;
}

const IconMap: Record<string, React.FC<any>> = {
  'code': Code,
  'cloud': Cloud,
  'database': Database,
  'shield': Shield,
  'cpu': Cpu,
  'server': Server,
  'zap': Zap
};

export const Sidebar: React.FC<SidebarProps> = ({ selectedDomain, onSelectDomain }) => {
  return (
    <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0 transition-all duration-300 z-50">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800 bg-slate-900">
        <Layers className="w-8 h-8 text-blue-500 mr-0 lg:mr-3" />
        <div className="hidden lg:block">
          <span className="font-bold text-xl tracking-tight text-white block">DevOmniverse</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Platform v2.4</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-2 px-2 custom-scrollbar">
        {DOMAINS.map((domain) => {
          const Icon = IconMap[domain.icon];
          const isSelected = selectedDomain === domain.id;
          
          return (
            <button
              key={domain.id}
              onClick={() => onSelectDomain(domain.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group relative
                ${isSelected 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
            >
              {isSelected && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
              )}
              <div className={`p-1 rounded-md transition-colors ${isSelected ? 'bg-blue-500/20' : 'bg-slate-800 group-hover:bg-slate-700'}`}>
                <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
              </div>
              <div className="hidden lg:block ml-3 text-left">
                <p className={`text-sm font-medium ${isSelected ? 'text-blue-400' : 'text-slate-300'}`}>
                  {domain.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate w-32">
                  {domain.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 hidden lg:block bg-slate-900">
        <div className="bg-slate-800/30 rounded-lg p-3 border border-slate-700/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">System Status</p>
          <p className="text-xs font-bold text-emerald-400 flex items-center gap-2">
            <Lock className="w-3 h-3" />
            Connected (Secure)
          </p>
          <div className="mt-2 w-full bg-slate-700/50 h-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-3/4"></div>
          </div>
          <p className="text-[9px] text-slate-500 mt-1 text-right">Load: 34ms</p>
        </div>
      </div>
    </aside>
  );
};