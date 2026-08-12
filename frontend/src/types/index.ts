// ─── Auth ─────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar: string | null;
  phone: string;
  department: string;
  job_title: string;
  company: Company | null;
  is_online: boolean;
  date_joined: string;
}

export type UserRole =
  | "super_admin"
  | "company_admin"
  | "hr"
  | "project_manager"
  | "team_lead"
  | "employee"
  | "client"
  | "guest";

export interface Company {
  id: string;
  name: string;
  domain: string;
  logo: string | null;
}

// ─── HR ───────────────────────────────────────────────────
export interface Employee {
  id: string;
  user: User;
  full_name: string;
  employee_id: string;
  department: string;
  designation: string;
  date_of_joining: string;
  status: "active" | "inactive" | "on_leave";
  salary: number;
}

export interface LeaveRequest {
  id: string;
  employee: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  status: string;
  ai_score: number | null;
  ai_summary: string;
}

// ─── Projects ─────────────────────────────────────────────
export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on_hold" | "completed";
  priority: "low" | "medium" | "high" | "critical";
  start_date: string | null;
  end_date: string | null;
  task_count: number;
  member_count: number;
  ai_risk_score: number | null;
}

export interface Task {
  id: string;
  project: string;
  title: string;
  description: string;
  task_type: "task" | "bug" | "story" | "epic";
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignee: User | null;
  due_date: string | null;
  estimated_hours: number;
  logged_hours: number;
}

// ─── CRM ──────────────────────────────────────────────────
export interface Lead {
  id: string;
  name: string;
  email: string;
  company_name: string;
  status: string;
  estimated_value: number;
  ai_score: number | null;
  source: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  status: "open" | "won" | "lost";
  probability: number;
  close_date: string | null;
}

// ─── Documents ────────────────────────────────────────────
export interface Document {
  id: string;
  name: string;
  file: string;
  file_type: string;
  file_size: number;
  ai_summary: string;
  is_indexed: boolean;
  version: number;
  created_at: string;
}

// ─── AI ───────────────────────────────────────────────────
export interface ChatSession {
  id: string;
  title: string;
  persona: string;
  last_message: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

// ─── Pagination ───────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
