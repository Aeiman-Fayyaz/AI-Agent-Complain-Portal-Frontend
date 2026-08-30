export type UserRole = 'customer' | 'agent' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

export type TicketCategory = 'Billing' | 'Technical' | 'Account' | 'Feature Request' | 'General';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TicketStatus = 'New' | 'Assigned' | 'In Progress' | 'Resolved';

export interface AISuggestions {
  category: TicketCategory;
  priority: TicketPriority;
  summary: string;
}

export interface Ticket {
  _id: string;
  ticketNumber: string;
  customer: User;
  assignedAgent?: User | null;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  sentiment?: 'Positive' | 'Neutral' | 'Frustrated' | 'Angry' | 'Negative' | 'Urgent';
  aiSummary: string;
  aiSuggestions: AISuggestions & { sentiment?: 'Positive' | 'Neutral' | 'Frustrated' | 'Angry' | 'Negative' | 'Urgent' };
  isAiApproved: boolean;
  status: TicketStatus;
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  ticket: string;
  sender: User;
  content: string;
  isInternal?: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalTickets: number;
  newTickets: number;
  assignedTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  highPriorityTickets: number;
  mediumPriorityTickets: number;
  lowPriorityTickets: number;
  criticalPriorityTickets?: number;
  categories: Record<string, number>;
}

export interface AnalyticsData {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  criticalComplaints: number;
  complaintsByCategory: Record<string, number>;
  complaintsOverTime: Array<{ label: string; value: number }>;
  averageResolutionTime: number;
}
