import React, { useState } from 'react';
import { Call, CallStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowDownLeftIcon, 
  ArrowUpRightIcon,
  CalendarDaysIcon 
} from '@heroicons/react/24/outline';

interface CallLogsProps {
  calls: Call[];
}

export const CallLogs: React.FC<CallLogsProps> = ({ calls }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      call.caller.toLowerCase().includes(searchTerm.toLowerCase()) || 
      call.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.agent && call.agent.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'All' || call.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => b.startTime - a.startTime);

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">Call Logs</h2>
            <p className="text-slate-500 text-sm mt-1">Detailed history of all system communications.</p>
         </div>
         <button className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
            <CalendarDaysIcon className="h-5 w-5 mr-2 text-slate-400" />
            Last 24 Hours
         </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/50">
           <div className="relative w-full lg:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search logs..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           <div className="flex items-center space-x-3 w-full lg:w-auto">
             <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg px-3 py-2">
               <FunnelIcon className="h-4 w-4 text-slate-500" />
               <select 
                 className="block w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-slate-700"
                 value={filterStatus}
                 onChange={(e) => setFilterStatus(e.target.value)}
               >
                 <option value="All">All Statuses</option>
                 {Object.values(CallStatus).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
             <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
               Export CSV
             </button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Direction</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Caller</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Receiver</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredCalls.length > 0 ? filteredCalls.map((call) => (
                <tr key={call.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="font-medium text-slate-900">{new Date(call.startTime).toLocaleTimeString()}</div>
                    <div className="text-xs text-slate-400">{new Date(call.startTime).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {call.direction === 'Inbound' ? (
                        <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md">
                            <ArrowDownLeftIcon className="h-3 w-3 mr-1" /> Inbound
                        </span>
                    ) : (
                        <span className="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                            <ArrowUpRightIcon className="h-3 w-3 mr-1" /> Outbound
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {call.caller}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {call.receiver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${STATUS_COLORS[call.status]}`}>
                      {call.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                    {formatDuration(call.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {call.agent || <span className="text-slate-300">-</span>}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                        <MagnifyingGlassIcon className="h-10 w-10 text-slate-300 mb-2" />
                        <p>No calls found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 sm:px-6 flex items-center justify-between">
           <p className="text-xs text-slate-500">Showing <span className="font-medium">{filteredCalls.length}</span> records</p>
           <div className="flex space-x-2">
               <button className="px-3 py-1 border border-slate-300 rounded text-xs text-slate-600 disabled:opacity-50" disabled>Previous</button>
               <button className="px-3 py-1 border border-slate-300 rounded text-xs text-slate-600 hover:bg-white hover:shadow-sm">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};