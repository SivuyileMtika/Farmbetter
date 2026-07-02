import React from 'react';
import { Terminal, Download, ShieldCheck, Trash2 } from 'lucide-react';

interface TerminalLogsProps {
  logs: string[];
  onClearLogs: () => void;
  userEmail?: string;
  userLocation?: string;
}

const COLORS = {
  forest: "#1F4D36",
  forestDark: "#123425",
  soil: "#A9552E",
  soilDark: "#7C3D20",
  gold: "#E3A23C",
  goldDark: "#B87A24",
  cream: "#F7F4EC",
  card: "#FFFFFF",
  charcoal: "#22261F",
  ink: "#4A5147",
  sage: "#92A88C",
  sageLight: "#DCE6D6",
  line: "#E4E0D3",
  danger: "#B84A3A",
};

export default function TerminalLogs({ logs, onClearLogs, userEmail, userLocation }: TerminalLogsProps) {
  
  const handleDownloadLogs = () => {
    const header = `==================================================
AGRIAPP SECURE SESSION AUDIT LOG
Generated: ${new Date().toISOString()}
User Identity: ${userEmail || 'Anonymous Terminal'}
Station Location: ${userLocation || 'Default Region'}
System Status: NOMINAL
==================================================\n\n`;
    
    const logsContent = logs.join('\n');
    const blob = new Blob([header + logsContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agriapp_session_${Date.now()}.log`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#22261F] border border-[#E4E0D3] rounded-3xl overflow-hidden shadow-sm text-white font-mono text-xs">
      
      {/* Title bar */}
      <div className="bg-[#123425] border-b border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#92A88C]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#E3A23C]" />
          <span className="font-bold tracking-tight text-white font-serif">Secure Session Audit Log</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadLogs}
            disabled={logs.length === 0}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-semibold py-1.5 px-3 rounded-xl border border-white/15 cursor-pointer text-[10px] transition-all"
          >
            <Download className="w-3 h-3" />
            <span>DOWNLOAD</span>
          </button>
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1 bg-[#B84A3A]/20 hover:bg-[#B84A3A]/40 text-[#F6DEDA] font-semibold py-1.5 px-3 rounded-xl border border-[#B84A3A]/30 cursor-pointer text-[10px] transition-all"
          >
            <Trash2 className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Profile Bar */}
      <div className="p-3.5 bg-black/30 border-b border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px] text-[#92A88C]">
        <div>
          <span className="text-white/40 font-bold uppercase block text-[8px] tracking-wider">AUTHORIZED SIGNIN:</span>
          <span className="text-[#F7F4EC] truncate block font-semibold">{userEmail || 'GUEST USER'}</span>
        </div>
        <div>
          <span className="text-white/40 font-bold uppercase block text-[8px] tracking-wider">STATION PRESET:</span>
          <span className="text-[#F7F4EC] block font-semibold">{userLocation || 'NOT ASSIGNED'}</span>
        </div>
        <div>
          <span className="text-white/40 font-bold uppercase block text-[8px] tracking-wider">SECURE TRANSMISSION STATE:</span>
          <span className="text-[#E3A23C] font-bold block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E3A23C]" />
            <span>ENCRYPTED LOCAL SECURE LINK</span>
          </span>
        </div>
      </div>

      {/* Screen Log Thread */}
      <div className="p-4 bg-[#22261F] min-h-[280px] max-h-[350px] overflow-y-auto space-y-2">
        {logs.length === 0 ? (
          <div className="text-white/30 py-16 text-center select-none font-mono text-xs">
            No active terminal packets parsed. Initiate a live sensor scan or extract global agronomic bounds to log sessions.
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="flex gap-2 items-start py-0.5 font-mono text-[11px] tracking-tight hover:bg-white/5 px-1 rounded-lg">
              <span className="text-white/30 select-none">[{idx + 1}]</span>
              <span className="text-white/40 shrink-0">
                {new Date().toLocaleTimeString('en-ZA', { hour12: false })}
              </span>
              <span className={`font-semibold ${
                log.includes('SUCCESS') ? 'text-[#92A88C]' :
                log.includes('FAIL') || log.includes('ERROR') ? 'text-[#B84A3A]' :
                log.includes('START') || log.includes('REQUEST') ? 'text-[#E3A23C]' :
                'text-white/80'
              }`}>
                {log}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="bg-black/20 p-2.5 text-center text-[9px] text-[#92A88C] uppercase border-t border-white/5">
        Secure local sandbox transmission system. Complies with FAO Global metadata guidelines.
      </div>

    </div>
  );
}
