
import React, { useState, useMemo } from 'react';
import { User, UserRole } from './types';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { api } from './services/mockApi';

export const AuthContext = React.createContext<{
  user: User | null;
  logout: () => void;
}>({
  user: null,
  logout: () => {},
});

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async (email: string) => {
    const loggedInUser = await api.login(email);
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      alert('User not found or inactive.');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const authContextValue = useMemo(() => ({
    user,
    logout: handleLogout,
  }), [user]);


  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="min-h-screen bg-gray-100">
        {user ? <Dashboard user={user} /> : <LoginScreen onLogin={handleLogin} />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
