
import React, { useEffect, useRef, useState } from 'react';
import { AnalysisResult, Sentiment, PersonnelInfo, HistoryEntry } from '../types';
import Card from './common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { GoogleGenAI, Modality } from "@google/genai";
// FIX: Import VietnamEmblemIcon to resolve the missing component reference error.
import { VietnamEmblemIcon } from './icons/VietnamEmblemIcon';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  personnelInfo: PersonnelInfo;
  onReset: () => void;
  history: HistoryEntry[];
}

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  [Sentiment.Positive]: '#a3e635',
  [Sentiment.Neutral]: '#f59e0b',
  [Sentiment.Negative]: '#ef4444',
};

const getSentimentColor = (score: number): string => {
  if (score > 0.2) return SENTIMENT_COLORS[Sentiment.Positive];
  if (score < -0.2) return SENTIMENT_COLORS[Sentiment.Negative];
  return SENTIMENT_COLORS[Sentiment.Neutral];
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
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

const InfoBadge: React.FC<{label: string, value: string}> = ({label, value}) => (
    <div className="flex flex-col">
        <span className="text-[10px] text-lime-600 font-black uppercase tracking-widest leading-none mb-1">{label}</span>
        <span className="text-sm text-slate-100 font-bold uppercase tracking-tight">{value}</span>
    </div>
);

const SectionHeader: React.FC<{title: string, icon: React.ReactNode, accentColor: string}> = ({title, icon, accentColor}) => (
    <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-black/40 border`} style={{borderColor: `${accentColor}33`, color: accentColor}}>
            {icon}
        </div>
        <h3 className="text-xs font-black text-slate-200 uppercase tracking-[0.2em]">{title}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-lime-900/50 to-transparent ml-2"></div>
    </div>
);

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, personnelInfo, onReset, history }) => {
  const sentimentColor = getSentimentColor(result.sentimentScore);
  const scoreValue = (result.sentimentScore + 1) / 2 * 100;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const playRecommendation = async () => {
    if (isPlaying || !process.env.API_KEY) return;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    try {
        setIsPlaying(true);
        const textToRead = `Báo cáo đồng chí, sau đây là định hướng giải quyết tư tưởng đối với quân nhân ${personnelInfo.fullName}: ${result.officerRecommendations}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Giọng nữ sĩ quan dõng dạc, nghiêm túc: ${textToRead}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio && audioContextRef.current) {
            const ctx = audioContextRef.current;
            const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.onended = () => setIsPlaying(false);
            activeSourceRef.current = source;
            source.start();
        }
    } catch (e) {
        console.error("Audio error", e);
        setIsPlaying(false);
    }
  };

  // Tự động phát khi kết quả hiện ra lần đầu
  useEffect(() => {
    const timer = setTimeout(playRecommendation, 1000);
    return () => {
        clearTimeout(timer);
        if (activeSourceRef.current) activeSourceRef.current.stop();
    };
  }, []);

  const gaugeData = [
    { name: 'score', value: scoreValue },
    { name: 'empty', value: 100 - scoreValue },
  ];
  
  const chartData = history.slice().reverse().map(entry => ({
      date: new Date(entry.analysis.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      'Chỉ số': entry.analysis.sentimentScore,
  }));

  return (
    <div className="animate-fade-in space-y-8 max-w-6xl mx-auto">
      <Card className="!p-0 border-lime-800/40 bg-lime-900/10 overflow-hidden rounded-[2rem]">
          <div className="bg-gradient-to-r from-lime-900/40 to-transparent p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-black/40 border-2 border-lime-800 flex items-center justify-center shadow-inner relative overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-lime-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {isPlaying && <div className="absolute inset-0 bg-amber-500/20 animate-pulse"></div>}
                  </div>
                  <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">{personnelInfo.fullName}</h2>
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <InfoBadge label="Cấp bậc" value={personnelInfo.rank} />
                          <InfoBadge label="Chức vụ" value={personnelInfo.position} />
                          <InfoBadge label="Đơn vị" value={personnelInfo.unit} />
                      </div>
                  </div>
              </div>
              <div className="flex items-center gap-4 bg-black/30 px-6 py-4 rounded-2xl border border-lime-900/50">
                  <div className="text-right">
                      <p className="text-[9px] text-lime-600 font-black uppercase tracking-widest mb-1">Ngày lập hồ sơ</p>
                      <p className="text-xs text-slate-300 font-mono">{new Date(result.date).toLocaleDateString('vi-VN')} {new Date(result.date).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
              </div>
          </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="!p-8 rounded-[2.5rem] flex flex-col items-center">
                  <SectionHeader title="Trạng thái tinh thần" accentColor={sentimentColor} icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>} />
                  <div style={{ width: '100%', height: 200 }} className="relative">
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={gaugeData} cx="50%" cy="90%" startAngle={210} endAngle={-30} innerRadius={90} outerRadius={110} dataKey="value" stroke="none">
                          <Cell fill={sentimentColor} />
                          <Cell fill="#1a2e05" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
                        <span className="text-4xl font-black tracking-tighter" style={{color: sentimentColor}}>{result.sentimentCategory}</span>
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Hệ số: {result.sentimentScore.toFixed(2)}</span>
                    </div>
                  </div>
              </Card>

              <Card className="!p-8 rounded-[2.5rem]">
                  <SectionHeader title="Chủ đề tiêu biểu" accentColor="#fbbf24" icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>} />
                  <div className="flex flex-wrap gap-3">
                    {result.keyThemes.map((theme, index) => (
                        <div key={index} className="px-4 py-2.5 bg-amber-900/10 border border-amber-800/30 rounded-xl flex items-center gap-2">
                            <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                            <span className="text-[11px] font-bold text-amber-200 uppercase tracking-tight">{theme}</span>
                        </div>
                    ))}
                  </div>
              </Card>
          </div>

          <Card className="!p-10 rounded-[2.5rem] bg-gradient-to-br from-lime-900/20 to-transparent">
              <SectionHeader title="Tóm lược diễn biến" accentColor="#3b82f6" icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>} />
              <p className="text-slate-300 text-sm leading-[1.8] text-justify font-medium">{result.summary}</p>
          </Card>

          <Card className="!p-10 rounded-[2.5rem] border-l-8" style={{borderColor: sentimentColor}}>
              <SectionHeader title="Nhận định chuyên sâu" accentColor={sentimentColor} icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-6.364l-.707-.707M12 13a4 4 0 110-8 4 4 0 010 8z"/></svg>} />
              <p className="text-slate-200 text-sm leading-[1.8] text-justify italic">"{result.insights}"</p>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
            <Card className="!p-0 border-amber-600/50 bg-amber-900/5 shadow-2xl overflow-hidden rounded-[2.5rem] sticky top-8">
                <div className="bg-amber-600 px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Định hướng giải quyết</h3>
                    </div>
                    <button onClick={playRecommendation} className={`p-2 rounded-full transition-all ${isPlaying ? 'bg-white text-amber-600 animate-pulse' : 'bg-amber-500 text-white hover:bg-amber-400'}`}>
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M14 5v14l-7-5H4V10h3l7-5zm4 7a5 5 0 0 0-3-4.5v9a5 5 0 0 0 3-4.5z"/></svg>
                    </button>
                </div>
                <div className="p-8">
                    <div className="bg-amber-900/10 p-5 rounded-2xl border border-amber-800/30">
                        <p className="text-amber-100 text-sm leading-[1.8] font-bold text-justify whitespace-pre-line">
                            {result.officerRecommendations}
                        </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-amber-800/50 flex items-center justify-between">
                        <span className="text-[10px] text-amber-500 font-black uppercase tracking-widest">{result.sentimentCategory === Sentiment.Negative ? 'XỬ LÝ KHẨN CẤP' : 'THEO DÕI THƯỜNG XUYÊN'}</span>
                        <div className="h-10 w-10 bg-amber-500/20 rounded-xl border border-amber-500/30 flex items-center justify-center">
                            <VietnamEmblemIcon className="h-6 w-6 opacity-60" />
                        </div>
                    </div>
                </div>
            </Card>

            <button onClick={onReset} className="w-full py-5 bg-lime-800/30 hover:bg-lime-800/50 border border-lime-700/50 rounded-[2rem] text-lime-500 font-black text-xs uppercase tracking-[0.3em] transition-all active:scale-95 flex items-center justify-center gap-3">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                Quay lại danh sách
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
