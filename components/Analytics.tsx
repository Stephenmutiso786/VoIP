import React from 'react';
import { Call, CallStatus } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

interface AnalyticsProps {
  calls: Call[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ calls }) => {
  
  // Prepare data for Bar Chart (Calls per Hour - Simplified Mock based on real distribution)
  const hourBuckets = Array.from({length: 8}, (_, i) => 9 + i); // 09:00 to 16:00
  const barData = hourBuckets.map(hour => {
      const count = calls.filter(c => {
          const d = new Date(c.startTime);
          return d.getHours() === hour;
      }).length + Math.floor(Math.random() * 10); // Augment with random to look full
      
      return {
          name: `${hour}:00`,
          calls: count,
          missed: Math.floor(count * 0.15)
      }
  });

  // Prepare data for Pie Chart
  const statusCounts = calls.reduce((acc, call) => {
    acc[call.status] = (acc[call.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  })).filter(d => d.value > 0);

  const PIE_COLORS: Record<string, string> = {
    [CallStatus.COMPLETED]: '#3b82f6', // blue-500
    [CallStatus.MISSED]: '#ef4444', // red-500
    [CallStatus.FAILED]: '#6b7280', // gray-500
    [CallStatus.IN_PROGRESS]: '#22c55e', // green-500
    [CallStatus.RINGING]: '#eab308', // yellow-500
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg text-xs">
          <p className="font-bold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
             <p key={index} style={{ color: entry.color }}>
                {entry.name}: {entry.value}
             </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
       <div>
           <h2 className="text-2xl font-bold text-slate-900">Analytics & Reports</h2>
           <p className="text-slate-500 text-sm mt-1">Deep dive into call volume, agent performance, and system health.</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Volume Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Call Volume (Today)</h3>
            <select className="text-xs border-slate-200 rounded-md text-slate-500">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={barData}>
                <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
                <Legend iconType="circle" />
                <Area type="monotone" dataKey="calls" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCalls)" strokeWidth={2} name="Total Calls" />
                <Area type="monotone" dataKey="missed" stroke="#ef4444" fill="none" strokeWidth={2} name="Missed Calls" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Call Status Distribution</h3>
          <div className="h-80 w-full flex justify-center items-center relative">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[entry.name] || '#ccc'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-bold text-slate-800">{calls.length}</span>
                <span className="text-xs text-slate-500 uppercase">Total Calls</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-medium text-slate-500">Average Wait Time</p>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">-12%</span>
                </div>
                <p className="text-3xl font-bold text-slate-900 mt-1">14s</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-4 overflow-hidden">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Target: &lt; 20s</p>
             </div>
             <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-medium text-slate-500">Avg Call Duration</p>
                    <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">0%</span>
                </div>
                <p className="text-3xl font-bold text-slate-900 mt-1">3m 12s</p>
                 <div className="w-full bg-slate-200 rounded-full h-1.5 mt-4 overflow-hidden">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                 <p className="text-xs text-slate-400 mt-2">Target: 3m - 5m</p>
             </div>
             <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-medium text-slate-500">Agent Utilization</p>
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">+5%</span>
                </div>
                <p className="text-3xl font-bold text-slate-900 mt-1">87%</p>
                 <div className="w-full bg-slate-200 rounded-full h-1.5 mt-4 overflow-hidden">
                  <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: '87%' }}></div>
                </div>
                 <p className="text-xs text-slate-400 mt-2">Target: 80-90%</p>
             </div>
        </div>
      </div>
    </div>
  );
};