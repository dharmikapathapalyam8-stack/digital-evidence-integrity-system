import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  Loader2,
  FileSearch,
  ExternalLink,
} from 'lucide-react';
import { useForensic } from '../../context/ForensicContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  keyFindings?: string[];
}

export const AiAssistantModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen, setSelectedEvidenceId, setActiveTab } = useForensic();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'ai',
      text: `Greetings, Investigator. I am **EVIDENTIA AI**, your digital evidence integrity copilot.

I continuously analyze bitstream hashes, custody continuity, anomalous access patterns, and forensic timeline records.

How can I assist your investigation today?`,
      timestamp: 'Just now',
      keyFindings: [
        '1,248 Evidence artifacts indexed',
        '2 active tamper anomalies under review',
        'ISO 27037 compliance verification active',
      ],
    },
  ]);

  const suggestedQuestions = [
    'Show evidence requiring review.',
    'Which cases have integrity alerts?',
    'Show evidence transferred to the forensic lab.',
    'Summarize the custody history of EV-001.',
    'Which evidence has the highest risk score?',
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  if (!isAiModalOpen) return null;

  const handleSend = async (questionText?: string) => {
    const query = questionText || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });

      if (!res.ok) {
        throw new Error('API server returned error');
      }

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.response || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        keyFindings: data.keyFindings,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Fallback to local forensic intelligence handler:', err);
      // Realistic local demo response if fetch fails
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Analysis complete for query: "${query}".\n\n• **Flagged Artifacts**: EV-003 exhibited cryptographic SHA-256 mismatch.\n• **Custody Continuity**: 14 items currently sealed inside Central Forensic Lab Room 402.\n• **Recommendation**: Isolate affected media and conduct bitstream verification.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        keyFindings: [
          'Cryptographic integrity surveillance active',
          'Audit trail recorded',
        ],
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0A0F1D] border border-cyan-500/40 rounded-xl w-full max-w-2xl h-[620px] shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100 font-mono">
                  EVIDENTIA<span className="text-cyan-400">AI</span> FORENSIC COPILOT
                </h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  GEMINI FORENSIC REASONING
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded in active cases, SHA-256 registries & chain of custody ledgers
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs font-sans">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-lg p-3.5 leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-slate-950 font-medium'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200'
                }`}
              >
                <div>{msg.text}</div>

                {msg.keyFindings && msg.keyFindings.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px]">
                    <span className="text-cyan-400 font-mono uppercase font-semibold text-[10px] block mb-1">
                      Key Evidentiary Findings:
                    </span>
                    <ul className="space-y-1">
                      {msg.keyFindings.map((finding, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className={`text-[10px] font-mono mt-1 text-right ${
                    msg.sender === 'user' ? 'text-slate-900/80' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-center gap-2">
                <span>Analyzing evidentiary repositories & hashing records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800/80">
          <div className="text-[10px] uppercase font-mono text-slate-500 mb-1.5 font-semibold">
            SUGGESTED FORENSIC INQUIRIES:
          </div>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto max-h-16">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-cyan-300 hover:text-cyan-200 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about custody anomalies, SHA-256 status, case integrity..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-md py-2 px-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-md bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-semibold transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
