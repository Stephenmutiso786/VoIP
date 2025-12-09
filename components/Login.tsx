import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { User } from '../types';
import { PhoneIcon } from '@heroicons/react/24/solid';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('lewis');
  const [password, setPassword] = useState('lewis123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <div className="bg-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500 opacity-50 transform rotate-12 scale-150 -z-0"></div>
          <div className="relative z-10 flex flex-col items-center">
             <div className="bg-white p-3 rounded-full shadow-lg mb-4">
               <PhoneIcon className="h-8 w-8 text-blue-600" />
             </div>
             <h1 className="text-3xl font-bold text-white tracking-wide">VetraCom</h1>
             <p className="text-blue-100 mt-2 text-sm font-medium tracking-wider">ENTERPRISE VOIP MONITOR</p>
          </div>
        </div>
        
        <div className="p-8 pt-10">
           <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Username</label>
                 <input 
                   type="text" 
                   required
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium"
                   placeholder="Enter username"
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Password</label>
                 <input 
                   type="password" 
                   required
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 font-medium"
                   placeholder="Enter password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />
              </div>

              {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{error}</p>}

              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Access Dashboard
              </button>
           </form>

           <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400">
               Protected System. Authorized Personnel Only.
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};