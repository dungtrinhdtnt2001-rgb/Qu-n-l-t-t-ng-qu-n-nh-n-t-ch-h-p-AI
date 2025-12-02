
import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult, Sentiment, PersonnelInfo, HistoryEntry } from './types';
import EntryForm from './components/EntryForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import PersonnelList from './components/PersonnelList';
import HistoricalReport from './components/HistoricalReport';
import { analyzeThoughtLog } from './services/geminiService';
import { VietnamEmblemIcon } from './components/icons/VietnamEmblemIcon';
import Card from './components/common/Card';

type View = 'form' | 'analysis' | 'history_dashboard';

const STORAGE_KEY = 'military_global_history';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [personnelInfo, setPersonnelInfo] = useState<PersonnelInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Record<string, HistoryEntry[]>>({});
  const [view, setView] = useState<View>('form');
  const [selectedPersonForReport, setSelectedPersonForReport] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        const personnelNames = Object.keys(parsedHistory).sort();
        // If there is history, verify if we should show dashboard or form. 
        // Defaulting to form for new entries is usually better for workflow, 
        // but let's stick to showing dashboard if data exists to show "aliveness".
        if (personnelNames.length > 0) {
          setView('history_dashboard');
          setSelectedPersonForReport(personnelNames[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
      setHistory({});
    }
  }, []);

  const handleAnalysis = useCallback(async (entry: string, sentiment: Sentiment, info: PersonnelInfo) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setPersonnelInfo(info);
    setView('form');

    try {
      const result = await analyzeThoughtLog(entry, sentiment, info);
      const analysisWithDate: AnalysisResult = { ...result, date: new Date().toISOString() };
      
      setAnalysisResult(analysisWithDate);
      setView('analysis');

      const newEntry: HistoryEntry = { info, analysis: analysisWithDate };
      const updatedHistory = { ...history };
      const personHistory = updatedHistory[info.fullName] || [];
      personHistory.push(newEntry);
      
      // Sort history by date descending
      updatedHistory[info.fullName] = [...personHistory].sort((a,b) => new Date(b.analysis.date).getTime() - new Date(a.analysis.date).getTime());
      
      setHistory(updatedHistory);
      // Save to global local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

    } catch (e) {
      console.error(e);
      setError('Không thể phân tích. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  }, [history]);

  const handleSelectPersonForReport = (name: string) => {
    setSelectedPersonForReport(name);
  };
  
  const handleBackToForm = () => {
    setAnalysisResult(null);
    setPersonnelInfo(null);
    setError(null);
    setView('form');
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center bg-lime-900/50 p-8 rounded-lg shadow-2xl">
            <svg className="animate-spin h-10 w-10 text-amber-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-semibold text-slate-200">AI đang phân tích...</p>
            <p className="text-lime-300">Quá trình này có thể mất một vài giây.</p>
        </div>
      );
    }

    if (error) {
        return (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                <p className="font-bold">Đã xảy ra lỗi</p>
                <p>{error}</p>
                <button
                    onClick={handleBackToForm}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    switch(view) {
        case 'form':
            return <EntryForm onAnalyze={handleAnalysis} isLoading={isLoading} history={history} />;
        case 'analysis':
             if (analysisResult && personnelInfo) {
                 return <AnalysisDashboard 
                    result={analysisResult} 
                    personnelInfo={personnelInfo} 
                    onReset={handleBackToForm}
                    history={history[personnelInfo.fullName] || []}
                  />;
             }
             return null;
        case 'history_dashboard':
            return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-1">
                        <PersonnelList 
                            history={history} 
                            onSelect={handleSelectPersonForReport}
                            selectedPersonnel={selectedPersonForReport}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        {selectedPersonForReport && history[selectedPersonForReport] ? (
                            <HistoricalReport 
                                key={selectedPersonForReport}
                                personnelName={selectedPersonForReport} 
                                history={history[selectedPersonForReport]} 
                            />
                        ) : (
                            <Card className="flex items-center justify-center min-h-[400px]">
                                <p className="text-lime-300 text-center">
                                  {Object.keys(history).length > 0
                                    ? 'Chọn một quân nhân từ danh sách để xem báo cáo chi tiết.'
                                    : 'Chưa có dữ liệu lịch sử. Vui lòng nhập một bản phân tích mới để bắt đầu.'
                                  }
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            );
        default:
            return <EntryForm onAnalyze={handleAnalysis} isLoading={isLoading} history={history} />;
    }
  }

  return (
    <div className="bg-lime-950 min-h-screen text-slate-200 font-sans p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <VietnamEmblemIcon className="h-12 w-12 flex-shrink-0" />
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-slate-100 tracking-wider">
                  Hệ Thống Phân Tích Tư Tưởng Quân Nhân
                </h1>
                <p className="text-lime-300 mt-1 text-sm sm:text-base hidden sm:block">
                  Trợ lý AI giúp cung cấp thông tin chi tiết về tư tưởng và tinh thần.
                </p>
              </div>
            </div>
            {/* Login section removed */}
        </div>
        
        <nav className="flex justify-center bg-lime-900/70 p-2 rounded-lg border border-lime-800 space-x-2">
            <button 
              onClick={handleBackToForm}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'form' || view === 'analysis' ? 'bg-amber-600 text-white' : 'text-lime-200 hover:bg-lime-800'}`}
            >
              Nhập Phân Tích Mới
            </button>
            <button 
              onClick={() => setView('history_dashboard')}
              disabled={Object.keys(history).length === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'history_dashboard' ? 'bg-amber-600 text-white' : 'text-lime-200 hover:bg-lime-800'} disabled:text-lime-600 disabled:hover:bg-transparent disabled:cursor-not-allowed`}
            >
              Xem Báo Cáo Lịch Sử
            </button>
        </nav>

      </header>

      <main className="w-full max-w-5xl">
        {renderContent()}
      </main>

      <footer className="w-full max-w-5xl mt-8 text-center text-lime-400 text-xs">
        <p>&copy; {new Date().getFullYear()} - Nền tảng phân tích AI. Bảo mật và riêng tư là ưu tiên hàng đầu.</p>
      </footer>
    </div>
  );
};

export default App;
