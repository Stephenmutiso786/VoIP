
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Call } from '../types';
import { 
  PhoneIcon, 
  ChartBarIcon, 
  TableCellsIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  SparklesIcon,
  BellIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserCircleIcon,
  KeyIcon,
  CameraIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  calls?: Call[];
  onUpdateUser: (user: User) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentPage, onNavigate, calls = [], onUpdateUser }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Call[]>([]);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
      name: '',
      password: '',
      avatarSeed: ''
  });

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: 'Missed Call Alert', desc: 'High volume of missed calls in Sales queue.', time: '2m ago', type: 'urgent' },
    { id: 2, title: 'System Update', desc: 'PBX Connector v2.4.1 installed successfully.', time: '1h ago', type: 'info' },
    { id: 3, title: 'New Agent', desc: 'James joined the support team.', time: '3h ago', type: 'info' },
  ];

  // Initialize form when modal opens
  useEffect(() => {
    if (isProfileModalOpen) {
        setProfileForm({
            name: user.name,
            password: user.password || '',
            avatarSeed: user.username
        });
    }
  }, [isProfileModalOpen, user]);

  // Search Logic
  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = calls.filter(call => 
        call.caller.includes(searchQuery) || 
        call.receiver.includes(searchQuery) || 
        (call.agent && call.agent.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, calls]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdateUser({
          ...user,
          name: profileForm.name,
          password: profileForm.password,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileForm.avatarSeed}`
      });
      setIsProfileModalOpen(false);
  };
  
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
           <div className="hidden md:flex relative max-w-md w-full" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                placeholder="Global Search (Calls, Agents)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all sm:text-sm"
              />
              {/* Search Dropdown Results */}
              {searchQuery.length > 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                   {searchResults.length > 0 ? (
                      <div>
                        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                           Recent Matches
                        </div>
                        {searchResults.map(call => (
                           <div key={call.id} onClick={() => { onNavigate('logs'); setSearchQuery(''); }} className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0">
                              <p className="text-sm font-medium text-slate-900">{call.caller} → {call.receiver}</p>
                              <div className="flex justify-between items-center mt-1">
                                 <span className="text-xs text-slate-500">{new Date(call.startTime).toLocaleTimeString()}</span>
                                 <span className={`text-[10px] px-1.5 py-0.5 rounded ${call.status === 'Missed' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {call.status}
                                 </span>
                              </div>
                           </div>
                        ))}
                      </div>
                   ) : (
                      <div className="p-4 text-center text-sm text-slate-500">No matching calls found</div>
                   )}
                </div>
              )}
           </div>

           {/* Right Actions */}
           <div className="flex items-center space-x-4">
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`relative p-2 rounded-full transition-colors ${isNotificationsOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <BellIcon className="h-6 w-6" />
                   <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                </button>
                
                {/* Notification Dropdown */}
                {isNotificationsOpen && (
                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in-up">
                      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                         <h3 className="font-semibold text-slate-800">Notifications</h3>
                         <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">3 New</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                         {notifications.map(notif => (
                            <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors cursor-pointer group">
                               <div className="flex justify-between items-start">
                                  <p className={`text-sm font-medium ${notif.type === 'urgent' ? 'text-red-600' : 'text-slate-800'}`}>{notif.title}</p>
                                  <span className="text-xs text-slate-400">{notif.time}</span>
                               </div>
                               <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.desc}</p>
                            </div>
                         ))}
                      </div>
                      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                         <button className="text-xs text-blue-600 font-medium hover:text-blue-700">Mark all as read</button>
                      </div>
                   </div>
                )}
              </div>
              
              <div className="h-8 w-px bg-slate-200 mx-2"></div>

              {/* Profile Menu */}
              <div className="relative" ref={profileRef}>
                  <div 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity select-none"
                  >
                     <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                     </div>
                     <img 
                       src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`} 
                       alt="Profile" 
                       className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover bg-slate-200"
                     />
                     <ChevronDownIcon className={`h-4 w-4 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in-up">
                          <div className="px-4 py-3 border-b border-slate-100 sm:hidden">
                            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                          </div>
                          <button 
                            onClick={() => { setIsProfileModalOpen(true); setIsProfileMenuOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                          >
                             <UserCircleIcon className="h-4 w-4" />
                             <span>Profile Settings</span>
                          </button>
                          <div className="border-t border-slate-100"></div>
                          <button 
                            onClick={onLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                             <ArrowRightOnRectangleIcon className="h-4 w-4" />
                             <span>Sign Out</span>
                          </button>
                      </div>
                  )}
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
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
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

      {/* Profile Settings Modal */}
      {isProfileModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
               <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all">
                   <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                       <h3 className="font-bold text-lg text-slate-900 flex items-center">
                           <UserCircleIcon className="h-5 w-5 mr-2 text-blue-600" />
                           My Profile
                       </h3>
                       <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                           <XMarkIcon className="h-5 w-5" />
                       </button>
                   </div>
                   <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                       <div className="flex flex-col items-center mb-6">
                           <div className="relative group cursor-pointer" onClick={() => setProfileForm({...profileForm, avatarSeed: Math.random().toString(36).substring(7)})}>
                               <img 
                                 src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileForm.avatarSeed}`} 
                                 alt="Avatar Preview" 
                                 className="h-20 w-20 rounded-full border-4 border-slate-100 bg-slate-200 object-cover"
                               />
                               <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                   <ArrowPathIcon className="h-6 w-6 text-white" />
                               </div>
                               <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full border-2 border-white">
                                   <CameraIcon className="h-3 w-3" />
                               </div>
                           </div>
                           <p className="text-xs text-slate-500 mt-2">Click avatar to generate new look</p>
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Name</label>
                           <input 
                               type="text" 
                               required
                               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                               value={profileForm.name}
                               onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                           />
                       </div>
                       
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Password</label>
                           <div className="relative">
                               <input 
                                   type="password" 
                                   className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                                   value={profileForm.password}
                                   onChange={(e) => setProfileForm({...profileForm, password: e.target.value})}
                                   placeholder="Leave blank to keep current"
                               />
                               <KeyIcon className="h-4 w-4 text-slate-400 absolute right-3 top-2.5" />
                           </div>
                       </div>

                       <div className="pt-2 flex space-x-3">
                           <button 
                               type="button" 
                               onClick={() => setIsProfileModalOpen(false)}
                               className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-bold text-sm transition-colors"
                           >
                               Cancel
                           </button>
                           <button 
                               type="submit" 
                               className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-sm transition-colors shadow-lg shadow-blue-900/20"
                           >
                               Save Changes
                           </button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
};

// Simple helper for avatar regeneration icon
const ArrowPathIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);
