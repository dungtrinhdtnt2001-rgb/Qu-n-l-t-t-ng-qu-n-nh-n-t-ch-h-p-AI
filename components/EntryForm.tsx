import React, { useState } from 'react';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(personnelInfo).some(field => field.trim() === '')) {
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
                <label htmlFor="dob" className="block text-sm font-medium text-lime-300 mb-1">Ngày sinh</label>
                <input type="date" name="dob" id="dob" value={personnelInfo.dob} onChange={handleInfoChange} className="form-input" disabled={isLoading} />
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
