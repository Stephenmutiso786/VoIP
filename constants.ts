import { Call, CallStatus, UserRole, CallDirection } from './types';

export const MOCK_USERS = [
  { 
    id: '1', 
    username: 'lewis', 
    password: 'lewis123', 
    role: UserRole.ADMIN, 
    name: 'Lewis (Admin)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lewis' 
  },
  { 
    id: '2', 
    username: 'supervisor', 
    password: 'supervisor123', 
    role: UserRole.SUPERVISOR, 
    name: 'Sarah Sup',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' 
  },
  { 
    id: '3', 
    username: 'luiz', 
    password: 'luiz123', 
    role: UserRole.AGENT, 
    name: 'Luiz Agent',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luiz' 
  },
];

export const AGENTS = ['Luiz', 'Sarah', 'Mike', 'Emma', 'James', 'Olivia'];

const generateRandomPhoneNumber = () => `+1 (555) ${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`;
const generateRandomExtension = () => `Ext ${100 + Math.floor(Math.random() * 20)}`;

export const INITIAL_CALLS: Call[] = Array.from({ length: 25 }).map((_, i) => {
  const isInbound = Math.random() > 0.4;
  const statusRoll = Math.random();
  let status = CallStatus.COMPLETED;
  if (statusRoll > 0.9) status = CallStatus.MISSED;
  else if (statusRoll > 0.85) status = CallStatus.FAILED;
  else if (statusRoll > 0.8) status = CallStatus.IN_PROGRESS;

  return {
    id: `c-${1000 + i}`,
    caller: isInbound ? generateRandomPhoneNumber() : generateRandomExtension(),
    receiver: isInbound ? generateRandomExtension() : generateRandomPhoneNumber(),
    status: status,
    duration: status === CallStatus.MISSED || status === CallStatus.FAILED ? 0 : Math.floor(Math.random() * 600),
    startTime: Date.now() - Math.floor(Math.random() * 48 * 60 * 60 * 1000), // Last 48 hours
    agent: isInbound && status !== CallStatus.MISSED ? AGENTS[Math.floor(Math.random() * AGENTS.length)] : undefined,
    direction: isInbound ? 'Inbound' : 'Outbound'
  } as Call;
}).sort((a, b) => b.startTime - a.startTime);

export const STATUS_COLORS: Record<CallStatus, string> = {
  [CallStatus.RINGING]: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20',
  [CallStatus.IN_PROGRESS]: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
  [CallStatus.COMPLETED]: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10',
  [CallStatus.MISSED]: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10',
  [CallStatus.FAILED]: 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10',
};