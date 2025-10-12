import React, { useState, useMemo } from 'react';
import { HistoryEntry, Sentiment } from '../types';
import Card from './common/Card';
import { getISOWeek, getMonthName } from '../utils/dateUtils';

interface HistoricalReportProps {
  history: HistoryEntry[];
  personnelName: string;
  onBack: () => void;
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

const HistoricalReport: React.FC<HistoricalReportProps> = ({ history, personnelName, onBack }) => {
  const [period, setPeriod] = useState<Period>('month');

  const aggregatedData = useMemo(() => {
    const groups: { [key: string]: HistoryEntry[] } = {};

    history.forEach(entry => {
      const date = new Date(entry.analysis.date);
      let key = '';
      if (period === 'week') {
        const year = date.getFullYear();
        const week = getISOWeek(date);
        key = `${year}-W${week}`;
      } else if (period === 'month') {
        key = `${date.getFullYear()}-${date.getMonth()}`;
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
        periodLabel = `Tuần ${weekNum}, ${year}`;
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
        
      return { periodLabel, periodKey: key, entryCount, avgSentiment, sentimentCounts, topThemes };
    }).sort((a, b) => b.periodKey.localeCompare(a.periodKey));
  }, [history, period]);

  return (
    <Card className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-lime-700 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100">Báo Cáo Lịch Sử Tư Tưởng</h2>
          <p className="text-amber-300">{personnelName}</p>
        </div>
        <button onClick={onBack} className="mt-4 sm:mt-0 bg-lime-700 hover:bg-lime-600 text-slate-200 font-bold py-2 px-4 rounded-lg transition-colors">
          &larr; Quay lại danh sách
        </button>
      </div>

      <div className="flex justify-center mb-6 p-1 rounded-lg bg-lime-950 border border-lime-800 space-x-2">
        <TabButton label="Theo Tuần" isActive={period === 'week'} onClick={() => setPeriod('week')} />
        <TabButton label="Theo Tháng" isActive={period === 'month'} onClick={() => setPeriod('month')} />
        <TabButton label="Theo Năm" isActive={period === 'year'} onClick={() => setPeriod('year')} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-lime-300 uppercase bg-lime-800/50">
                <tr>
                    <th scope="col" className="px-6 py-3">Kỳ</th>
                    <th scope="col" className="px-6 py-3 text-center">Số Ghi Chép</th>
                    <th scope="col" className="px-6 py-3 text-center">Điểm TB</th>
                    <th scope="col" className="px-6 py-3">Phân loại</th>
                    <th scope="col" className="px-6 py-3">Chủ đề nổi bật</th>
                </tr>
            </thead>
            <tbody>
                {aggregatedData.map(data => (
                    <tr key={data.periodKey} className="border-b border-lime-800 hover:bg-lime-800/30">
                        <th scope="row" className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">{data.periodLabel}</th>
                        <td className="px-6 py-4 text-center">{data.entryCount}</td>
                        <td className={`px-6 py-4 text-center font-bold ${data.avgSentiment > 0.2 ? 'text-green-400' : data.avgSentiment < -0.2 ? 'text-red-400' : 'text-amber-400'}`}>
                            {(data.avgSentiment * 100).toFixed(0)}%
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-x-2 text-xs">
                             <span className="text-green-400" title="Tích cực">{data.sentimentCounts[Sentiment.Positive]} T.cực</span>
                             <span className="text-amber-400" title="Trung lập">{data.sentimentCounts[Sentiment.Neutral]} T.lập</span>
                             <span className="text-red-400" title="Tiêu cực">{data.sentimentCounts[Sentiment.Negative]} T.cực</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                                {data.topThemes.map((theme, i) => <span key={i} className="bg-lime-700 text-amber-300 text-xs font-medium px-2 py-0.5 rounded-full">{theme}</span>)}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {aggregatedData.length === 0 && (
            <p className="text-center py-8 text-lime-400">Không có dữ liệu cho khoảng thời gian này.</p>
        )}
      </div>
    </Card>
  );
};

export default HistoricalReport;
