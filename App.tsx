import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CodeGenerator } from './components/CodeGenerator';
import { DomainId } from './types';

export default function App() {
  const [selectedDomain, setSelectedDomain] = useState<DomainId>('software-dev');

  return (
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar 
        selectedDomain={selectedDomain} 
        onSelectDomain={setSelectedDomain} 
      />
      <main className="flex-1 flex flex-col h-full min-w-0">
        <CodeGenerator domainId={selectedDomain} />
      </main>
    </div>
  );
}