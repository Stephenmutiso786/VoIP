import React from 'react';
import { User, UserRole } from '../types';
import { 
  PhoneIcon, 
  ChartBarIcon, 
  TableCellsIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentPage, onNavigate }) => {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PhoneIcon, roles: [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.AGENT] },
    { id: 'logs', label: 'Call Logs', icon: TableCellsIcon, roles: [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.AGENT] },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon, roles: [UserRole.ADMIN, UserRole.SUPERVISOR] },
    { id: 'ai-insights', label: 'AI Analyst', icon: SparklesIcon, roles: [UserRole.ADMIN, UserRole.SUPERVISOR] },
    { id: 'settings', label: 'Settings', icon: Cog6ToothIcon, roles: [UserRole.ADMIN] },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-20 shadow-2xl">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-900/50">
             <PhoneIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">VetraCom</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">VoIP Monitor</p>
          </div>
        </div>

        <div className="px-6 py-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              if (!item.roles.includes(user.role)) return null;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800/50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 py-3 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-red-500/20"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-72 min-h-screen">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
           {/* Mobile Menu Button (Hidden on Desktop) */}
           <div className="md:hidden flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <PhoneIcon className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-slate-900">VetraCom</span>
           </div>

           {/* Search Bar (Desktop) */}
           <div className="hidden md:flex relative max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Global Search (Calls, Agents, Dates)..." 
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
              />
           </div>

           {/* Right Actions */}
           <div className="flex items-center space-x-4">
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                 <BellIcon className="h-6 w-6" />
                 <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
              </button>
              
              <div className="h-8 w-px bg-slate-200 mx-2"></div>

              <div className="flex items-center space-x-3 pl-2">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                 </div>
                 <img 
                   src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`} 
                   alt="Profile" 
                   className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                 />
              </div>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-30 pb-safe">
         {navItems.map((item) => {
            if (!item.roles.includes(user.role)) return null;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`p-2 rounded-xl transition-colors ${currentPage === item.id ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
              >
                <item.icon className="h-6 w-6" />
              </button>
            )
         })}
      </nav>
    </div>
  );
};