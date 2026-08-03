import React, { useState, useRef, useEffect } from 'react';
import { 
  IconChat, 
  IconSend, 
  IconSparkles, 
  IconUser, 
  IconRotateCcw, 
  IconRefreshCw 
} from './CustomIcons';
import { getAICounselorResponse } from '../services/aiCounselor';
import { getActiveUserProfile, getSavedJournals, saveJournalEntry } from '../services/storage';
import { UserProfile } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AICounselorModalProps {
  onClose?: () => void;
}

// Custom Markdown Formatter for AI Counselor Messages (No raw asterisks **, proper lists & bold text)
const parseInlineFormatting = (text: string, isUserMessage: boolean) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return (
        <strong 
          key={idx} 
          className={
            isUserMessage
              ? 'font-black underline decoration-white/50'
              : 'font-black text-slate-900 bg-rose-50/90 px-1 py-0.5 rounded border border-rose-200/70'
          }
        >
          {boldText}
        </strong>
      );
    }
    return part;
  });
};

const renderFormattedText = (content: string, isUserMessage: boolean) => {
  if (!content) return null;

  // Split content into paragraphs
  const paragraphs = content.split(/\n\n+/);

  return (
    <div className="space-y-2">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n');

        // Check if all non-empty lines in paragraph are list items
        const isList = lines.filter((l) => l.trim()).length > 0 && lines.every((line) => {
          const trimmed = line.trim();
          return (
            !trimmed ||
            trimmed.startsWith('- ') ||
            trimmed.startsWith('* ') ||
            /^\d+[\.\)]\s/.test(trimmed)
          );
        });

        if (isList) {
          return (
            <ul key={pIdx} className="space-y-1.5 my-1.5 pl-0.5">
              {lines.map((line, lIdx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;

                const cleanLine = trimmed
                  .replace(/^[-*]\s+/, '')
                  .replace(/^\d+[\.\)]\s+/, '');

                return (
                  <li key={lIdx} className="flex items-start gap-2 text-xs leading-relaxed">
                    <span 
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                        isUserMessage ? 'bg-white' : 'bg-rose-500'
                      }`}
                    ></span>
                    <span className="flex-1">{parseInlineFormatting(cleanLine, isUserMessage)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        return (
          <p key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {parseInlineFormatting(line, isUserMessage)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export const AICounselorModal: React.FC<AICounselorModalProps> = ({ onClose }) => {
  const [activeUser, setActiveUser] = useState<UserProfile | null>(() => getActiveUserProfile());
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      sender: 'ai',
      text: `Peue haba, Sahabat Jeumpa! 👋 Saya Si Jeumpa, teman curhat setia siswi anak sulung SMAN Modal Bangsa Aceh. Apa yang sedang membebani pikiran atau membuatmu lelah hari ini? Ceritakan saja, Si Jeumpa siap mendengarkan tanpa menghakimi. 🌸`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync active user session
  useEffect(() => {
    const syncUser = () => {
      setActiveUser(getActiveUserProfile());
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for API
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          parts: [{ text: m.text }],
        }));

      const aiReplyText = await getAICounselorResponse(text.trim(), history);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Save journal entry automatically to CBT Journal padlet
      saveJournalEntry({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        studentName: activeUser?.name || 'Siswi',
        curhatan: text.trim(),
        saranPositif: aiReplyText,
      });
    } catch (error) {
      console.error('Error sending AI counselor message:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Maaf Sahabat Jeumpa, koneksi Si Jeumpa sedang terganggu sejenak. Tetap semangat dan coba kirim pesanmu sekali lagi ya! 🌸',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `Peue haba, Sahabat Jeumpa! 👋 Saya Si Jeumpa, teman curhat setia siswi anak sulung SMAN Modal Bangsa Aceh. Apa yang sedang membebani pikiran atau membuatmu lelah hari ini? Ceritakan saja, Si Jeumpa siap mendengarkan tanpa menghakimi. 🌸`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const QUICK_PROMPTS = [
    'Aku capek banget malam ini...',
    'Gimana cara ngomong ke ortu mau belajar?',
    'Aku merasa bersalah kalau istirahat',
    'Adik rewel terus pas aku lagi belajar',
  ];

  return (
    <div className="fixed top-16 sm:top-20 bottom-4 sm:bottom-6 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-96 max-h-[calc(100vh-84px)] bg-white rounded-3xl border border-rose-200 shadow-2xl z-[999] flex flex-col overflow-hidden animate-fade-in">
      {/* Header Widget */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 p-3.5 sm:p-4 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white/80 shadow-xs flex-shrink-0 bg-white">
            <img
              src="/assets/mascot_si_jeumpa_aceh.jpg"
              alt="Maskot Si Jeumpa AI"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-base">Si Jeumpa AI</h2>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[9px] font-extrabold backdrop-blur-md">
                {activeUser ? `Profil: ${activeUser.name}` : 'TemanSulung AI'}
              </span>
            </div>
            <p className="text-[11px] text-purple-100 font-medium">Teman curhat setia anak sulung perempuan</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              onClick={handleClearChat}
              title="Bersihkan Histori Chat"
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-extrabold flex items-center gap-1 transition-all"
            >
              <IconRotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm transition-all"
              aria-label="Tutup Chat"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 no-scrollbar min-h-[300px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full overflow-hidden border border-rose-200 flex-shrink-0 mt-0.5 shadow-2xs">
                <img
                  src="/assets/mascot_si_jeumpa_aceh.jpg"
                  alt="Avatar Si Jeumpa"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                msg.sender === 'user'
                  ? 'bg-rose-500 text-white rounded-tr-none shadow-2xs'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-2xs'
              }`}
            >
              {renderFormattedText(msg.text, msg.sender === 'user')}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                <IconUser className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 text-xs text-purple-600 font-bold items-center bg-white p-2.5 rounded-xl border border-purple-100 inline-flex shadow-2xs">
            <IconRefreshCw className="w-4 h-4 animate-spin text-purple-500" />
            <span>Si Jeumpa sedang memikirkan jawaban hangat...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompts & Input Area */}
      <div className="p-3 bg-white border-t border-rose-100 space-y-2">
        {/* Quick Suggestion Chips */}
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            💡 Rekomendasi Pertanyaan (Geser/Klik):
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px] border border-rose-200/70 transition-all flex-shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input & Submit Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 pt-1"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tulis curhatanmu ke Si Jeumpa..."
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-9 h-9 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 flex-shrink-0"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
