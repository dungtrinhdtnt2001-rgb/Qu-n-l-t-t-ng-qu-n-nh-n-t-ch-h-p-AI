import React, { useState, useMemo, useEffect } from 'react';
import { HistoryEntry, Sentiment } from '../types';
import Card from './common/Card';
import { getISOWeek, getMonthName } from '../utils/dateUtils';
import { DownloadIcon } from './icons/DownloadIcon';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, LineChart, Line, YAxis, CartesianGrid } from 'recharts';

interface HistoricalReportProps {
  history: HistoryEntry[];
  personnelName: string;
}

type Period = 'week' | 'month' | 'year';

interface AggregatedData {
  periodLabel: string;
  periodKey: string;
  entryCount: number;
  avgSentiment: number;
  sentimentCounts: {
    [Sentiment.Positive]: number;
    [Sentiment.Neutral]: number;
    [Sentiment.Negative]: number;
  };
  topThemes: string[];
  entries: HistoryEntry[];
}

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  [Sentiment.Positive]: '#a3e635', // lime-400
  [Sentiment.Neutral]: '#60a5fa',  // blue-400
  [Sentiment.Negative]: '#ef4444', // red-500
};

const getSentimentColor = (score: number): string => {
  if (score > 0.2) return SENTIMENT_COLORS[Sentiment.Positive];
  if (score < -0.2) return SENTIMENT_COLORS[Sentiment.Negative];
  return SENTIMENT_COLORS[Sentiment.Neutral];
}

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isActive ? 'bg-amber-600 text-white' : 'text-lime-200 hover:bg-lime-800'
        }`}
    >
        {label}
    </button>
);

const HistoricalReport: React.FC<HistoricalReportProps> = ({ history, personnelName }) => {
  const [period, setPeriod] = useState<Period>('month');
  const [selectedPeriodKey, setSelectedPeriodKey] = useState<string | null>(null);

  const aggregatedData = useMemo(() => {
    const groups: { [key: string]: HistoryEntry[] } = {};

    history.forEach(entry => {
      const date = new Date(entry.analysis.date);
      let key = '';
      if (period === 'week') {
        const year = date.getFullYear();
        const week = getISOWeek(date);
        key = `${year}-W${String(week).padStart(2, '0')}`;
      } else if (period === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      } else {
        key = `${date.getFullYear()}`;
      }
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(entry);
    });

    return Object.entries(groups).map(([key, entries]) => {
      let periodLabel = '';
       if (period === 'week') {
        const [year, weekNum] = key.split('-W');
        periodLabel = `Tuần ${parseInt(weekNum, 10)}, ${year}`;
      } else if (period === 'month') {
        const [year, monthIndex] = key.split('-');
        periodLabel = `${getMonthName(parseInt(monthIndex))}, ${year}`;
      } else {
        periodLabel = `Năm ${key}`;
      }

      const entryCount = entries.length;
      const avgSentiment = entries.reduce((acc, e) => acc + e.analysis.sentimentScore, 0) / entryCount;
      const sentimentCounts = {
        [Sentiment.Positive]: entries.filter(e => e.analysis.sentimentCategory === Sentiment.Positive).length,
        [Sentiment.Neutral]: entries.filter(e => e.analysis.sentimentCategory === Sentiment.Neutral).length,
        [Sentiment.Negative]: entries.filter(e => e.analysis.sentimentCategory === Sentiment.Negative).length,
      };

      const themeCounts: { [theme: string]: number } = {};
      entries.flatMap(e => e.analysis.keyThemes).forEach(theme => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
      const topThemes = Object.entries(themeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(item => item[0]);
        
      return { periodLabel, periodKey: key, entryCount, avgSentiment, sentimentCounts, topThemes, entries: entries.sort((a,b) => new Date(a.analysis.date).getTime() - new Date(b.analysis.date).getTime()) };
    }).sort((a, b) => b.periodKey.localeCompare(a.periodKey));
  }, [history, period]);
  
  useEffect(() => {
    if (aggregatedData.length > 0) {
      setSelectedPeriodKey(aggregatedData[0].periodKey);
    } else {
      setSelectedPeriodKey(null);
    }
  }, [aggregatedData]);

  const selectedPeriodData = useMemo(() => {
    return aggregatedData.find(d => d.periodKey === selectedPeriodKey);
  }, [aggregatedData, selectedPeriodKey]);

  const sentimentChartData = useMemo(() => {
    if (!selectedPeriodData) return [];
    return [
      { name: 'T.Cực', count: selectedPeriodData.sentimentCounts[Sentiment.Positive], color: SENTIMENT_COLORS[Sentiment.Positive] },
      { name: 'T.Lập', count: selectedPeriodData.sentimentCounts[Sentiment.Neutral], color: SENTIMENT_COLORS[Sentiment.Neutral] },
      { name: 'T.Cực', count: selectedPeriodData.sentimentCounts[Sentiment.Negative], color: SENTIMENT_COLORS[Sentiment.Negative] },
    ];
  }, [selectedPeriodData]);

  const trendChartData = useMemo(() => {
    if (!selectedPeriodData) return [];
    return selectedPeriodData.entries.map(entry => ({
      date: new Date(entry.analysis.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      'Điểm tinh thần': entry.analysis.sentimentScore,
    }));
  }, [selectedPeriodData]);


  const handleExportCSV = () => {
    if (aggregatedData.length === 0) return;
    const headers = ['Kỳ', 'Số Ghi Chép', 'Điểm TB (%)', 'Tích Cực', 'Trung Lập', 'Tiêu Cực', 'Chủ Đề Nổi Bật'];
    const escapeCsvField = (field: any): string => {
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    };
    const rows = aggregatedData.map(data => [
      escapeCsvField(data.periodLabel), data.entryCount, (data.avgSentiment * 100).toFixed(0),
      data.sentimentCounts[Sentiment.Positive], data.sentimentCounts[Sentiment.Neutral], data.sentimentCounts[Sentiment.Negative],
      escapeCsvField(data.topThemes.join(' | ')),
    ].join(','));
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const sanitizedName = personnelName.replace(/ /g, '_');
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Bao_cao_tu_tuong_${sanitizedName}_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b border-lime-700 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Báo Cáo Lịch Sử Tư Tưởng</h2>
          <p className="text-amber-300">{personnelName}</p>
        </div>
        <button
          onClick={handleExportCSV} disabled={aggregatedData.length === 0}
          className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-4 py-2 bg-lime-700 hover:bg-lime-600 text-slate-200 font-medium rounded-lg transition-colors disabled:bg-lime-800 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Export report to CSV"
        >
          <DownloadIcon className="w-4 h-4" />
          <span>Xuất CSV</span>
        </button>
      </div>

      <div className="flex justify-center mb-6 p-1 rounded-lg bg-lime-950 border border-lime-800 space-x-2">
        <TabButton label="Theo Tuần" isActive={period === 'week'} onClick={() => setPeriod('week')} />
        <TabButton label="Theo Tháng" isActive={period === 'month'} onClick={() => setPeriod('month')} />
        <TabButton label="Theo Năm" isActive={period === 'year'} onClick={() => setPeriod('year')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
        {/* Left Panel: Period List */}
        <div className="lg:col-span-1 bg-lime-950 p-3 rounded-lg border border-lime-800 max-h-[70vh] overflow-y-auto">
          {aggregatedData.length > 0 ? (
            <div key={period} className="space-y-2 animate-fade-in">
              {aggregatedData.map(data => (
                <button 
                  key={data.periodKey} 
                  onClick={() => setSelectedPeriodKey(data.periodKey)}
                  className={`w-full p-3 rounded-lg text-left transition-colors duration-200 border-l-4 ${
                    selectedPeriodKey === data.periodKey 
                    ? `bg-amber-800/40 border-amber-500` 
                    : `bg-lime-800/50 border-transparent hover:bg-lime-800`
                  }`}
                >
                  <p className="font-semibold text-slate-100">{data.periodLabel}</p>
                  <p className="text-sm text-lime-300">{data.entryCount} ghi chép</p>
                  <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-bold" style={{color: getSentimentColor(data.avgSentiment)}}>
                        TB: {(data.avgSentiment * 100).toFixed(0)}%
                      </span>
                      <div className="w-full bg-lime-700 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${(data.avgSentiment / 2 + 0.5) * 100}%`, backgroundColor: getSentimentColor(data.avgSentiment)}}></div>
                      </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
             <div className="flex items-center justify-center h-full">
                <p className="text-center text-lime-400">Không có dữ liệu.</p>
             </div>
          )}
        </div>
        
        {/* Right Panel: Details */}
        <div className="lg:col-span-2">
          {selectedPeriodData ? (
            <div key={selectedPeriodKey} className="space-y-4 animate-fade-in">
              <Card className="!p-4">
                <h3 className="font-semibold text-slate-100 mb-3">Tổng quan {selectedPeriodData.periodLabel.toLowerCase()}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-lime-950 p-3 rounded-lg">
                      <p className="text-2xl font-bold text-slate-100">{selectedPeriodData.entryCount}</p>
                      <p className="text-xs text-lime-400">Ghi chép</p>
                  </div>
                  <div className="bg-lime-950 p-3 rounded-lg">
                      <p className="text-2xl font-bold" style={{color: getSentimentColor(selectedPeriodData.avgSentiment)}}>{(selectedPeriodData.avgSentiment * 100).toFixed(0)}%</p>
                      <p className="text-xs text-lime-400">Tinh thần TB</p>
                  </div>
                  <div className="col-span-2 bg-lime-950 p-3 rounded-lg">
                     <ResponsiveContainer width="100%" height={50}>
                        <BarChart data={sentimentChartData} layout="vertical" barCategoryGap={1}>
                            <Tooltip cursor={{fill: '#4d7c0f'}} contentStyle={{ backgroundColor: '#1a2e05', border: '1px solid #365314', color: '#e2e8f0', fontSize: '12px', padding: '4px 8px' }} />
                            <Bar dataKey="count" stackId="a" radius={[4, 4, 4, 4]}>
                                {sentimentChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Bar>
                        </BarChart>
                     </ResponsiveContainer>
                     <p className="text-xs text-lime-400 -mt-2">Phân loại</p>
                  </div>
                </div>
              </Card>

              {trendChartData.length > 1 && (
                  <Card className="!p-4">
                      <h3 className="font-semibold text-slate-100 mb-3 text-sm">Diễn biến tinh thần</h3>
                      <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={trendChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4d7c0f" />
                            <XAxis dataKey="date" stroke="#a3e635" fontSize={10} tick={{ fill: '#d9f99d' }} />
                            <YAxis domain={[-1, 1]} stroke="#a3e635" fontSize={10} tick={{ fill: '#d9f99d' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1a2e05', border: '1px solid #365314', color: '#e2e8f0' }} labelStyle={{color: '#bef264'}}/>
                            <Line type="monotone" dataKey="Điểm tinh thần" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                  </Card>
              )}

              <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2">
                <h3 className="font-semibold text-slate-100 text-sm">Chi tiết ghi chép</h3>
                {selectedPeriodData.entries.map((entry, index) => (
                    <div key={index} className="bg-lime-900/70 p-3 rounded-lg border-l-4" style={{borderColor: getSentimentColor(entry.analysis.sentimentScore)}}>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-2">
                            <p className="font-bold text-slate-200 text-sm">
                                {new Date(entry.analysis.date).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <span className="font-bold px-2 py-0.5 rounded text-xs text-white" style={{backgroundColor: getSentimentColor(entry.analysis.sentimentScore)}}>
                                {entry.analysis.sentimentCategory} ({(entry.analysis.sentimentScore * 100).toFixed(0)}%)
                            </span>
                        </div>
                         <details className="text-sm">
                           <summary className="cursor-pointer text-lime-300 hover:text-amber-300">Xem chi tiết phân tích</summary>
                           <div className="space-y-2 mt-2 pt-2 border-t border-lime-800">
                               <div>
                                   <h5 className="font-semibold text-lime-300">Tóm tắt:</h5>
                                   <p className="text-slate-300 text-justify">{entry.analysis.summary}</p>
                               </div>
                               <div>
                                   <h5 className="font-semibold text-lime-300">Nhận định:</h5>
                                   <p className="text-slate-300 text-justify">{entry.analysis.insights}</p>
                               </div>
                               <div>
                                   <h5 className="font-semibold text-amber-300">Đề xuất:</h5>
                                   <p className="text-amber-100 whitespace-pre-line text-justify">{entry.analysis.officerRecommendations}</p>
                               </div>
                           </div>
                         </details>
                    </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-lime-300 text-center">
                {aggregatedData.length > 0 ? 'Chọn một kỳ báo cáo bên trái để xem chi tiết.' : 'Không có dữ liệu lịch sử để hiển thị.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default HistoricalReport;