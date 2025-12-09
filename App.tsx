
import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CallLogs } from './components/CallLogs';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { AIAnalyst } from './components/AIAnalyst';
import { User, Call, CallStatus } from './types';
import { INITIAL_CALLS, AGENTS, MOCK_USERS } from './constants';

const App: React.FC = () => {
  // "Backend" State - Persisted in LocalStorage
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('vetracom_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });
  
  const [calls, setCalls] = useState<Call[]>(INITIAL_CALLS);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Persist Users on change (Simulating Database Update)
  useEffect(() => {
    localStorage.setItem('vetracom_users', JSON.stringify(allUsers));
    
    // Sync current user session if their profile was updated in the 'database'
    if (user) {
      const updatedCurrentUser = allUsers.find(u => u.id === user.id);
      if (updatedCurrentUser && JSON.stringify(updatedCurrentUser) !== JSON.stringify(user)) {
        setUser(updatedCurrentUser);
      }
    }
  }, [allUsers, user]);

  // Handler for Profile Updates from Layout
  const handleUpdateUser = (updatedUser: User) => {
    setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // Simulate Live Calls
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      setCalls(prevCalls => {
        const newCalls = [...prevCalls];
        
        // 1. Randomly complete or fail active calls
        newCalls.forEach((call, index) => {
           if (call.status === CallStatus.IN_PROGRESS || call.status === CallStatus.RINGING) {
             if (Math.random() > 0.7) {
                // End Call
                const endStatus = Math.random() > 0.9 ? CallStatus.FAILED : CallStatus.COMPLETED;
                newCalls[index] = { 
                  ...call, 
                  status: endStatus, 
                  duration: call.status === CallStatus.IN_PROGRESS ? call.duration + Math.floor(Math.random() * 60) : 0 
                };
             } else if (call.status === CallStatus.RINGING && Math.random() > 0.6) {
                // Answer call
                newCalls[index] = { 
                  ...call, 
                  status: CallStatus.IN_PROGRESS, 
                  startTime: Date.now(), 
                  agent: call.direction === 'Inbound' ? AGENTS[Math.floor(Math.random() * AGENTS.length)] : call.caller
                };
             } else if (call.status === CallStatus.IN_PROGRESS) {
                // Increment duration
                newCalls[index] = { ...call, duration: call.duration + 5 };
             }
           }
        });

        // 2. Randomly add new call (simulated incoming/outgoing)
        if (Math.random() > 0.7) {
           const id = `c-${Date.now()}`;
           const isInbound = Math.random() > 0.4;
           newCalls.unshift({ // Add to top
             id,
             caller: isInbound ? `+1 (555) 01${Math.floor(Math.random()*9)}-${Math.floor(1000 + Math.random() * 9000)}` : `Ext ${100 + Math.floor(Math.random() * 20)}`,
             receiver: !isInbound ? `+1 (555) 01${Math.floor(Math.random()*9)}-${Math.floor(1000 + Math.random() * 9000)}` : `Ext ${100 + Math.floor(Math.random() * 20)}`,
             status: CallStatus.RINGING,
             duration: 0,
             startTime: Date.now(),
             direction: isInbound ? 'Inbound' : 'Outbound',
             agent: !isInbound ? `Ext ${100 + Math.floor(Math.random() * 20)}` : undefined
           });
        }
        
        // Keep list manageable
        if (newCalls.length > 200) {
            newCalls.length = 200;
        }

        return newCalls;
      });
    }, 3000); // Faster updates for "Live" feel

    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return <Login onLogin={setUser} users={allUsers} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard calls={calls} />;
      case 'logs':
        return <CallLogs calls={calls} />;
      case 'analytics':
        return <Analytics calls={calls} />;
      case 'ai-insights':
        return <AIAnalyst calls={calls} />;
      case 'settings':
        return <Settings users={allUsers} setUsers={setAllUsers} currentUser={user} />;
      default:
        return <Dashboard calls={calls} />;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={() => setUser(null)}
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      calls={calls}
      onUpdateUser={handleUpdateUser}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
