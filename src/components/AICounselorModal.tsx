import React, { useState, useRef, useEffect } from 'react';
import { IconSend, IconRefreshCw, IconUser, IconRotateCcw } from './CustomIcons';
import { getTemanCurhatResponse, SimpleAIResponse } from '../services/aiCounselor';
import { 
  saveJournalEntry, 
  getSavedChatMessages, 
  saveChatMessages, 
  ChatMessage, 
  getActiveUserProfile 
} from '../services/storage';

interface AICounselorModalProps {
  onClose?: () => void;
}

export const AICounselorModal: React.FC<AICounselorModalProps> = ({ onClose }) => {
  const activeUser = getActiveUserProfile();
  const [messages, setMessages] = useState<ChatMessage[]>(() => getSavedChatMessages());
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setMessages(getSavedChatMessages());
  }, [activeUser?.name]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
    };

    const updatedWithUser = [...messages, userMsg];
    setMessages(updatedWithUser);
    saveChatMessages(updatedWithUser);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res: SimpleAIResponse = await getTemanCurhatResponse(query);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: `${res.pesanHangat}\n\n💡 Tips dari Si Jeumpa: ${res.saranPraktis}\n\n✨ ${res.kataSemangat}`,
      };

      const updatedWithAI = [...updatedWithUser, aiMsg];
      setMessages(updatedWithAI);
      saveChatMessages(updatedWithAI);

      saveJournalEntry({
        id: `jrn_${Date.now()}`,
        date: new Date().toISOString(),
        studentName: activeUser ? activeUser.name : 'Penguji',
        curhatan: query,
        saranPositif: res.pesanHangat,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const initialMsgs: ChatMessage[] = [
      {
        id: 'msg_welcome',
        sender: 'ai',
        text: activeUser
          ? `Peue haba ${activeUser.name} Kakak Sulung 🌸! Aku Si Jeumpa, maskot pendampingmu di TemanSulung. Ada hal yang ingin kamu curhatkan hari ini?`
          : 'Peue haba Kakak Sulung 🌸! Aku Si Jeumpa, maskot pendampingmu di TemanSulung. Ada hal yang ingin kamu curhatkan hari ini?',
      },
    ];
    setMessages(initialMsgs);
    saveChatMessages(initialMsgs);
  };

  const QUICK_PROMPTS = [
    'Aku capek banget malam ini...',
    'Gimana cara ngomong ke ortu mau belajar?',
    'Takut banget kalau nilai sekolah jelek...',
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl border border-purple-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[600px] animate-slide-up">
      {/* Visual Header with Mascot Si Jeumpa & Active Profile Name */}
      <div className="bg-gradient-to-r from-purple-600 to-rose-500 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white/80 shadow-sm flex-shrink-0 bg-white">
            <img
              src="/assets/mascot_si_jeumpa_aceh.jpg"
              alt="Si Jeumpa Mascot"
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
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap font-medium ${
                msg.sender === 'user'
                  ? 'bg-rose-500 text-white rounded-tr-none shadow-2xs'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-2xs'
              }`}
            >
              {msg.text}
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
      <div className="p-3.5 bg-white border-t border-slate-100 space-y-2.5">
        {/* Scrollable Recommendation Prompt Pills */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            💡 Rekomendasi Pertanyaan (Geser/Klik):
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-0.5 px-0.5">
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold shadow-2xs transition-all flex-shrink-0 active:scale-95"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tulis curhatanmu ke Si Jeumpa..."
            className="flex-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-rose-500 text-white disabled:opacity-50 shadow-md shadow-purple-200 hover:scale-105 active:scale-95 transition-all"
          >
            <IconSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
