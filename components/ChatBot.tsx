
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import Card from './common/Card';
import { NEW_VIETNAM_MILITARY_DOCTRINE } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const GREETING_TEXT = 'Báo cáo Thủ trưởng! Tôi là Trợ lý AI chuyên trách công tác tư tưởng. Tôi đã quán triệt sâu sắc Quy chế 775 và Cẩm nang 100 tình huống. Sẵn sàng hỗ trợ đồng chí giải quyết mọi vướng mắc nghiệp vụ. Mời đồng chí cho ý kiến!';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: GREETING_TEXT }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      stopAllAudio();
    }
  }, [isOpen]);

  const stopAllAudio = () => {
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current.clear();
    setIsSpeaking(false);
  };

  const playTTS = async (text: string) => {
    if (!text || !process.env.API_KEY) return;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Giọng nữ sĩ quan dõng dạc, nghiêm túc, dứt khoát: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio && audioContextRef.current) {
        setIsSpeaking(true);
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
          activeSourcesRef.current.delete(source);
          if (activeSourcesRef.current.size === 0) setIsSpeaking(false);
        };
        activeSourcesRef.current.add(source);
        source.start();
      }
    } catch (error) {
      console.error("TTS Error:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    stopAllAudio();
    
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsProcessing(true);
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Bạn là "Nữ sĩ quan Trợ lý AI" thuộc cơ quan Chính trị. 
          
          PHONG CÁCH:
          - Nghiêm túc, dứt khoát, chuẩn mực quân sự.
          - Gọi người dùng là "Đồng chí" hoặc "Thủ trưởng".
          - Luôn mở đầu bằng: "Báo cáo đồng chí, về vấn đề này tôi xin có ý kiến tư vấn như sau:".
          
          CƠ SỞ DỮ LIỆU: 
          ${NEW_VIETNAM_MILITARY_DOCTRINE}
          
          CÁCH PHẢN HỒI:
          - Khi tư vấn xử lý tình huống, phải trích dẫn: "Theo Tình huống số... Tập...".
          - Phải nêu rõ các bước theo quy trình 6 bước của Quy chế 775 để giải quyết vấn đề tư tưởng một cách triệt để.`,
      },
    });

    try {
      let fullText = "";
      const result = await chat.sendMessageStream({ message: userMessage });
      
      for await (const chunk of result) {
        fullText += chunk.text || "";
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = fullText;
          return updated;
        });
      }

      setIsProcessing(false);
      if (fullText) await playTTS(fullText);
    } catch (error) {
      console.error("Chat Error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] no-print">
      {isOpen && (
        <div className="absolute bottom-24 right-0 w-[420px] h-[650px] flex flex-col animate-fade-in shadow-[0_30px_70px_rgba(0,0,0,0.6)]">
          <Card className="flex-1 flex flex-col !p-0 border-lime-600 bg-lime-950/98 backdrop-blur-2xl rounded-[3rem] overflow-hidden border-2 ring-1 ring-white/10">
            {/* Header */}
            <div className="bg-gradient-to-br from-lime-800 to-lime-950 border-b border-lime-600/50 p-7 flex items-center gap-5 relative">
              <div className="relative group">
                 <div className="h-16 w-16 rounded-full border-2 border-amber-500 overflow-hidden bg-lime-900 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
                    <svg viewBox="0 0 64 64" className="w-full h-full p-1" fill="currentColor">
                       <path d="M32 12c-8 0-12 6-12 12s2 10 2 10l-2 6c-4 0-6 4-6 8s20 4 20 4 20 0 20-4-2-8-6-8l-2-6s2-4 2-10-4-12-12-12z" fill="#3f6212" />
                       <circle cx="32" cy="24" r="8" fill="#fde68a" />
                       <path d="M24 32c0 4 8 8 8 8s8-4 8-8" fill="#fde68a" />
                       <path d="M20 18l12-4 12 4-12 6z" fill="#da251d" />
                       <path d="M32 16l1 2 2 0-2 1 1 2-2-1-2 1 1-2-2-1 2 0z" fill="#ffff00" />
                    </svg>
                 </div>
                 {isSpeaking && (
                    <div className="absolute -inset-1 border-2 border-amber-500 rounded-full animate-ping opacity-50"></div>
                 )}
              </div>
              <div className="z-10 flex-1">
                <h3 className="text-white font-black text-base uppercase tracking-widest leading-tight">TRỢ LÝ CHÍNH TRỊ 775</h3>
                <div className="flex items-center gap-2 mt-1">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-lime-400 font-bold uppercase tracking-wider">Sẵn sàng thực hiện nhiệm vụ</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="bg-black/20 hover:bg-red-500/20 text-lime-500 hover:text-red-500 p-2 rounded-xl transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-7 space-y-6 bg-black/40 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-[90%] p-5 rounded-3xl text-[13px] leading-relaxed shadow-xl border ${msg.role === 'user' ? 'bg-amber-600 text-white border-amber-400 rounded-tr-none' : 'bg-lime-900/90 text-slate-100 border-lime-700/50 rounded-tl-none font-medium'}`}>
                    <div className="whitespace-pre-line text-justify">{msg.text}</div>
                    {!msg.text && (
                        <div className="flex gap-2 py-2">
                            <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-lime-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-lime-950/50 border-t border-lime-800/50 backdrop-blur-md">
              <div className="flex gap-3">
                <input
                  type="text" value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Hỏi về quy chế, tình huống xử lý..."
                  className="flex-1 bg-black/40 border border-lime-700 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-lime-800"
                />
                <button 
                  onClick={handleSend} 
                  disabled={isProcessing} 
                  className="bg-amber-600 hover:bg-amber-500 p-4 rounded-2xl text-white shadow-[0_10px_20px_rgba(217,119,6,0.3)] active:scale-95 disabled:opacity-50 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className={`h-24 w-24 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all border-4 hover:scale-110 active:scale-95 ${isOpen ? 'bg-lime-900 border-lime-600' : 'bg-gradient-to-tr from-lime-900 to-lime-800 border-lime-500'}`}>
        <div className="flex flex-col items-center z-10">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
           <span className="text-[10px] font-black text-amber-400 mt-1 uppercase tracking-tighter">Hỏi AI 775</span>
        </div>
      </button>
    </div>
  );
};

export default ChatBot;
