
import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult, Sentiment, PersonnelInfo, HistoryEntry, CentralDatabase, ActivityLog, User, UserRole } from './types';
import EntryForm from './components/EntryForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import CommanderDashboard from './components/CommanderDashboard';
import HistoricalReport from './components/HistoricalReport';
import OfficerHistory from './components/OfficerHistory';
import Login from './components/Login';
import ChatBot from './components/ChatBot';
import { analyzeThoughtLog } from './services/geminiService';
import { storageService } from './services/storageService';
import { VietnamEmblemIcon } from './components/icons/VietnamEmblemIcon';
import Card from './components/common/Card';

type View = 'dashboard' | 'form' | 'analysis' | 'report' | 'sync' | 'officer-history';

const SESSION_KEY = 'MILITARY_USER_SESSION';

const App: React.FC = () => {
  const [db, setDb] = useState<CentralDatabase>({ history: {}, activities: [] });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<{ result: AnalysisResult, info: PersonnelInfo } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [showSyncCode, setShowSyncCode] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    try {
      setDb(storageService.getDatabase());
    } catch (e) { console.error("Load DB fail", e); }
    
    const savedUser = sessionStorage.getItem(SESSION_KEY);
    if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setView(user.role === UserRole.Admin ? 'dashboard' : 'form');
        } catch (e) { sessionStorage.removeItem(SESSION_KEY); }
    }
  }, []);

  const handleLogin = async (username: string, password?: string, role?: UserRole, rank?: string, position?: string, unit?: string) => {
    if (role === UserRole.Admin) {
      if (password !== '78564') return { success: false, message: 'Mật khẩu quản trị không chính xác.' };
      const user: User = { username: 'admin', role: UserRole.Admin, fullName: 'CHỈ HUY TRƯỞNG' };
      setCurrentUser(user);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      setView('dashboard');
      return { success: true };
    } else {
      const user: User = { username, role: UserRole.Officer, fullName: username.toUpperCase(), rank, position, unit };
      setCurrentUser(user);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      setView('form');
      return { success: true };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION_KEY);
    setView('dashboard');
  };

  const saveAndSync = (updatedDb: CentralDatabase) => {
    setDb(updatedDb);
    storageService.saveDatabase(updatedDb);
  };

  const logActivity = (operatorName: string, action: string, targetPersonnel?: string) => {
    return [{ id: Math.random().toString(36).substr(2, 9), operatorName, action, targetPersonnel, timestamp: new Date().toISOString() }];
  };

  const handleAnalysis = useCallback(async (entry: string, sentiment: Sentiment, info: PersonnelInfo) => {
    if (!currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeThoughtLog(entry, sentiment, info);
      const analysisWithDate: AnalysisResult = { ...result, date: new Date().toISOString() };
      const newEntry: HistoryEntry = { info, analysis: analysisWithDate, operatorUsername: currentUser.username, operatorName: currentUser.fullName, operatorRank: currentUser.rank, operatorPosition: currentUser.position, operatorUnit: currentUser.unit, timestamp: new Date().toISOString() };

      const updatedHistory = { ...db.history };
      const personHistory = updatedHistory[info.fullName] || [];
      updatedHistory[info.fullName] = [newEntry, ...personHistory];
      
      const displayOperator = currentUser.rank ? `${currentUser.rank} ${currentUser.fullName}` : currentUser.fullName;
      const newActivities = [...db.activities, ...logActivity(displayOperator, 'Đã nhập liệu phân tích cho', info.fullName)];

      saveAndSync({ history: updatedHistory, activities: newActivities });
      setCurrentAnalysis({ result: analysisWithDate, info });
      setView('analysis');
    } catch (e) { setError('Lỗi kết nối máy chủ AI hoặc CSDL.'); } finally { setIsLoading(false); }
  }, [db, currentUser]);

  const handleDeletePersonnel = (name: string) => {
    if (!window.confirm(`Đồng chí có chắc chắn muốn xóa toàn bộ hồ sơ của quân nhân ${name}? Hành động này không thể hoàn tác.`)) return;
    
    const updatedHistory = { ...db.history };
    delete updatedHistory[name];
    
    const operator = currentUser?.fullName || 'Hệ thống';
    const newActivities = [...db.activities, ...logActivity(operator, 'Đã xóa toàn bộ hồ sơ của', name)];
    
    saveAndSync({ history: updatedHistory, activities: newActivities });
    if (selectedPerson === name) {
        setSelectedPerson(null);
        setView('dashboard');
    }
  };

  const handleDeleteEntry = (name: string, timestamp: string) => {
    if (!window.confirm(`Xác nhận xóa bản ghi này?`)) return;
    
    const updatedHistory = { ...db.history };
    if (updatedHistory[name]) {
        updatedHistory[name] = updatedHistory[name].filter(e => e.timestamp !== timestamp);
        if (updatedHistory[name].length === 0) {
            delete updatedHistory[name];
        }
    }
    
    const operator = currentUser?.fullName || 'Hệ thống';
    const newActivities = [...db.activities, ...logActivity(operator, 'Đã xóa 1 bản ghi của', name)];
    
    saveAndSync({ history: updatedHistory, activities: newActivities });
  };

  const generateOfficerSync = async (selectedEntries?: HistoryEntry[]) => {
    setIsLoading(true);
    try {
      const code = await storageService.generateSyncPackage(db, selectedEntries);
      setShowSyncCode(code);
      setView('sync');
      setCopySuccess(false);
    } catch (e) { setError("Không thể nén dữ liệu."); } finally { setIsLoading(false); }
  };

  const handleMergeSync = async (token: string) => {
    try {
      const result = await storageService.mergeData(db, token);
      setDb(result.db);
      return result.addedCount;
    } catch (e) { throw e; }
  };

  const handleCopy = () => {
    if (showSyncCode) {
      navigator.clipboard.writeText(showSyncCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const renderContent = () => {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center p-20 animate-pulse">
          <VietnamEmblemIcon className="h-20 w-20 mb-6 opacity-40" />
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em]">Hệ thống đang nén dữ liệu quân sự...</p>
      </div>
    );

    if (view === 'sync' && showSyncCode) return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <Card className="border-amber-500/50 bg-black/60 !p-10 shadow-2xl relative overflow-hidden rounded-[3rem] text-center border-t-2">
            <div className="relative z-10">
                <div className="mb-6 flex justify-center">
                    <div className="h-16 w-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                </div>
                
                <h2 className="text-amber-500 font-black text-xl uppercase tracking-widest mb-2">GÓI TIN ĐÃ NIÊM PHONG</h2>
                <p className="text-slate-500 text-[10px] mb-8 uppercase tracking-widest">Giao thức nén: GZIP BINARY TOKEN</p>

                <div className="bg-lime-900/10 border border-lime-800 rounded-2xl p-4 mb-8 flex items-center gap-4">
                    <div className="flex-1 text-left">
                        <p className="text-[8px] text-lime-600 font-black uppercase mb-1">Mã định danh Token</p>
                        <p className="text-[11px] font-mono text-lime-400 truncate max-w-[200px]">{showSyncCode}</p>
                    </div>
                    <div className="h-10 w-px bg-lime-800/50"></div>
                    <div className="text-right">
                        <p className="text-[8px] text-lime-600 font-black uppercase mb-1">Dung lượng</p>
                        <p className="text-[11px] font-mono text-amber-500">{(showSyncCode.length / 1024).toFixed(2)} KB</p>
                    </div>
                </div>

                <button 
                    onClick={handleCopy}
                    className={`w-full py-5 rounded-2xl font-black text-xs transition-all shadow-xl active:scale-95 uppercase tracking-[0.3em] border-2 ${
                        copySuccess ? 'bg-green-600 border-green-400 text-white' : 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-white'
                    }`}
                >
                    {copySuccess ? 'ĐÃ SAO CHÉP TOKEN' : 'SAO CHÉP TOKEN GỬI ĐI'}
                </button>
                
                <div className="mt-8 flex justify-center gap-6">
                    <button onClick={() => setView('officer-history')} className="text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all">Quay lại</button>
                    <button onClick={() => setView('form')} className="text-slate-500 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all">Nhập liệu mới</button>
                </div>
            </div>
        </Card>
      </div>
    );

    switch (view) {
      case 'dashboard': return currentUser?.role === UserRole.Admin ? <CommanderDashboard database={db} onSelectPersonnel={(n) => { setSelectedPerson(n); setView('report'); }} onDatabaseUpdate={setDb} onSyncRequest={handleMergeSync} onDeletePersonnel={handleDeletePersonnel} /> : null;
      case 'form': return <EntryForm onAnalyze={handleAnalysis} isLoading={isLoading} history={db.history} />;
      case 'officer-history': return <OfficerHistory history={db.history} currentUserUsername={currentUser?.username || ''} onGenerateSync={generateOfficerSync} onDeleteEntry={handleDeleteEntry} />;
      case 'analysis': return currentAnalysis ? <AnalysisDashboard result={currentAnalysis.result} personnelInfo={currentAnalysis.info} onReset={() => setView(currentUser?.role === UserRole.Admin ? 'dashboard' : 'officer-history')} history={db.history[currentAnalysis.info.fullName] || []} /> : null;
      case 'report': return selectedPerson ? <HistoricalReport history={db.history[selectedPerson] || []} personnelName={selectedPerson} onDeleteEntry={(ts) => handleDeleteEntry(selectedPerson, ts)} /> : null;
      default: return null;
    }
  };

  if (!currentUser) return <Login onLogin={handleLogin} />;

  return (
    <div className="bg-lime-950 min-h-screen text-slate-200 font-sans selection:bg-amber-500/30">
      <div className="bg-black/60 border-b border-lime-900/50 px-6 py-2 flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-500"></span><span className="text-lime-500">MÁY CHỦ: TRỰC TUYẾN</span></div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-slate-400">{currentUser.fullName} [{currentUser.role}]</span>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-400 transition-all">ĐĂNG XUẤT</button>
        </div>
      </div>

      <header className="max-w-7xl mx-auto p-4 sm:p-12">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 mb-16 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <VietnamEmblemIcon className="h-16 w-16 sm:h-24 sm:w-24 drop-shadow-[0_0_15px_rgba(218,37,29,0.4)]" />
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-100 uppercase tracking-tighter leading-none mb-3">QUẢN LÝ TƯ TƯỞNG QUÂN NHÂN</h1>
              <p className="text-lime-500 font-bold text-xs sm:text-sm tracking-[0.4em] uppercase">Hệ thống phân tích hành vi quân nhân</p>
            </div>
          </div>
          
          <nav className="flex bg-lime-900/20 p-1.5 rounded-3xl border border-lime-800 backdrop-blur-md">
            {currentUser?.role === UserRole.Admin && <button onClick={() => setView('dashboard')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'dashboard' ? 'bg-amber-600 text-white shadow-xl scale-105' : 'text-lime-600 hover:text-lime-400'}`}>Bảng Chỉ Huy</button>}
            <button onClick={() => setView('form')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'form' ? 'bg-amber-600 text-white shadow-xl scale-105' : 'text-lime-600 hover:text-lime-400'}`}>Nhập Liệu</button>
            {currentUser?.role === UserRole.Officer && <button onClick={() => setView('officer-history')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'officer-history' ? 'bg-amber-600 text-white shadow-xl scale-105' : 'text-lime-600 hover:text-lime-400'}`}>Lịch Sử</button>}
          </nav>
        </div>

        <main className="max-w-7xl mx-auto pb-20">
          {error && <div className="max-w-3xl mx-auto mb-8 bg-red-950/40 border border-red-800 p-5 rounded-3xl text-xs text-red-400 font-bold uppercase text-center">{error}</div>}
          {renderContent()}
        </main>
      </header>
      
      {/* Global AI ChatBot */}
      <ChatBot />
    </div>
  );
};

export default App;
