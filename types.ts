export enum CallStatus {
  RINGING = 'Ringing',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  MISSED = 'Missed',
  FAILED = 'Failed'
}

export enum UserRole {
  ADMIN = 'Admin',
  SUPERVISOR = 'Supervisor',
  AGENT = 'Agent'
}

export type CallDirection = 'Inbound' | 'Outbound';

export interface Call {
  id: string;
  caller: string;
  receiver: string;
  status: CallStatus;
  duration: number; // in seconds
  startTime: number; // timestamp
  agent?: string;
  direction: CallDirection;
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

export interface AnalyticsData {
  time: string;
  calls: number;
}