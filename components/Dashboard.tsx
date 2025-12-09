import React, { useMemo } from 'react';
import { Call, CallStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  PhoneIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowRightIcon,
  ServerIcon,
  SignalIcon,
  GlobeAltIcon
} from '@heroicons/react/24/solid';
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@heroicons/react/24/outline';

interface DashboardProps {
  calls: Call[];
}

export const Dashboard: React.FC<DashboardProps> = ({ calls }) => {
  const stats = useMemo(() => {
    const total = calls.length;
    const active = calls.filter(c => c.status === CallStatus.IN_PROGRESS || c.status === CallStatus.RINGING).length;
    const missed = calls.filter(c => c.status === CallStatus.MISSED).length;
    const completed = calls.filter(c => c.status === CallStatus.COMPLETED).length;
    const successRate = total > 0 ? Math.round((completed / (total - active)) * 100) : 0;
    
    // Average duration of completed calls
    const completedCalls = calls.filter(c => c.status === CallStatus.COMPLETED);
    const avgDuration = completedCalls.reduce((acc, c) => acc + c.duration, 0) / (completedCalls.length || 1);
    
    return { total, active, missed, successRate, avgDuration };
  }, [calls]);

  const liveCalls = calls
    .filter(c => c.status === CallStatus.IN_PROGRESS || c.status === CallStatus.RINGING)
    .sort((a, b) => b.startTime - a.startTime);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, subtext }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-full transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {trend === 'up' ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
          {trendValue}
        </span>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-500 mt-1">{title}</p>
        {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
           <p className="text-slate-500 text-sm mt-1">Real-time monitoring and system health status.</p>
        </div>
        <div className="flex items-center space-x-2">
           <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
           </span>
           <span className="text-sm font-medium text-slate-700">System Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Calls (24h)" 
          value={stats.total} 
          icon={PhoneIcon} 
          color="bg-blue-600" 
          trend="up" 
          trendValue="12%" 
          subtext="vs previous 24h"
        />
        <StatCard 
          title="Avg Talk Time" 
          value={formatDuration(Math.round(stats.avgDuration))} 
          icon={CheckCircleIcon} 
          color="bg-indigo-600" 
          trend="up" 
          trendValue="5%" 
          subtext="Target: 3:00"
        />
        <StatCard 
          title="Missed Calls" 
          value={stats.missed} 
          icon={XCircleIcon} 
          color="bg-red-500" 
          trend="down" 
          trendValue="2%" 
          subtext={`${Math.round((stats.missed / (stats.total || 1)) * 100)}% of total volume`}
        />
        <StatCard 
          title="Active Channels" 
          value={stats.active} 
          icon={SignalIcon} 
          color="bg-emerald-500" 
          trend="up" 
          trendValue="Stable" 
          subtext="Capacity: 60 Lines"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Live Calls Panel - Takes up 2 columns */}
        <div className="xl:col-span-2 flex flex-col space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                Live Activity
              </h3>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
                {liveCalls.length} Active
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Caller</th>
                    <th className="px-6 py-3 font-medium">Receiver</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Time</th>
                    <th className="px-6 py-3 font-medium">Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {liveCalls.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                        No active calls. System is idle.
                      </td>
                    </tr>
                  ) : (
                    liveCalls.map((call) => (
                      <tr key={call.id} className="bg-white hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center text-slate-600" title={call.direction}>
                             {call.direction === 'Inbound' ? (
                               <ArrowDownLeftIcon className="h-4 w-4 text-green-500 mr-2" />
                             ) : (
                               <ArrowUpRightIcon className="h-4 w-4 text-blue-500 mr-2" />
                             )}
                             <span className="text-xs font-medium">{call.direction}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{call.caller}</td>
                        <td className="px-6 py-4 text-slate-600">{call.receiver}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${STATUS_COLORS[call.status]}`}>
                            {call.status === CallStatus.RINGING && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5 animate-bounce"></span>}
                            {call.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600 text-xs">
                           {call.status === CallStatus.RINGING ? '--:--' : formatDuration(call.duration)}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {call.agent ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                                {call.agent.charAt(0)}
                              </div>
                              <span>{call.agent}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Routing...</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: System Health & Status */}
        <div className="space-y-6">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center">
                <ServerIcon className="h-5 w-5 text-slate-400 mr-2" />
                Infrastructure Health
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center space-x-3">
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                       <span className="text-sm font-medium text-slate-700">3CX PBX Gateway</span>
                    </div>
                    <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded">ONLINE</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center space-x-3">
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                       <span className="text-sm font-medium text-slate-700">Yeastar Bridge</span>
                    </div>
                    <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded">ONLINE</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center space-x-3">
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                       <span className="text-sm font-medium text-slate-700">Database (MongoDB)</span>
                    </div>
                    <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded">CONNECTED</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center space-x-3">
                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                       <span className="text-sm font-medium text-slate-700">WebSocket Stream</span>
                    </div>
                    <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded">ACTIVE</span>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <GlobeAltIcon className="h-32 w-32 transform rotate-12" />
              </div>
              <h3 className="font-semibold text-lg relative z-10">Global Call Routing</h3>
              <p className="text-slate-400 text-sm mt-1 relative z-10">All trunks operating at optimal latency.</p>
              
              <div className="mt-6 grid grid-cols-3 gap-4 relative z-10">
                 <div className="text-center">
                    <p className="text-xs text-slate-400">US-East</p>
                    <p className="text-lg font-bold text-green-400">24ms</p>
                 </div>
                 <div className="text-center border-l border-slate-700">
                    <p className="text-xs text-slate-400">EU-West</p>
                    <p className="text-lg font-bold text-green-400">89ms</p>
                 </div>
                 <div className="text-center border-l border-slate-700">
                    <p className="text-xs text-slate-400">Asia-Pac</p>
                    <p className="text-lg font-bold text-yellow-400">145ms</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};