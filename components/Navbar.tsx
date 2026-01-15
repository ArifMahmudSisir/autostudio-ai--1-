
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          <span className="text-xs font-medium text-slate-300">System Online</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
          <p className="text-xs font-medium text-slate-400">{user.role}</p>
        </div>
        <div className="relative group">
            <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border-2 border-slate-800 shadow-lg">
            {user.name.charAt(0)}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                    <button 
                        onClick={onLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-700 rounded-md transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
