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
}> = ({ sentiment, selected, onClick, icon, color }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 p-3 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200 ${
      selected ? `${color} text-white` : 'bg-lime-800 border-lime-700 hover:border-lime-500'
    }`}
  >
    {icon}
    <span className="mt-1 text-sm font-medium">{sentiment}</span>
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
  
  // State for individual date components
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Sync from personnelInfo.dob to local day/month/year state for autofill
  useEffect(() => {
    if (personnelInfo.dob && /^\d{4}-\d{2}-\d{2}$/.test(personnelInfo.dob)) {
      const [y, m, d] = personnelInfo.dob.split('-');
      setYear(y);
      setMonth(String(parseInt(m, 10)));
      setDay(String(parseInt(d, 10)));
    } else {
      setDay('');
      setMonth('');
      setYear('');
    }
  }, [personnelInfo.dob]);

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonnelInfo(prev => ({ ...prev, [name]: value }));

    if (name === 'fullName' && history[value]) {
        const personHistory = history[value];
        if (personHistory.length > 0) {
            const latestInfo = personHistory[personHistory.length - 1].info;
            setPersonnelInfo(latestInfo);
        }
    }
  };

  const handleDateChange = (part: 'day' | 'month' | 'year', value: string) => {
    const newDate = { day, month, year };
    newDate[part] = value;

    // If month or year changes, the selected day might become invalid (e.g., 31st of Feb).
    if (part === 'month' || part === 'year') {
        const daysInNewMonth = (newDate.year && newDate.month) ? new Date(parseInt(newDate.year), parseInt(newDate.month), 0).getDate() : 31;
        if (parseInt(newDate.day) > daysInNewMonth) {
            newDate.day = ''; // Reset day so user must select a valid one
        }
    }

    setDay(newDate.day);
    setMonth(newDate.month);
    setYear(newDate.year);
    
    // Combine into YYYY-MM-DD format and update the main state
    if (newDate.year && newDate.month && newDate.day) {
        const dobString = `${newDate.year}-${String(newDate.month).padStart(2, '0')}-${String(newDate.day).padStart(2, '0')}`;
        setPersonnelInfo(prev => ({ ...prev, dob: dobString }));
    } else {
        // If any part is missing, the DOB is incomplete
        setPersonnelInfo(prev => ({ ...prev, dob: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FIX: Add type guard to ensure `field` is a string before calling `trim()`
    if (Object.values(personnelInfo).some(field => typeof field === 'string' && field.trim() === '')) {
      setError('Vui lòng điền đầy đủ thông tin quân nhân.');
      return;
    }
    if (entry.trim().length < 20) {
      setError('Vui lòng nhập ít nhất 20 ký tự trong phần ghi chép để có kết quả phân tích tốt nhất.');
      return;
    }
    setError('');
    onAnalyze(entry, selectedSentiment, personnelInfo);
  };
  
  const personnelNames = Object.keys(history);

  // Memoized lists for select options
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    // Typical military age range, e.g., 18-65
    const startYear = current - 18;
    const endYear = current - 65;
    const years = [];
    for (let y = startYear; y >= endYear; y--) {
        years.push(y);
    }
    return years;
  }, []);

  const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  
  const dayOptions = useMemo(() => {
    const daysInMonth = (year && month) ? new Date(parseInt(year), parseInt(month), 0).getDate() : 31;
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [year, month]);

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold text-slate-100 mb-4 border-b border-lime-700 pb-3">Thông Tin Quân Nhân</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-lime-300 mb-1">Họ và tên</label>
                <input type="text" name="fullName" id="fullName" value={personnelInfo.fullName} onChange={handleInfoChange} className="form-input" list="personnel-names" disabled={isLoading} />
                <datalist id="personnel-names">
                    {personnelNames.map(name => <option key={name} value={name} />)}
                </datalist>
            </div>
            <div>
                <label htmlFor="dob-day" className="block text-sm font-medium text-lime-300 mb-1">Ngày sinh</label>
                <div className="grid grid-cols-3 gap-2">
                    <select id="dob-day" name="day" value={day} onChange={(e) => handleDateChange('day', e.target.value)} className="form-input" disabled={isLoading} required>
                        <option value="">Ngày</option>
                        {dayOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select id="dob-month" name="month" value={month} onChange={(e) => handleDateChange('month', e.target.value)} className="form-input" disabled={isLoading} required>
                        <option value="">Tháng</option>
                        {monthOptions.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                    </select>
                    <select id="dob-year" name="year" value={year} onChange={(e) => handleDateChange('year', e.target.value)} className="form-input" disabled={isLoading} required>
                        <option value="">Năm</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="rank" className="block text-sm font-medium text-lime-300 mb-1">Cấp bậc</label>
                <input type="text" name="rank" id="rank" value={personnelInfo.rank} onChange={handleInfoChange} className="form-input" disabled={isLoading} />
            </div>
            <div>
                <label htmlFor="position" className="block text-sm font-medium text-lime-300 mb-1">Chức vụ</label>
                <input type="text" name="position" id="position" value={personnelInfo.position} onChange={handleInfoChange} className="form-input" disabled={isLoading} />
            </div>
             <div className="md:col-span-2">
                <label htmlFor="unit" className="block text-sm font-medium text-lime-300 mb-1">Đơn vị</label>
                <input type="text" name="unit" id="unit" value={personnelInfo.unit} onChange={handleInfoChange} className="form-input" disabled={isLoading} />
            </div>
        </div>
        
        <h2 className="text-xl font-semibold text-slate-100 mb-4 border-b border-lime-700 pb-3">Ghi Chép Hàng Ngày</h2>
        <p className="text-lime-300 mb-2 text-sm">Trạng thái tinh thần của quân nhân hôm nay?</p>
        <div className="flex gap-2 sm:gap-4 mb-4">
          <SentimentButton
            sentiment={Sentiment.Positive}
            selected={selectedSentiment === Sentiment.Positive}
            onClick={() => setSelectedSentiment(Sentiment.Positive)}
            icon={<SmileIcon />}
            color="border-green-500 bg-green-600/50"
          />
          <SentimentButton
            sentiment={Sentiment.Neutral}
            selected={selectedSentiment === Sentiment.Neutral}
            onClick={() => setSelectedSentiment(Sentiment.Neutral)}
            icon={<MehIcon />}
            color="border-amber-500 bg-amber-600/50"
          />
          <SentimentButton
            sentiment={Sentiment.Negative}
            selected={selectedSentiment === Sentiment.Negative}
            onClick={() => setSelectedSentiment(Sentiment.Negative)}
            icon={<FrownIcon />}
            color="border-red-500 bg-red-600/50"
          />
        </div>

        <label htmlFor="journal-entry" className="block text-sm font-medium text-lime-300 mb-2">
          Ghi lại những tâm tư, suy nghĩ của quân nhân:
        </label>
        <textarea
          id="journal-entry"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Hôm nay quân nhân có những biểu hiện, chia sẻ..."
          className="w-full h-48 p-3 bg-lime-900 border border-lime-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-slate-200 placeholder-lime-500"
          disabled={isLoading}
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || entry.trim().length === 0}
          className="w-full mt-6 bg-amber-600 hover:bg-amber-700 disabled:bg-lime-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? 'Đang xử lý...' : 'Gửi Phân Tích'}
        </button>
      </form>
    </Card>
  );
};

// Add a shared style for form inputs to avoid repetition
const style = document.createElement('style');
style.innerHTML = `
  .form-input {
    width: 100%;
    padding: 0.75rem;
    background-color: #1a2e05; /* lime-950 */
    border: 1px solid #365314; /* lime-900 */
    border-radius: 0.5rem;
    transition: all 0.2s;
    color: #cbd5e1; /* slate-300 */
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a3e635' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }
  .form-input:focus {
    outline: none;
    --tw-ring-color: #f59e0b; /* amber-500 */
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
    border-color: #f59e0b; /* amber-500 */
  }
  .form-input::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;
document.head.appendChild(style);

const SmileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const MehIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 14h5M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const FrownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 15.5a4.5 4.5 0 01-5 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default EntryForm;