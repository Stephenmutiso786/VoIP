import React from 'react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
       <div>
           <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
           <p className="text-gray-500 text-sm mt-1">Manage users, integrations, and global configurations.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">VoIP Integration</h3>
              <p className="text-sm text-gray-500 mt-1">Configure connections to PBX systems.</p>
           </div>
           <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                 <div className="flex items-center space-x-3">
                   <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center text-blue-700 font-bold">3CX</div>
                   <div>
                     <p className="font-medium text-gray-900">3CX Phone System</p>
                     <p className="text-xs text-green-600">Connected</p>
                   </div>
                 </div>
                 <button className="text-sm text-blue-600 font-medium">Configure</button>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                 <div className="flex items-center space-x-3">
                   <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-gray-700 font-bold">Y</div>
                   <div>
                     <p className="font-medium text-gray-900">Yeastar</p>
                     <p className="text-xs text-gray-500">Not Connected</p>
                   </div>
                 </div>
                 <button className="text-sm text-blue-600 font-medium">Connect</button>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
              <p className="text-sm text-gray-500 mt-1">Control access and roles.</p>
           </div>
           <div className="p-6">
             <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Add New User</button>
             <div className="mt-4">
               {/* Mock list */}
               {[1,2,3].map(i => (
                 <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">User {i}</p>
                        <p className="text-xs text-gray-500">Role: Agent</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">Edit</button>
                 </div>
               ))}
             </div>
           </div>
        </div>
    </div>
  );
};
