import React from 'react';
import { AnalysisResult, Sentiment, PersonnelInfo, HistoryEntry } from '../types';
import Card from './common/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Label, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  personnelInfo: PersonnelInfo;
  onReset: () => void;
  history: HistoryEntry[];
}

const SENTIMENT_COLORS: Record<Sentiment, string> = {
  [Sentiment.Positive]: '#22c55e', // green-500
  [Sentiment.Neutral]: '#f59e0b',  // amber-500
  [Sentiment.Negative]: '#ef4444', // red-500
};

const getSentimentColor = (score: number): string => {
  if (score > 0.2) return SENTIMENT_COLORS[Sentiment.Positive];
  if (score < -0.2) return SENTIMENT_COLORS[Sentiment.Negative];
  return SENTIMENT_COLORS[Sentiment.Neutral];
}

const InfoField: React.FC<{label: string, value: string}> = ({label, value}) => (
    <div>
        <p className="text-xs text-lime-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-slate-200">{value}</p>
    </div>
);

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, personnelInfo, onReset, history }) => {
  const sentimentColor = getSentimentColor(result.sentimentScore);
  const pieData = [
    { name: 'score', value: Math.abs(result.sentimentScore * 100) },
    { name: 'empty', value: 100 - Math.abs(result.sentimentScore * 100) },
  ];
  
  const chartData = history.map(entry => ({
      date: new Date(entry.analysis.date).toLocaleDateString('vi-VN'),
      'Điểm tinh thần': entry.analysis.sentimentScore,
  }));

  return (
    <div className="animate-fade-in space-y-6">
      <Card>
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Thông Tin Quân Nhân</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <InfoField label="Họ và Tên" value={personnelInfo.fullName} />
              <InfoField label="Cấp bậc" value={personnelInfo.rank} />
              <InfoField label="Chức vụ" value={personnelInfo.position} />
              <InfoField label="Đơn vị" value={personnelInfo.unit} />
              <InfoField label="Ngày sinh" value={new Date(personnelInfo.dob).toLocaleDateString('vi-VN')} />
          </div>
      </Card>
      
      {history && history.length > 0 && (
          <Card>
              <h2 className="text-xl font-semibold text-slate-100 mb-4">Lịch Sử Tinh Thần</h2>
              {history.length > 1 ? (
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4d7c0f" />
                            <XAxis dataKey="date" stroke="#a3e635" fontSize={12} />
                            <YAxis domain={[-1, 1]} stroke="#a3e635" fontSize={12} />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#1a2e05', 
                                    border: '1px solid #365314',
                                    color: '#e2e8f0'
                                }}
                                labelStyle={{color: '#bef264'}}
                            />
                            <Legend wrapperStyle={{color: '#e2e8f0'}} />
                            <Line type="monotone" dataKey="Điểm tinh thần" stroke="#fbbf24" strokeWidth={2} dot={{ r: 4, fill: '#fbbf24' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                  </div>
              ) : (
                  <p className="text-lime-400 text-center py-8">Đây là phân tích đầu tiên. Xu hướng sẽ được hiển thị ở các lần phân tích sau.</p>
              )}
          </Card>
      )}

      <Card>
        <h2 className="text-xl font-semibold text-slate-100 mb-6 text-center">Kết Quả Phân Tích AI Mới Nhất</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sentiment Gauge */}
          <div className="md:col-span-1 flex flex-col items-center justify-center bg-lime-900 p-4 rounded-lg">
            <h3 className="font-semibold text-lime-300 mb-2">Chỉ số tinh thần</h3>
            <div style={{ width: '100%', height: 160 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={75}
                    startAngle={180}
                    endAngle={-180}
                    fill="#8884d8"
                    paddingAngle={0}
                    cornerRadius={5}
                  >
                    <Cell fill={sentimentColor} />
                    <Cell fill="#365314" />
                  </Pie>
                   <Label
                      value={result.sentimentCategory}
                      position="center"
                      dy={-5}
                      style={{ fill: sentimentColor, fontSize: '20px', fontWeight: 'bold' }}
                    />
                    <Label
                      value={`${(result.sentimentScore * 100).toFixed(0)}%`}
                      position="center"
                      dy={20}
                      style={{ fill: '#e2e8f0', fontSize: '16px' }}
                    />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Key Themes */}
          <div className="md:col-span-2 bg-lime-900 p-4 rounded-lg">
            <h3 className="font-semibold text-lime-300 mb-3">Chủ đề chính</h3>
            <div className="flex flex-wrap gap-2">
              {result.keyThemes.length > 0 ? (
                result.keyThemes.map((theme, index) => (
                  <span key={index} className="bg-lime-700 text-amber-300 text-sm font-medium px-3 py-1 rounded-full">
                    {theme}
                  </span>
                ))
              ) : (
                <p className="text-lime-400">Không xác định được chủ đề chính.</p>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-lime-900 p-4 rounded-lg">
          <h3 className="font-semibold text-lime-300 mb-2">Tóm tắt ghi chép</h3>
          <p className="text-slate-300 leading-relaxed text-justify">{result.summary}</p>
        </div>

        {/* Insights */}
        <div className="mt-6 bg-lime-900 p-4 rounded-lg border-l-4" style={{borderColor: sentimentColor}}>
          <h3 className="font-semibold text-lime-300 mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Nhận định & Phân tích tâm lý
          </h3>
          <p className="text-slate-300 leading-relaxed text-justify">{result.insights}</p>
        </div>
        
        {/* Officer Recommendations */}
        <div className="mt-6 bg-amber-900/30 border border-amber-700 p-4 rounded-lg">
          <h3 className="font-bold text-amber-300 mb-2 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
            Biện pháp đề xuất cho Cán bộ Chính trị
          </h3>
          <p className="text-amber-100 leading-relaxed text-justify whitespace-pre-line">{result.officerRecommendations}</p>
        </div>

        <button
          onClick={onReset}
          className="w-full mt-8 bg-lime-700 hover:bg-lime-600 text-slate-200 font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Nhập bản ghi mới
        </button>
      </Card>
    </div>
  );
};

export default AnalysisDashboard;
