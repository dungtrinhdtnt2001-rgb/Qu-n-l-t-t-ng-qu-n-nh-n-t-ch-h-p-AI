
import React, { useState } from 'react';
import Card from './common/Card';
import { VietnamEmblemIcon } from './icons/VietnamEmblemIcon';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (
    username: string, 
    password?: string, 
    role?: UserRole, 
    rank?: string, 
    position?: string, 
    unit?: string
  ) => Promise<{success: boolean, message?: string}>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<UserRole>(UserRole.Officer);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rank, setRank] = useState('');
  const [position, setPosition] = useState('');
  const [unit, setUnit] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === UserRole.Officer) {
      if (username.trim().length < 3) {
        setError('Vui lòng nhập họ tên cán bộ.');
        return;
      }
      if (!rank || !position || !unit) {
        setError('Vui lòng nhập đầy đủ thông tin quân hàm, chức vụ, đơn vị.');
        return;
      }
    }

    if (activeTab === UserRole.Admin && password !== '78564') {
      setError('Mật khẩu quản trị không chính xác.');
      return;
    }
    
    setIsLoading(true);
    const result = await onLogin(
      activeTab === UserRole.Admin ? 'admin' : username.trim(), 
      password, 
      activeTab,
      rank,
      position,
      unit
    );
    
    if (!result.success) {
      setError(result.message || 'Lỗi xác thực hệ thống.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-lime-950 text-slate-200 font-sans selection:bg-amber-500/30">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="flex flex-col items-center mb-8 text-center">
            <VietnamEmblemIcon className="h-20 w-20 mb-6 drop-shadow-[0_0_15px_rgba(255,255,0,0.3)]" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-tighter leading-tight">
              HỆ THỐNG QUẢN LÝ TƯ TƯỞNG <br/> TÍCH HỢP AI
            </h1>
            <p className="mt-2 text-lime-500 font-bold tracking-[0.2em] text-[10px] uppercase">Cơ sở dữ liệu tư tưởng - Quân đội nhân dân Việt Nam</p>
        </div>

        <Card className="!bg-lime-900/40 !border-lime-800/50 !p-0 overflow-hidden shadow-2xl rounded-3xl border border-lime-800">
          <div className="flex border-b border-lime-800">
            <button 
              type="button"
              onClick={() => { setActiveTab(UserRole.Officer); setError(null); }}
              className={`flex-1 py-4 text-xs font-black tracking-widest transition-all ${activeTab === UserRole.Officer ? 'bg-lime-800 text-white border-b-2 border-amber-500' : 'text-lime-600 hover:text-lime-400'}`}
            >
              CÁN BỘ NGHIỆP VỤ
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab(UserRole.Admin); setError(null); }}
              className={`flex-1 py-4 text-xs font-black tracking-widest transition-all ${activeTab === UserRole.Admin ? 'bg-lime-800 text-white border-b-2 border-amber-500' : 'text-lime-600 hover:text-lime-400'}`}
            >
              CHỈ HUY QUẢN LÝ
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {activeTab === UserRole.Officer ? (
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-[10px] font-black text-lime-500 mb-1.5 uppercase tracking-widest">Họ và tên cán bộ</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full p-3 bg-black/40 border border-lime-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none font-bold text-sm text-white"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-lime-500 mb-1.5 uppercase tracking-widest">Cấp bậc</label>
                    <input
                      type="text"
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      placeholder="Thượng úy"
                      className="w-full p-3 bg-black/40 border border-lime-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-lime-500 mb-1.5 uppercase tracking-widest">Chức vụ</label>
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Trung đội trưởng"
                      className="w-full p-3 bg-black/40 border border-lime-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none text-xs text-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-lime-500 mb-1.5 uppercase tracking-widest">Đơn vị</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Đại đội 1, Tiểu đoàn 2"
                    className="w-full p-3 bg-black/40 border border-lime-800 rounded-xl focus:ring-1 focus:ring-amber-500 outline-none text-xs text-white"
                    required
                  />
                </div>
                <p className="text-[9px] text-lime-600 italic text-center">* Dữ liệu nhập từ máy trạm này sẽ định danh theo các thông tin trên.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-[10px] font-black text-lime-500 mb-1.5 uppercase tracking-widest">Mã xác thực Chỉ huy (Admin)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••"
                    className="w-full p-4 bg-black/40 border border-lime-800 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-center text-2xl tracking-[0.5em] text-amber-500"
                    required
                  />
                </div>
                <p className="text-[10px] text-lime-600 italic text-center">* Đăng nhập để xem báo cáo tổng hợp từ tất cả các máy trạm.</p>
              </div>
            )}

            {error && (
              <div className="bg-red-950/50 border border-red-500/50 p-3 rounded-xl text-center">
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-black text-sm rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-[0.2em]"
            >
              {isLoading ? 'ĐANG KẾT NỐI...' : 'BẮT ĐẦU LÀM VIỆC'}
            </button>
          </form>
        </Card>
        
        <div className="mt-8 flex justify-center opacity-20">
            <p className="text-[9px] font-mono text-lime-500 tracking-[0.3em]">ENCRYPTED TERMINAL V4.5 // NO UNAUTHORIZED ACCESS</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
