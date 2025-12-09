import React, { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  ServerIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';

interface PBXConfig {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  url: string;
  apiKey: string;
  logo: string;
  color: string;
  type: '3cx' | 'yeastar';
}

interface MockUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    avatar: string;
}

export const Settings: React.FC = () => {
  const [configs, setConfigs] = useState<PBXConfig[]>([
    { 
      id: '3cx-main', 
      name: '3CX HQ Server', 
      status: 'connected', 
      url: 'https://pbx-us-east.vetracom.net:5001', 
      apiKey: 'sk_live_51M...',
      logo: '3CX',
      color: 'bg-blue-600 text-white',
      type: '3cx'
    },
    { 
      id: 'yeastar-backup', 
      name: 'Yeastar Backup', 
      status: 'disconnected', 
      url: '', 
      apiKey: '',
      logo: 'Y',
      color: 'bg-orange-500 text-white',
      type: 'yeastar'
    }
  ]);

  const [users, setUsers] = useState<MockUser[]>([
    { id: 1, name: 'Lewis (Admin)', email: 'lewis@vetracom.net', role: 'Administrator', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lewis' },
    { id: 2, name: 'Sarah Sup', email: 'sarah@vetracom.net', role: 'Supervisor', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 3, name: 'Luiz Agent', email: 'luiz@vetracom.net', role: 'Agent', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luiz' },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [formState, setFormState] = useState({ url: '', apiKey: '' });
  
  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Agent' });

  const handleEdit = (config: PBXConfig) => {
    setEditingId(config.id);
    setFormState({ 
        url: config.url, 
        apiKey: config.status === 'connected' ? '' : config.apiKey 
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormState({ url: '', apiKey: '' });
  };

  const handleTestAndSave = () => {
    setTestingConnection(true);
    setTimeout(() => {
        setConfigs(prev => prev.map(c => {
            if (c.id === editingId) {
                return {
                    ...c,
                    status: 'connected',
                    url: formState.url,
                    apiKey: formState.apiKey || c.apiKey
                };
            }
            return c;
        }));
        setTestingConnection(false);
        setEditingId(null);
    }, 2000);
  };

  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      const user: MockUser = {
          id: Date.now(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: 'Active',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`
      };
      setUsers([...users, user]);
      setIsUserModalOpen(false);
      setNewUser({ name: '', email: '', role: 'Agent' });
  };

  const handleDeleteUser = (id: number) => {
      if (confirm('Are you sure you want to remove this user?')) {
          setUsers(users.filter(u => u.id !== id));
      }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto relative">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
               <h2 className="text-2xl font-bold text-slate-900">System Settings</h2>
               <p className="text-slate-500 text-sm mt-1">Manage PBX integrations, user access, and global configurations.</p>
           </div>
           <div className="flex items-center space-x-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
             <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
             </span>
             <span>System Online v2.4.0</span>
           </div>
       </div>

       {/* VoIP Integration Section */}
       <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <ServerIcon className="h-5 w-5 mr-2 text-slate-400" />
                    VoIP Integration
                </h3>
                <p className="text-sm text-slate-500 mt-1">Configure secure connections to your PBX infrastructure.</p>
              </div>
              <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Documentation</button>
           </div>
           
           <div className="p-6 space-y-6">
              {configs.map(config => (
                  <div key={config.id} className={`border rounded-xl transition-all duration-200 ${editingId === config.id ? 'ring-2 ring-blue-500/20 border-blue-500 shadow-md bg-slate-50/50' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}>
                      
                      {/* Read View */}
                      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                         <div className="flex items-center space-x-4">
                           <div className={`h-14 w-14 ${config.color} rounded-xl flex items-center justify-center font-bold text-xl shadow-sm shrink-0`}>
                             {config.logo}
                           </div>
                           <div>
                             <h4 className="font-bold text-slate-900 text-lg">{config.name}</h4>
                             <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                <div className={`flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                                    config.status === 'connected' 
                                        ? 'bg-green-50 text-green-700 border-green-200' 
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                    {config.status === 'connected' ? <CheckCircleIcon className="h-3.5 w-3.5 mr-1.5" /> : <XCircleIcon className="h-3.5 w-3.5 mr-1.5" />}
                                    {config.status === 'connected' ? 'Connected' : 'Disconnected'}
                                </div>
                                {config.status === 'connected' && (
                                    <span className="flex items-center text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                        <GlobeAltIcon className="h-3 w-3 mr-1 text-slate-400" />
                                        {config.url}
                                    </span>
                                )}
                             </div>
                           </div>
                         </div>
                         
                         {editingId !== config.id && (
                             <button 
                                onClick={() => handleEdit(config)}
                                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap"
                             >
                                Configure
                             </button>
                         )}
                      </div>

                      {/* Edit Form */}
                      {editingId === config.id && (
                          <div className="px-5 pb-6 pt-2 animate-fadeIn">
                              <div className="border-t border-slate-200 pt-5 mt-2">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                          <div>
                                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                                  PBX API URL (HTTPS)
                                              </label>
                                              <div className="relative">
                                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                      <GlobeAltIcon className="h-4 w-4 text-slate-400" />
                                                  </div>
                                                  <input 
                                                      type="text" 
                                                      value={formState.url}
                                                      onChange={(e) => setFormState({...formState, url: e.target.value})}
                                                      placeholder="https://pbx.example.com:5001"
                                                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-shadow"
                                                  />
                                              </div>
                                              <p className="mt-1.5 text-xs text-slate-400">Must include protocol (https) and port.</p>
                                          </div>
                                      </div>
                                      
                                      <div className="space-y-4">
                                          <div>
                                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                                                  API Secret / Token
                                              </label>
                                              <div className="relative">
                                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                      <ShieldCheckIcon className="h-4 w-4 text-slate-400" />
                                                  </div>
                                                  <input 
                                                      type="password" 
                                                      value={formState.apiKey}
                                                      onChange={(e) => setFormState({...formState, apiKey: e.target.value})}
                                                      placeholder={config.status === 'connected' ? '••••••••••••••••' : 'Enter API Token'}
                                                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-shadow"
                                                  />
                                              </div>
                                              <p className="mt-1.5 text-xs text-slate-400">Token is encrypted before storage.</p>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="mt-6 flex items-center justify-between bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                                      <div className="text-xs text-slate-600">
                                          <p className="font-semibold text-blue-800 mb-0.5">Integration Requirements:</p>
                                          <ul className="list-disc pl-4 space-y-0.5">
                                              <li>Allow inbound traffic from <span className="font-mono bg-blue-100 px-1 rounded">52.14.x.x</span></li>
                                              <li>Enable "Console API" access in {config.name} admin panel.</li>
                                          </ul>
                                      </div>
                                      <div className="flex space-x-3">
                                          <button 
                                              onClick={handleCancel}
                                              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                                          >
                                              Cancel
                                          </button>
                                          <button 
                                              onClick={handleTestAndSave}
                                              disabled={testingConnection || !formState.url}
                                              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                          >
                                              {testingConnection ? (
                                                  <>
                                                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                                                      Testing Connection...
                                                  </>
                                              ) : (
                                                  'Test & Save Configuration'
                                              )}
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              ))}
           </div>
       </section>

       {/* User Management Section */}
       <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <UserPlusIcon className="h-5 w-5 mr-2 text-slate-400" />
                    User Management
                </h3>
                <p className="text-sm text-slate-500 mt-1">Manage platform access and permissions.</p>
              </div>
              <button 
                onClick={() => setIsUserModalOpen(true)}
                className="flex items-center px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 shadow-sm transition-colors"
              >
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Add User
              </button>
           </div>
           <div className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {users.map((user, i) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                 <img src={user.avatar} alt="" className="h-10 w-10 rounded-full bg-slate-100" />
                                 <div>
                                    <p className="font-medium text-slate-900 text-sm">{user.name}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                 {user.role}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                               <div className="flex items-center space-x-1.5">
                                   <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                   <span className="text-sm text-slate-600">{user.status}</span>
                               </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                      <PencilSquareIcon className="h-5 w-5" />
                                  </button>
                                  <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                      <TrashIcon className="h-5 w-5" />
                                  </button>
                              </div>
                           </td>
                        </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
       </section>

       {/* Add User Modal */}
       {isUserModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
                   <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                       <h3 className="font-bold text-slate-900">Add New User</h3>
                       <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                           <XMarkIcon className="h-5 w-5" />
                       </button>
                   </div>
                   <form onSubmit={handleAddUser} className="p-6 space-y-4">
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                           <input 
                               type="text" 
                               required
                               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                               value={newUser.name}
                               onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                               placeholder="e.g. John Doe"
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                           <input 
                               type="email" 
                               required
                               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                               value={newUser.email}
                               onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                               placeholder="john@vetracom.net"
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                           <select 
                               className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
                               value={newUser.role}
                               onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                           >
                               <option>Administrator</option>
                               <option>Supervisor</option>
                               <option>Agent</option>
                           </select>
                       </div>
                       <div className="pt-2 flex space-x-3">
                           <button 
                               type="button" 
                               onClick={() => setIsUserModalOpen(false)}
                               className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors"
                           >
                               Cancel
                           </button>
                           <button 
                               type="submit" 
                               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors shadow-sm"
                           >
                               Create User
                           </button>
                       </div>
                   </form>
               </div>
           </div>
       )}
    </div>
  );
};