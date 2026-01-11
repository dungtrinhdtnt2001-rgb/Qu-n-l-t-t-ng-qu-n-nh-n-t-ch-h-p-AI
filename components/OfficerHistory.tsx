
import React, { useState, useMemo } from 'react';
import { HistoryEntry, Sentiment } from '../types';
import Card from './common/Card';

interface OfficerHistoryProps {
  history: Record<string, HistoryEntry[]>;
  currentUserUsername: string;
  onGenerateSync: (selected: HistoryEntry[]) => void;
  onDeleteEntry?: (name: string, timestamp: string) => void;
}

const OfficerHistory: React.FC<OfficerHistoryProps> = ({ history, currentUserUsername, onGenerateSync, onDeleteEntry }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Lọc ra các bản ghi do user hiện tại nhập
  const myEntries = useMemo(() => {
    const entries: HistoryEntry[] = [];
    Object.keys(history).forEach(name => {
      const personEntries = history[name];
      personEntries.forEach(entry => {
        if (entry.operatorUsername === currentUserUsername) {
          entries.push(entry);
        }
      });
    });
    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [history, currentUserUsername]);

  const toggleSelect = (timestamp: string) => {
    const next = new Set(selectedIds);
    if (next.has(timestamp)) next.delete(timestamp);
    else next.add(timestamp);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === myEntries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(myEntries.map(e => e.timestamp)));
    }
  };

  const handleSyncSelected = () => {
    const selected = myEntries.filter(e => selectedIds.has(e.timestamp));
    if (selected.length === 0) return;
    onGenerateSync(selected);
  };

  const handleDeleteSelected = () => {
    if (!window.confirm(`Xóa ${selectedIds.size} bản ghi đã chọn?`)) return;
    selectedIds.forEach(id => {
        const entry = myEntries.find(e => e.timestamp === id);
        if (entry) onDeleteEntry?.(entry.info.fullName, id);
    });
    setSelectedIds(new Set());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">LỊCH SỬ NHẬP LIỆU CỦA BẠN</h2>
          <p className="text-xs text-lime-600">Bạn đã thực hiện {myEntries.length} bản ghi phân tích tư tưởng.</p>
        </div>
        
        <div className="flex gap-2">
            {selectedIds.size > 0 && (
                <>
                    <button 
                        onClick={handleDeleteSelected}
                        className="bg-red-900/40 hover:bg-red-600 text-red-500 hover:text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all"
                    >
                        XÓA {selectedIds.size} ĐÃ CHỌ
                    </button>
                    <button 
                        onClick={handleSyncSelected}
                        className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2 animate-bounce"
                    >
                        GỬI {selectedIds.size} ĐÃ CHỌN
                    </button>
                </>
            )}
        </div>
      </div>

      <Card className="!p-0 overflow-hidden border-lime-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-lime-900/50 text-lime-500 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="p-4 border-b border-lime-800 w-10">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === myEntries.length && myEntries.length > 0} 
                    onChange={toggleAll}
                    className="accent-amber-500 w-4 h-4"
                  />
                </th>
                <th className="p-4 border-b border-lime-800">Đối tượng</th>
                <th className="p-4 border-b border-lime-800">Thời gian</th>
                <th className="p-4 border-b border-lime-800 text-center">Trạng thái AI</th>
                <th className="p-4 border-b border-lime-800 text-right">Tác vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lime-900/50">
              {myEntries.map((entry) => (
                <tr 
                  key={entry.timestamp} 
                  className={`hover:bg-lime-800/20 transition-colors cursor-pointer ${selectedIds.has(entry.timestamp) ? 'bg-amber-900/10' : ''}`}
                  onClick={() => toggleSelect(entry.timestamp)}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(entry.timestamp)} 
                      onChange={() => toggleSelect(entry.timestamp)}
                      className="accent-amber-500 w-4 h-4"
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-200">{entry.info.fullName}</p>
                    <p className="text-[9px] text-lime-600 uppercase">{entry.info.unit}</p>
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    {new Date(entry.timestamp).toLocaleString('vi-VN')}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${
                      entry.analysis.sentimentCategory === Sentiment.Negative ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      entry.analysis.sentimentCategory === Sentiment.Positive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {entry.analysis.sentimentCategory}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteEntry?.(entry.info.fullName, entry.timestamp); }}
                        className="text-red-500 hover:text-red-400 p-2"
                        title="Xóa bản ghi"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {myEntries.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-lime-800 italic text-sm">Bạn chưa có bản ghi nào. Hãy bắt đầu bằng cách chọn "Nhập Liệu".</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OfficerHistory;
