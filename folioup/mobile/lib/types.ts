export interface Profile {
  id: string;
  role: 'seeker' | 'company';
  name: string;
  company_name: string | null;
  bio: string | null;
  created_at: string;
}

export type TaskStatus = 'open' | 'closed';

export interface Task {
  id: string;
  company_id: string;
  title: string;
  description: string;
  skill_tags: string[];
  reward_amount: number;
  duration_days: number;
  status: TaskStatus;
  created_at: string;
  profiles?: { company_name: string | null };
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  task_id: string;
  seeker_id: string;
  status: ApplicationStatus;
  applied_at: string;
  tasks?: Task;
  submissions?: { id: string; content_url: string; notes: string | null }[];
}

export interface TrackRecord {
  seeker_id: string;
  completed_count: number;
  avg_score: number | null;
  would_hire_count: number;
}
