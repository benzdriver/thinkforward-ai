/**
 * Consultant dashboard data types
 */

export interface Statistics {
  totalClients: number;
  activeClients: number;
  timesSaved: number;
  casesCompleted: number;
}

export interface Activity {
  id: string;
  type: 'document_upload' | 'form_submit' | 'client_message' | 'system_update';
  clientId?: string;
  clientName?: string;
  description: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  clientId?: string;
  clientName?: string;
}

export interface DashboardData {
  statistics: Statistics;
  recentActivities: Activity[];
  pendingTasks: Task[];
} 