
import React, { useState, useMemo, useEffect } from 'react';
import { Sentiment, PersonnelInfo, HistoryEntry } from '../types';
import Card from './common/Card';

interface EntryFormProps {
  onAnalyze: (entry: string, sentiment: Sentiment, personnelInfo: PersonnelInfo) => void;
  isLoading: boolean;
  history: Record<string, HistoryEntry[]>;
}

const SentimentButton: React.FC<{
  sentiment: Sentiment;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactElement;
  color: string;
  tabIndex?: number;
}> = ({ sentiment, selected, onClick, icon, color, tabIndex }) => (
  <button
    type="button"
    onClick={onClick}
    tabIndex={tabIndex}
    className={`flex-1 p-3 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
      selected ? `${color} text-white shadow-lg scale-[1.05]` : 'bg-lime-950 border-lime-800 hover:border-lime-700 text-lime-600'
    }`}
  >
    {icon}
    <span className="mt-1 text-[10px] uppercase font-black tracking-tighter">{sentiment}</span>
  </button>
);

const EntryForm: React.FC<EntryFormProps> = ({ onAnalyze, isLoading, history }) => {
  const [entry, setEntry] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment>(Sentiment.Neutral);
  const [personnelInfo, setPersonnelInfo] = useState<PersonnelInfo>({
    fullName: '',
    dob: '',
    rank: '',
    position: '',
    unit: '',
  });
  const [error, setError] = useState('');
  const [autoFilled, setAutoFilled] = useState(false);
  
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Tự động tách ngày sinh khi personnelInfo.dob thay đổi (do auto-fill)
  useEffect(() => {
    if (personnelInfo.dob && /^\d{4}-\d{2}-\d{2}$/.test(personnelInfo.dob)) {
      const [y, m, d] = personnelInfo.dob.split('-');
      setYear(y);
      setMonth(String(parseInt(m, 10)));
      setDay(String(parseInt(d, 10)));
    }
  }, [personnelInfo.dob]);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonnelInfo(prev => ({ ...prev, [name]: value }));

    // Logic tự động điền nâng cao
    if (name === 'fullName') {
        const match = Object.keys(history).find(hName => hName.toLowerCase() === value.toLowerCase());
        if (match && history[match].length > 0) {
            setPersonnelInfo(history[match][0].info);
            setAutoFilled(true);
            setTimeout(() => setAutoFilled(false), 2000);
        }
    }
  };

  const handleDateChange = (part: 'day' | 'month' | 'year', value: string) => {
    const newDate = { day, month, year, [part]: value };
    setDay(newDate.day);
    setMonth(newDate.month);
    setYear(newDate.year);
    
    if (newDate.year && newDate.month && newDate.day) {
        const dobString = `${newDate.year}-${String(newDate.month).padStart(2, '0')}-${String(newDate.day).padStart(2, '0')}`;
        setPersonnelInfo(prev => ({ ...prev, dob: dobString }));
    }
  };

  const validateAndSubmit = () => {
    if (Object.values(personnelInfo).some(f => !f)) {
      setError('Vui lòng điền đầy đủ thông tin quân nhân.');
      return;
    }
    if (entry.trim().length < 10) {
      setError('Nội dung ghi chép quá ngắn.');
      return;
    }
    setError('');
    onAnalyze(entry, selectedSentiment, personnelInfo);
  };

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    // Cho phép Enter để gửi nếu không phải đang ở textarea
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
      e.preventDefault();
      validateAndSubmit();
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
    // Phím tắt Ctrl+Enter hoặc Cmd+Enter để gửi dữ liệu nhanh từ textarea
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      validateAndSubmit();
    }
  };

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => current - 18 - i);
  }, []);

  return (
    <Card className="max-w-5xl mx-auto !bg-transparent !border-0 !p-0">
      <form 
        onSubmit={(e) => { e.preventDefault(); validateAndSubmit(); }} 
        onKeyDown={handleFormKeyDown}
        className="space-y-6 animate-fade-in"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Personnel Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-lime-900/50 p-6 rounded-2xl border border-lime-800/50 shadow-xl relative overflow-hidden">
                {autoFilled && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-black text-[8px] font-black px-3 py-1 uppercase tracking-tighter animate-fade-in">
                        Đã tự động điền từ lịch sử
                    </div>
                )}
                <h2 className="text-lg font-black text-slate-100 mb-6 uppercase tracking-tight flex items-center gap-3">
                  <div className="w-1 h-6 bg-amber-500"></div>
                  Thông Tin Đối Tượng
                </h2>
                <div className="space-y-5">
                  <div className="group">
                      <label className="text-[10px] text-lime-500 font-black mb-1 block uppercase">Họ và tên quân nhân</label>
                      <input 
                        type="text" 
                        name="fullName" 
                        value={personnelInfo.fullName} 
                        onChange={handleInfoChange} 
                        tabIndex={1}
                        className="w-full bg-lime-950/50 border-b-2 border-lime-800 p-2 text-white placeholder:text-lime-900 focus:border-amber-500 transition-all outline-none" 
                        list="personnel-names" 
                        placeholder="Nhập tên để tìm kiếm..."
                        required 
                      />
                      <datalist id="personnel-names">
                          {Object.keys(history).map(name => <option key={name} value={name} />)}
                      </datalist>
                  </div>
                  <div>
                      <label className="text-[10px] text-lime-500 font-black mb-2 block uppercase">Ngày tháng năm sinh</label>
                      <div className="grid grid-cols-3 gap-2">
                          <select tabIndex={2} value={day} onChange={(e) => handleDateChange('day', e.target.value)} className="bg-lime-950 border border-lime-800 p-2 rounded text-sm text-white outline-none focus:border-amber-500" required><option value="">Ngày</option>{Array.from({length: 31}, (_,i)=>i+1).map(d=><option key={d} value={d}>{d}</option>)}</select>
                          <select tabIndex={3} value={month} onChange={(e) => handleDateChange('month', e.target.value)} className="bg-lime-950 border border-lime-800 p-2 rounded text-sm text-white outline-none focus:border-amber-500" required><option value="">Tháng</option>{Array.from({length: 12}, (_,i)=>i+1).map(m=><option key={m} value={m}>{m}</option>)}</select>
                          <select tabIndex={4} value={year} onChange={(e) => handleDateChange('year', e.target.value)} className="bg-lime-950 border border-lime-800 p-2 rounded text-sm text-white outline-none focus:border-amber-500" required><option value="">Năm</option>{yearOptions.map(y=><option key={y} value={y}>{y}</option>)}</select>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="text-[10px] text-lime-500 font-black mb-1 block uppercase">Cấp bậc</label>
                        <input tabIndex={5} type="text" name="rank" placeholder="VD: Thượng úy" value={personnelInfo.rank} onChange={handleInfoChange} className="w-full bg-lime-950/50 border-b-2 border-lime-800 p-2 text-white placeholder:text-lime-900 focus:border-amber-500 transition-all outline-none" required />
                      </div>
                      <div className="group">
                        <label className="text-[10px] text-lime-500 font-black mb-1 block uppercase">Chức vụ</label>
                        <input tabIndex={6} type="text" name="position" placeholder="VD: Trung đội trưởng" value={personnelInfo.position} onChange={handleInfoChange} className="w-full bg-lime-950/50 border-b-2 border-lime-800 p-2 text-white placeholder:text-lime-900 focus:border-amber-500 transition-all outline-none" required />
                      </div>
                  </div>
                  <div className="group">
                    <label className="text-[10px] text-lime-500 font-black mb-1 block uppercase">Đơn vị công tác</label>
                    <input tabIndex={7} type="text" name="unit" placeholder="VD: Đại đội 1, Tiểu đoàn 2" value={personnelInfo.unit} onChange={handleInfoChange} className="w-full bg-lime-950/50 border-b-2 border-lime-800 p-2 text-white placeholder:text-lime-900 focus:border-amber-500 transition-all outline-none" required />
                  </div>
                </div>
            </div>
          </div>

          {/* Analysis Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-lime-900/50 p-6 rounded-2xl border border-lime-800/50 shadow-xl flex flex-col h-full">
                <h2 className="text-lg font-black text-slate-100 mb-6 uppercase tracking-tight flex items-center gap-3">
                  <div className="w-1 h-6 bg-amber-500"></div>
                  Dữ Liệu Nhận Định Ban Đầu
                </h2>
                <div className="flex gap-4 mb-6">
                  <SentimentButton tabIndex={8} sentiment={Sentiment.Positive} selected={selectedSentiment === Sentiment.Positive} onClick={() => setSelectedSentiment(Sentiment.Positive)} icon={<SmileIcon />} color="bg-green-600 border-green-400" />
                  <SentimentButton tabIndex={9} sentiment={Sentiment.Neutral} selected={selectedSentiment === Sentiment.Neutral} onClick={() => setSelectedSentiment(Sentiment.Neutral)} icon={<MehIcon />} color="bg-blue-600 border-blue-400" />
                  <SentimentButton tabIndex={10} sentiment={Sentiment.Negative} selected={selectedSentiment === Sentiment.Negative} onClick={() => setSelectedSentiment(Sentiment.Negative)} icon={<FrownIcon />} color="bg-red-600 border-red-400" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] text-lime-500 font-black block uppercase tracking-widest">Nội dung quan sát / Nhật ký tư tưởng</label>
                    <span className="text-[9px] text-lime-700 font-mono italic">Ctrl + Enter để gửi nhanh</span>
                  </div>
                  <textarea
                    tabIndex={11}
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    onKeyDown={handleTextareaKeyDown}
                    placeholder="Ghi nhận diễn biến tư tưởng, thái độ, phát ngôn hoặc các biểu hiện bất thường của quân nhân..."
                    className="flex-1 w-full min-h-[220px] p-5 bg-lime-950 border border-lime-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-amber-500/50 transition-all outline-none placeholder:text-lime-900 text-sm leading-relaxed resize-none custom-scrollbar"
                  />
                </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
            {error && <p className="text-red-400 text-xs font-black uppercase tracking-widest animate-pulse">{error}</p>}
            
            <button
              type="submit"
              tabIndex={12}
              disabled={isLoading}
              className="group relative w-full max-w-lg overflow-hidden py-4 bg-amber-600 text-white font-black text-lg rounded-2xl shadow-2xl transition-all hover:bg-amber-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10">{isLoading ? 'ĐANG PHÂN TÍCH...' : 'GỬI PHÂN TÍCH (ENTER)'}</span>
            </button>
            <p className="text-[10px] text-lime-700 font-mono tracking-widest italic uppercase">Mã hóa quân sự AES-256 // CSDL nội bộ bảo mật</p>
        </div>
      </form>
    </Card>
  );
};

const SmileIcon = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const MehIcon = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 14h5M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const FrownIcon = () => <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 15.5a4.5 4.5 0 01-5 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default EntryForm;
