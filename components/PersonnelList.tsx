import React from 'react';
import { HistoryEntry } from '../types';
import Card from './common/Card';

interface PersonnelListProps {
  history: Record<string, HistoryEntry[]>;
  onSelect: (name: string) => void;
  selectedPersonnel: string | null;
}

const PersonnelList: React.FC<PersonnelListProps> = ({ history, onSelect, selectedPersonnel }) => {
  const personnelNames = Object.keys(history).sort();

  return (
    <Card>
      <div className="flex justify-between items-center mb-6 border-b border-lime-700 pb-3">
          <h2 className="text-xl font-semibold text-slate-100">Danh Sách Quân Nhân</h2>
      </div>
      {personnelNames.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {personnelNames.map(name => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className={`w-full p-3 rounded-lg text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-lime-900 ${
                selectedPersonnel === name
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-lime-800 hover:bg-lime-700'
              }`}
            >
              <p className="font-semibold">{name}</p>
              <p className={`text-sm ${selectedPersonnel === name ? 'text-amber-100' : 'text-lime-300'}`}>{history[name].length} lần ghi chép</p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-lime-400 text-center py-10">
          Chưa có dữ liệu lịch sử.
        </p>
      )}
    </Card>
  );
};

export default PersonnelList;