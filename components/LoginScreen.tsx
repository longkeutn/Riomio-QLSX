
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/mockApi';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers().then(data => {
      setUsers(data);
      if (data.length > 0) {
        setSelectedUser(data[0].email);
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      onLogin(selectedUser);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Riomio QLSX</h1>
            <p className="mt-2 text-sm text-gray-600">Hệ thống Quản lý Sản xuất Nội bộ</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="user-select" className="sr-only">Chọn người dùng</label>
              {loading ? (
                 <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
              ) : (
                <select
                  id="user-select"
                  name="user"
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                >
                  {users.map(user => (
                    <option key={user.email} value={user.email}>
                      {user.tenHienThi} ({user.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !selectedUser}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md group bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
