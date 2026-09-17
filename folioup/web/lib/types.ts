export type Role = 'seeker' | 'company';

export interface Profile {
  id: string;
  role: Role;
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
}

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  task_id: string;
  seeker_id: string;
  status: ApplicationStatus;
  applied_at: string;
  profiles?: Profile;
}

export interface Submission {
  id: string;
  application_id: string;
  content_url: string;
  notes: string | null;
  submitted_at: string;
}

export interface Evaluation {
  id: string;
  submission_id: string;
  score: number;
  feedback: string;
  would_hire: boolean;
  evaluated_at: string;
}
