
import React, { useMemo, useState } from 'react';
import { CentralDatabase, Sentiment } from '../types';
import Card from './common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

interface CommanderDashboardProps {
  database: CentralDatabase;
  onSelectPersonnel: (name: string) => void;
  onDatabaseUpdate: (newDb: CentralDatabase) => void;
  onSyncRequest: (token: string) => Promise<number>;
  onDeletePersonnel?: (name: string) => void;
}

const CommanderDashboard: React.FC<CommanderDashboardProps> = ({ database, onSelectPersonnel, onDatabaseUpdate, onSyncRequest, onDeletePersonnel }) => {
  const { history, activities } = database;
  const personnelNames = Object.keys(history);
  const [syncCode, setSyncCode] = useState('');
  const [syncStatus, setSyncStatus] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const stats = useMemo(() => {
    let totalEntries = 0;
    let criticalAlerts = 0;
    let todayEntries = 0;
    const today = new Date().toISOString().split('T')[0];

    personnelNames.forEach(name => {
      const entries = history[name];
      totalEntries += entries.length;
      entries.forEach(e => {
        if (e.analysis.sentimentCategory === Sentiment.Negative) criticalAlerts++;
        if (e.analysis.date.startsWith(today)) todayEntries++;
      });
    });

    return { totalEntries, criticalAlerts, todayEntries, totalPersonnel: personnelNames.length };
  }, [history, personnelNames]);

  const handleMerge = async () => {
    if (!syncCode.trim() || isSyncing) return;
    setIsSyncing(true);
    try {
      const addedCount = await onSyncRequest(syncCode);
      setSyncStatus({ msg: `GIẢI NÉN THÀNH CÔNG: Đã tiếp nhận ${addedCount} bản ghi mới.`, type: 'success' });
      setSyncCode('');
    } catch (e) {
      setSyncStatus({ msg: "TOKEN KHÔNG HỢP LỆ: Sai định dạng hoặc lỗi nén.", type: 'error' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 6000);
    }
  };

  const unitTrendData = useMemo(() => {
    const dailyData: Record<string, { date: string, score: number, count: number }> = {};
    personnelNames.forEach(name => {
      history[name].forEach(e => {
        const date = e.analysis.date.split('T')[0];
        if (!dailyData[date]) dailyData[date] = { date, score: 0, count: 0 };
        dailyData[date].score += e.analysis.sentimentScore;
        dailyData[date].count += 1;
      });
    });
    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date)).map(d => ({
        date: new Date(d.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        'Chỉ số đơn vị': Number((d.score / d.count).toFixed(2))
      })).slice(-10);
  }, [history, personnelNames]);

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-amber-500/30 bg-amber-900/10 !p-8 rounded-[2.5rem]">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-amber-500 font-black text-sm uppercase tracking-widest mb-2 flex items-center justify-center lg:justify-start gap-3">
              <span className="h-2 w-2 bg-amber-500 rounded-full animate-ping"></span>
              TRUNG TÂM TIẾP NHẬN TOKEN TỔNG HỢP
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Dán mã Token rút gọn nhận được từ Sĩ quan để cập nhật dữ liệu.</p>
          </div>
          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">
            <input 
              type="text" 
              value={syncCode}
              onChange={(e) => setSyncCode(e.target.value)}
              placeholder="Dán Token rút gọn..."
              className="flex-1 lg:w-64 bg-black/40 border border-amber-900/50 rounded-2xl px-5 py-4 text-xs text-amber-100 outline-none focus:border-amber-500 font-mono"
            />
            <button 
              onClick={handleMerge}
              disabled={isSyncing}
              className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-2xl text-[10px] font-black transition-all shadow-xl uppercase tracking-widest"
            >
              {isSyncing ? 'ĐANG GIẢI NÉN...' : 'GIẢI NÉN TOKEN'}
            </button>
          </div>
        </div>
        {syncStatus && (
          <div className={`mt-4 p-4 rounded-2xl border text-[9px] font-black text-center uppercase tracking-widest animate-fade-in ${syncStatus.type === 'success' ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-red-900/20 border-red-500 text-red-400'}`}>
            {syncStatus.msg}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="!p-6 bg-lime-900/40 border-lime-800 rounded-3xl">
          <p className="text-[9px] text-lime-500 font-black uppercase tracking-widest mb-2">Quân số quản lý</p>
          <p className="text-4xl font-black text-white">{stats.totalPersonnel}</p>
        </Card>
        <Card className="!p-6 bg-lime-900/40 border-lime-800 rounded-3xl">
          <p className="text-[9px] text-lime-500 font-black uppercase tracking-widest mb-2">Tổng lượt nhập liệu</p>
          <p className="text-4xl font-black text-white">{stats.totalEntries}</p>
        </Card>
        <Card className="!p-6 bg-amber-900/20 border-amber-800/50 rounded-3xl">
          <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest mb-2">Tiếp nhận hôm nay</p>
          <p className="text-4xl font-black text-amber-100">{stats.todayEntries}</p>
        </Card>
        <Card className="!p-6 bg-red-900/20 border-red-800/50 rounded-3xl">
          <p className="text-[9px] text-red-500 font-black uppercase tracking-widest mb-2">Cảnh báo rủi ro</p>
          <p className="text-4xl font-black text-red-500">{stats.criticalAlerts}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="!p-8 rounded-[2rem]">
          <h3 className="text-xs font-black text-slate-100 mb-8 uppercase tracking-widest flex items-center gap-3">
            <div className="w-1.5 h-6 bg-amber-500"></div>
            Xu hướng Tư tưởng Đơn vị
          </h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer>
              <LineChart data={unitTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#365314" vertical={false} />
                <XAxis dataKey="date" stroke="#4d7c0f" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis domain={[-1, 1]} stroke="#4d7c0f" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1a2e05', border: '1px solid #365314', borderRadius: '15px' }} />
                <Line type="monotone" dataKey="Chỉ số đơn vị" stroke="#f59e0b" strokeWidth={5} dot={{ r: 5, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="!p-8 rounded-[2rem] flex flex-col">
          <h3 className="text-xs font-black text-slate-100 mb-8 uppercase tracking-widest flex items-center gap-3">
            <div className="w-1.5 h-6 bg-lime-500"></div>
            Nhật ký Truyền tin
          </h3>
          <div className="flex-1 overflow-y-auto max-h-[280px] space-y-4 pr-3 custom-scrollbar">
            {activities.length > 0 ? (
              activities.slice().reverse().map((log) => (
                <div key={log.id} className="bg-black/30 p-4 rounded-2xl border border-lime-900/50 text-[10px] flex justify-between items-start gap-4">
                  <div>
                    <span className="text-amber-500 font-black uppercase">[{log.operatorName}]</span>
                    <span className="text-slate-300 ml-3">{log.action}</span>
                    {log.targetPersonnel && <span className="text-lime-400 font-bold block mt-2">Dữ liệu: {log.targetPersonnel}</span>}
                  </div>
                  <span className="text-lime-700 font-mono">{new Date(log.timestamp).toLocaleTimeString('vi-VN')}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-lime-800 py-16 italic text-xs uppercase tracking-widest">Chưa có kết nối truyền tin nào.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="!p-8 rounded-[2.5rem]">
        <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">Danh Sách Quân Số Theo Dõi</h3>
            <span className="text-[9px] text-lime-700 font-mono tracking-widest">TOTAL_RECORDS: {personnelNames.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-lime-950/40 text-lime-600 uppercase text-[9px] font-black tracking-[0.2em]">
              <tr>
                <th className="p-5 border-b border-lime-900">Quân nhân</th>
                <th className="p-5 border-b border-lime-900">Đơn vị</th>
                <th className="p-5 border-b border-lime-900">Nguồn dữ liệu</th>
                <th className="p-5 border-b border-lime-900">Chỉ số AI</th>
                <th className="p-5 border-b border-lime-900 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lime-900/40">
              {personnelNames.map(name => {
                const latest = history[name][0];
                return (
                  <tr key={name} className="hover:bg-lime-800/10 transition-colors">
                    <td className="p-5 font-bold text-slate-200">{name}</td>
                    <td className="p-5 text-lime-500 text-[10px] font-bold">{latest.info.unit}</td>
                    <td className="p-5">
                        <div className="flex flex-col">
                            <span className="text-amber-500 text-[9px] font-black uppercase">{latest.operatorRank} {latest.operatorName}</span>
                            <span className="text-slate-600 text-[8px] uppercase tracking-tighter">{latest.operatorUnit}</span>
                        </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border ${
                        latest.analysis.sentimentCategory === Sentiment.Negative ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        latest.analysis.sentimentCategory === Sentiment.Positive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {latest.analysis.sentimentCategory}
                      </span>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <button onClick={() => onSelectPersonnel(name)} className="bg-lime-800 hover:bg-amber-600 text-white px-5 py-2 rounded-xl text-[9px] font-black transition-all uppercase tracking-widest">Hồ sơ</button>
                      <button 
                        onClick={() => onDeletePersonnel?.(name)} 
                        className="bg-red-900/40 hover:bg-red-600 text-red-500 hover:text-white px-3 py-2 rounded-xl transition-all"
                        title="Xóa hồ sơ"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CommanderDashboard;
