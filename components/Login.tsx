
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent, role: UserRole) => {
    e.preventDefault();
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: role === UserRole.ADMIN ? 'Admin User' : 'Pro Photographer',
      email: email || (role === UserRole.ADMIN ? 'admin@autostudio.ai' : 'photo@autostudio.ai'),
      role: role
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-slate-900 p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">AutoStudio AI</h2>
          <p className="mt-2 text-sm text-slate-400">Professional Automotive Workflow</p>
        </div>

        <div className="space-y-4">
            <button
                onClick={(e) => handleSubmit(e, UserRole.ADMIN)}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
                Login as Administrator
            </button>
            <button
                onClick={(e) => handleSubmit(e, UserRole.PHOTOGRAPHER)}
                className="w-full flex justify-center py-3 px-4 border border-slate-700 rounded-xl shadow-sm text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all"
            >
                Login as Photographer
            </button>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500">Demo Mode: No password required</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
