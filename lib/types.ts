export interface UserProfile {
  name: string;
  email: string;
  role: string;
  skills: string[];
  resume?: string;
  portfolioLinks: string[];
}

export interface JobListing {
  url: string;
  title: string;
  company: string;
  description: string;
  hiringManager?: string;
}

export interface GeneratedEmail {
  subject: string;
  body: string;
  score: number;
  relevance: number;
  tone: number;
  personalization: number;
  clarity: number;
}

export interface Campaign {
  id: string;
  name: string;
  emails: number;
  sent: number;
  opened: number;
  replied: number;
  status: 'draft' | 'active' | 'complete';
  created: string;
}

export interface EmailAnalytics {
  to: string;
  subject: string;
  opened: boolean;
  replied: boolean;
  time: string;
}
