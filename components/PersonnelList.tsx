import React from 'react';
import { HistoryEntry } from '../types';
import Card from './common/Card';

interface PersonnelListProps {
  history: Record<string, HistoryEntry[]>;
  onSelect: (name: string) => void;
  onBack: () => void;
}

const PersonnelList: React.FC<PersonnelListProps> = ({ history, onSelect }) => {
  const personnelNames = Object.keys(history).sort();

  return (
    <Card className="animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b border-lime-700 pb-3">
          <h2 className="text-xl font-semibold text-slate-100">Chọn Quân Nhân để Xem Báo Cáo</h2>
      </div>
      {personnelNames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {personnelNames.map(name => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className="p-4 bg-lime-800 hover:bg-lime-700 rounded-lg text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <p className="font-semibold text-slate-100">{name}</p>
              <p className="text-sm text-lime-300">{history[name].length} lần ghi chép</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-lime-400 text-center py-10">
          Chưa có dữ liệu lịch sử. Vui lòng nhập một bản phân tích mới để bắt đầu.
        </p>
      )}
    </Card>
  );
};

export default PersonnelList;
