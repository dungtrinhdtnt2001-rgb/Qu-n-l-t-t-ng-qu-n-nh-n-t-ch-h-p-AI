import React, { useState } from 'react';
import Card from './common/Card';
import { VietnamEmblemIcon } from './icons/VietnamEmblemIcon';

interface LoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự.');
      return;
    }
     if (password.trim().length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    setError('');
    setIsLoading(true);
    const success = await onLogin(username.trim(), password.trim());
    setIsLoading(false);
    if (!success) {
      setError('Tên người dùng hoặc mật khẩu không chính xác.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-lime-950 text-slate-200 font-sans">
      <Card className="max-w-md w-full animate-fade-in">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <VietnamEmblemIcon className="h-16 w-16" />
            <h1 className="text-2xl font-bold text-slate-100 tracking-wider text-center">
              Hệ Thống Phân Tích Tư Tưởng Quân Nhân
            </h1>
            <p className="text-lime-300 text-center">
              Đăng nhập để tiếp tục. <br/>Nếu tài khoản không tồn tại, hệ thống sẽ tự động tạo mới.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-lime-300 mb-2">
                Tên tài khoản
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên tài khoản của bạn"
                className="w-full p-3 bg-lime-950 border border-lime-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-slate-200 placeholder-lime-500"
                autoFocus
                disabled={isLoading}
              />
            </div>
             <div>
              <label htmlFor="password" aria-label="Mật khẩu" className="block text-sm font-medium text-lime-300 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                className="w-full p-3 bg-lime-950 border border-lime-800 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition text-slate-200 placeholder-lime-500"
                disabled={isLoading}
              />
            </div>
          </div>
          
          {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}

          <button
            type="submit"
            disabled={!username.trim() || !password.trim() || isLoading}
            className="w-full mt-6 bg-amber-600 hover:bg-amber-700 disabled:bg-lime-800 disabled:text-lime-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                </>
            ) : 'Đăng nhập / Đăng ký'}
          </button>
        </form>
      </Card>
       <footer className="w-full max-w-md mt-8 text-center text-lime-400 text-xs">
        <p>&copy; {new Date().getFullYear()} - Nền tảng phân tích AI. Bảo mật và riêng tư là ưu tiên hàng đầu.</p>
      </footer>
    </div>
  );
};

export default Login;
