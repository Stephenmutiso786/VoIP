import React, { useState, useMemo } from 'react';
import { Call, CallStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ArrowDownLeftIcon, 
  ArrowUpRightIcon,
  CalendarDaysIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface CallLogsProps {
  calls: Call[];
}

type TimeRange = '24h' | '7d' | '30d' | 'all';

export const CallLogs: React.FC<CallLogsProps> = ({ calls }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Logic
  const filteredCalls = useMemo(() => {
    let result = calls;

    // Time Filter
    const now = Date.now();
    if (timeRange === '24h') {
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        result = result.filter(c => c.startTime > oneDayAgo);
    } else if (timeRange === '7d') {
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
        result = result.filter(c => c.startTime > sevenDaysAgo);
    }

    // Search Filter
    if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        result = result.filter(call => 
          call.caller.toLowerCase().includes(lowerSearch) || 
          call.receiver.toLowerCase().includes(lowerSearch) ||
          (call.agent && call.agent.toLowerCase().includes(lowerSearch))
        );
    }

    // Status Filter
    if (filterStatus !== 'All') {
        result = result.filter(c => c.status === filterStatus);
    }

    // Sort by time desc
    return result.sort((a, b) => b.startTime - a.startTime);
  }, [calls, searchTerm, filterStatus, timeRange]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage);
  const paginatedCalls = filteredCalls.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
      }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Direction", "Caller", "Receiver", "Status", "Duration (s)", "Start Time", "Agent"];
    const rows = filteredCalls.map(c => [
        c.id,
        c.direction,
        c.caller,
        c.receiver,
        c.status,
        c.duration,
        new Date(c.startTime).toISOString(),
        c.agent || ''
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vetracom_logs_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">Call Logs</h2>
            <p className="text-slate-500 text-sm mt-1">Detailed history of all system communications.</p>
         </div>
         <div className="flex items-center space-x-2">
            <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="all">All Time</option>
            </select>
         </div>
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
                placeholder="Search logs by number or agent..."
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
           </div>
           
           <div className="flex items-center space-x-3 w-full lg:w-auto">
             <div className="flex items-center space-x-2 bg-white border border-slate-300 rounded-lg px-3 py-2">
               <FunnelIcon className="h-4 w-4 text-slate-500" />
               <select 
                 className="block w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-slate-700 cursor-pointer"
                 value={filterStatus}
                 onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
               >
                 <option value="All">All Statuses</option>
                 {Object.values(CallStatus).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
             <button 
                onClick={handleExportCSV}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
             >
               <ArrowDownTrayIcon className="h-4 w-4" />
               <span>Export CSV</span>
             </button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
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
              {paginatedCalls.length > 0 ? paginatedCalls.map((call) => (
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
        
        {/* Pagination Controls */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 sm:px-6 flex items-center justify-between">
           <p className="text-xs text-slate-500 hidden sm:block">
             Showing <span className="font-medium">{Math.min(filteredCalls.length, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="font-medium">{Math.min(filteredCalls.length, currentPage * itemsPerPage)}</span> of <span className="font-medium">{filteredCalls.length}</span> results
           </p>
           <div className="flex space-x-2 w-full sm:w-auto justify-between sm:justify-end">
               <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 border border-slate-300 rounded-md text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-800 disabled:opacity-50 disabled:hover:bg-transparent"
               >
                 <ChevronLeftIcon className="h-3 w-3 mr-1" />
                 Previous
               </button>
               <span className="flex items-center text-xs font-medium text-slate-600 sm:hidden">
                 Page {currentPage} of {totalPages}
               </span>
               <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center px-3 py-1 border border-slate-300 rounded-md text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-800 disabled:opacity-50 disabled:hover:bg-transparent"
               >
                 Next
                 <ChevronRightIcon className="h-3 w-3 ml-1" />
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};