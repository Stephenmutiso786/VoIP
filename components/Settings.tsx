
import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  ServerIcon,
  GlobeAltIcon,
  UserPlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  PlusIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';
import { PBXConfig, User, UserRole } from '../types';

interface SettingsProps {
  users: User[];
  setUsers: (users: User[]) => void;
  currentUser: User;
}

const DEFAULT_CONFIGS: PBXConfig[] = [
  { 
    id: '3cx-main', 
    name: '3CX HQ Server', 
    type: '3cx',
    status: 'connected', 
    url: 'https://pbx-us-east.vetracom.net:5001', 
    apiKey: 'sk_live_51M...',
    region: 'US-East (N. Virginia)',
    capacity: 250
  }
];

export const Settings: React.FC<SettingsProps> = ({ users, setUsers, currentUser }) => {
  // PBX State
  const [configs, setConfigs] = useState<PBXConfig[]>(() => {
    const saved = localStorage.getItem('vetracom_pbx_configs');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIGS;
  });

  // Editor State
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [isAddingConfig, setIsAddingConfig] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [configForm, setConfigForm] = useState<Partial<PBXConfig>>({});

  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null); // For Edit Mode
  const [userForm, setUserForm] = useState<Partial<User>>({
    name: '', email: '', role: UserRole.AGENT, username: '', password: '', status: 'Active'
  });

  // Persist PBX Configs
  useEffect(() => {
    localStorage.setItem('vetracom_pbx_configs', JSON.stringify(configs));
  }, [configs]);

  // --- PBX HANDLERS ---

  const handleInitAddConfig = () => {
    setConfigForm({ 
        type: '3cx', 
        status: 'disconnected', 
        url: 'https://', 
        apiKey: '', 
        region: 'US-East',
        capacity: 100
    });
    setIsAddingConfig(true);
    setEditingConfigId(null);
  };

  const handleInitEditConfig = (config: PBXConfig) => {
    setConfigForm({ ...config });
    setEditingConfigId(config.id);
    setIsAddingConfig(false);
  };

  const handleDeleteConfig = (id: string) => {
    if (confirm('Are you sure you want to delete this PBX configuration? This action cannot be undone.')) {
        setConfigs(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleTestAndSaveConfig = () => {
    if (!configForm.name || !configForm.url) return;
    
    setTestingConnection(true);
    
    // Simulate API Check
    setTimeout(() => {
        const isSuccess = Math.random() > 0.1; // 90% success chance for realism
        const newStatus = isSuccess ? 'connected' : 'error';
        
        const newConfig: PBXConfig = {
            id: editingConfigId || `pbx-${Date.now()}`,
            name: configForm.name!,
            type: configForm.type as any,
            status: newStatus,
            url: configForm.url!,
            apiKey: configForm.apiKey || '',
            region: configForm.region || 'Unknown',
            capacity: configForm.capacity || 100
        };

        if (editingConfigId) {
            setConfigs(prev => prev.map(c => c.id === editingConfigId ? newConfig : c));
            setEditingConfigId(null);
        } else {
            setConfigs(prev => [...prev, newConfig]);
            setIsAddingConfig(false);
        }
        
        setTestingConnection(false);
    }, 2000);
  };

  // --- USER HANDLERS ---

  const handleInitAddUser = () => {
      setEditingUser(null);
      setUserForm({ name: '', email: '', role: UserRole.AGENT, username: '', password: '', status: 'Active' });
      setIsUserModalOpen(true);
  };

  const handleInitEditUser = (user: User) => {
      setEditingUser(user);
      // Don't pre-fill password for security/logic reasons, only name etc
      setUserForm({ 
          name: user.name, 
          email: user.email, 
          username: user.username, 
          role: user.role, 
          status: user.status,
          password: '' // Clear password field
      });
      setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (editingUser) {
          // Edit Mode
          const updatedUser: User = {
              ...editingUser,
              name: userForm.name!,
              email: userForm.email,
              username: userForm.username!,
              role: userForm.role as UserRole,
              status: userForm.status as any,
              // Only update password if new one is provided
              password: userForm.password ? userForm.password : editingUser.password,
              // Regenerate avatar based on new username or keep existing
              avatar: editingUser.username !== userForm.username 
                 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${userForm.username}` 
                 : editingUser.avatar
          };
          
          setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
      } else {
          // Add Mode
          const newUser: User = {
              id: Date.now(),
              name: userForm.name!,
              email: userForm.email,
              username: userForm.username!,
              password: userForm.password || 'password123',
              role: userForm.role as UserRole,
              status: userForm.status as any,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userForm.username}`
          };
          setUsers([...users, newUser]);
      }
      setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id: string | number) => {
      if (id === currentUser.id) {
          alert("You cannot delete your own account.");
          return;
      }
      if (confirm('Are you sure you want to remove this user from the system?')) {
          setUsers(users.filter(u => u.id !== id));
      }
  };

  // Render Helpers
  const getTypeBadge = (type: string) => {
      const colors: Record<string, string> = {
          '3cx': 'bg-blue-100 text-blue-700',
          'yeastar': 'bg-orange-100 text-orange-700',
          'asterisk': 'bg-purple-100 text-purple-700',
          'cisco': 'bg-cyan-100 text-cyan-700'
      };
      return (
          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${colors[type] || 'bg-gray-100 text-gray-700'}`}>
              {type}
          </span>
      );
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto relative pb-12">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
           <div>
               <h2 className="text-2xl font-bold text-slate-900">System Configuration</h2>
               <p className="text-slate-500 text-sm mt-1">Global settings, PBX integrations, and user administration.</p>
           </div>
           <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
             <span className="relative flex h-2.5 w-2.5 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
             </span>
             <span className="font-mono">v2.4.1 (Stable)</span>
           </div>
       </div>

       {/* VoIP Integration Section */}
       <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <ServerIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    PBX Systems
                </h3>
                <p className="text-sm text-slate-500 mt-1">Manage external VoIP server connections.</p>
              </div>
              <button 
                onClick={handleInitAddConfig}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
              >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Connect New System
              </button>
           </div>
           
           <div className="p-6 space-y-4">
              {configs.length === 0 && (
                  <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                      No PBX systems configured. Click "Connect New System" to start.
                  </div>
              )}

              {/* Edit/Add Form Inline */}
              {(isAddingConfig || editingConfigId) && (
                  <div className="bg-slate-50 border border-indigo-100 rounded-xl p-6 mb-6 shadow-inner animate-fadeIn">
                      <h4 className="font-bold text-indigo-900 mb-4 flex items-center">
                          <WrenchScrewdriverIcon className="h-4 w-4 mr-2" />
                          {isAddingConfig ? 'Configure New Connection' : 'Edit Configuration'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">System Name</label>
                              <input 
                                  type="text" 
                                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                                  placeholder="e.g. New York HQ"
                                  value={configForm.name || ''}
                                  onChange={e => setConfigForm({...configForm, name: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">System Type</label>
                              <select 
                                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                  value={configForm.type || '3cx'}
                                  onChange={e => setConfigForm({...configForm, type: e.target.value as any})}
                              >
                                  <option value="3cx">3CX Phone System</option>
                                  <option value="yeastar">Yeastar S-Series</option>
                                  <option value="asterisk">Asterisk (Generic)</option>
                                  <option value="cisco">Cisco CUCM</option>
                                  <option value="avaya">Avaya Aura</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">API URL (HTTPS)</label>
                              <input 
                                  type="text" 
                                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                  placeholder="https://pbx.example.com" 
                                  value={configForm.url || ''}
                                  onChange={e => setConfigForm({...configForm, url: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">API Secret / Token</label>
                              <input 
                                  type="password" 
                                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                  placeholder="••••••••••••" 
                                  value={configForm.apiKey || ''}
                                  onChange={e => setConfigForm({...configForm, apiKey: e.target.value})}
                              />
                          </div>
                           <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Region / Zone</label>
                              <input 
                                  type="text" 
                                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                  placeholder="e.g. US-West" 
                                  value={configForm.region || ''}
                                  onChange={e => setConfigForm({...configForm, region: e.target.value})}
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Max Capacity</label>
                              <input 
                                  type="number" 
                                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                  placeholder="100" 
                                  value={configForm.capacity || 0}
                                  onChange={e => setConfigForm({...configForm, capacity: parseInt(e.target.value)})}
                              />
                          </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-6">
                          <button 
                            onClick={() => { setIsAddingConfig(false); setEditingConfigId(null); }}
                            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
                          >
                              Cancel
                          </button>
                          <button 
                            onClick={handleTestAndSaveConfig}
                            disabled={testingConnection}
                            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-all disabled:opacity-70"
                          >
                              {testingConnection ? (
                                  <>
                                    <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                                    Testing Connectivity...
                                  </>
                              ) : (
                                  'Test & Save Configuration'
                              )}
                          </button>
                      </div>
                  </div>
              )}

              {/* Config List */}
              {configs.map(config => (
                  <div key={config.id} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-colors flex flex-col md:flex-row justify-between items-center gap-4 bg-white shadow-sm">
                      <div className="flex items-center space-x-4 w-full md:w-auto">
                          <div className={`h-12 w-12 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-sm shrink-0 ${
                             config.type === '3cx' ? 'bg-blue-500' : 
                             config.type === 'yeastar' ? 'bg-orange-500' : 'bg-slate-700'
                          }`}>
                             {config.type.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                              <h4 className="font-bold text-slate-900">{config.name}</h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                  {getTypeBadge(config.type)}
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                      config.status === 'connected' 
                                      ? 'bg-green-50 text-green-700 border-green-200' 
                                      : 'bg-red-50 text-red-700 border-red-200'
                                  }`}>
                                      {config.status === 'connected' ? <CheckCircleIcon className="h-3 w-3 mr-1" /> : <XCircleIcon className="h-3 w-3 mr-1" />}
                                      {config.status.toUpperCase()}
                                  </span>
                                  <span className="text-xs text-slate-400 font-mono flex items-center">
                                      <GlobeAltIcon className="h-3 w-3 mr-1" />
                                      {config.url}
                                  </span>
                              </div>
                          </div>
                      </div>
                      <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                          <div className="text-right mr-4 hidden md:block">
                              <p className="text-xs text-slate-500 uppercase font-semibold">Region</p>
                              <p className="text-sm font-medium text-slate-800">{config.region}</p>
                          </div>
                          <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
                          <button 
                             onClick={() => handleInitEditConfig(config)}
                             className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                             title="Configure"
                          >
                              <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button 
                             onClick={() => handleDeleteConfig(config.id)}
                             className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                             title="Delete"
                          >
                              <TrashIcon className="h-5 w-5" />
                          </button>
                      </div>
                  </div>
              ))}
           </div>
       </section>

       {/* User Management Section */}
       <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                    <UserPlusIcon className="h-5 w-5 mr-2 text-slate-500" />
                    User Administration
                </h3>
                <p className="text-sm text-slate-500 mt-1">Control access for admins, supervisors, and agents.</p>
              </div>
              <button 
                onClick={handleInitAddUser}
                className="flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 shadow-sm transition-colors"
              >
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Create User
              </button>
           </div>
           
           <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                        <th className="px-6 py-4">User Identity</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Account Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                 <img src={user.avatar} alt="" className="h-10 w-10 rounded-full bg-slate-200 object-cover" />
                                 <div>
                                    <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                                    <p className="text-xs text-slate-500">{user.email || 'No email set'}</p>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">@{user.username}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                  user.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                  user.role === UserRole.SUPERVISOR ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                  'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                 {user.role}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                               <div className="flex items-center space-x-2">
                                   <span className={`h-2.5 w-2.5 rounded-full ${user.status === 'Inactive' ? 'bg-slate-300' : 'bg-green-500'}`}></span>
                                   <span className={`text-sm font-medium ${user.status === 'Inactive' ? 'text-slate-400' : 'text-slate-700'}`}>
                                       {user.status || 'Active'}
                                   </span>
                               </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                  <button 
                                    onClick={() => handleInitEditUser(user)}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit User"
                                  >
                                      <PencilSquareIcon className="h-5 w-5" />
                                  </button>
                                  <button 
                                      onClick={() => handleDeleteUser(user.id)} 
                                      className={`p-1.5 rounded-lg transition-colors ${
                                        user.id === currentUser.id 
                                            ? 'text-slate-200 cursor-not-allowed' 
                                            : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                      }`}
                                      disabled={user.id === currentUser.id}
                                      title={user.id === currentUser.id ? "Cannot delete yourself" : "Delete User"}
                                  >
                                      <TrashIcon className="h-5 w-5" />
                                  </button>
                              </div>
                           </td>
                        </tr>
                    ))}
                 </tbody>
               </table>
           </div>
       </section>

       {/* User Modal */}
       {isUserModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fadeIn">
               <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all">
                   <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                       <h3 className="font-bold text-lg text-slate-900">
                           {editingUser ? 'Edit User Profile' : 'Add New User'}
                       </h3>
                       <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                           <XMarkIcon className="h-5 w-5" />
                       </button>
                   </div>
                   <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                               <input 
                                   type="text" 
                                   required
                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                   value={userForm.name}
                                   onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                                   placeholder="John Doe"
                               />
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                               <input 
                                   type="email" 
                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                   value={userForm.email}
                                   onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                                   placeholder="john@vetracom.net"
                               />
                           </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
                               <input 
                                   type="text" 
                                   required
                                   className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm ${editingUser ? 'bg-slate-100' : ''}`}
                                   value={userForm.username}
                                   onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                               />
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                               <input 
                                   type="password" 
                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                   value={userForm.password}
                                   onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                                   placeholder={editingUser ? "Leave empty to keep" : "Required"}
                                   required={!editingUser}
                               />
                           </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                               <select 
                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                                   value={userForm.role}
                                   onChange={(e) => setUserForm({...userForm, role: e.target.value as UserRole})}
                               >
                                   <option value={UserRole.ADMIN}>Administrator</option>
                                   <option value={UserRole.SUPERVISOR}>Supervisor</option>
                                   <option value={UserRole.AGENT}>Agent</option>
                               </select>
                           </div>
                           <div>
                               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                               <select 
                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                                   value={userForm.status}
                                   onChange={(e) => setUserForm({...userForm, status: e.target.value as any})}
                               >
                                   <option value="Active">Active</option>
                                   <option value="Inactive">Inactive (Disabled)</option>
                               </select>
                           </div>
                       </div>

                       <div className="pt-4 flex space-x-3">
                           <button 
                               type="button" 
                               onClick={() => setIsUserModalOpen(false)}
                               className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-bold text-sm transition-colors"
                           >
                               Cancel
                           </button>
                           <button 
                               type="submit" 
                               className="flex-1 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold text-sm transition-colors shadow-lg"
                           >
                               {editingUser ? 'Save Changes' : 'Create User'}
                           </button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
};
