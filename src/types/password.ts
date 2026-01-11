export interface PasswordEntry {
  id: string;
  siteName: string;
  siteUrl?: string;
  username: string;
  password: string;
  notes?: string;
  category: PasswordCategory;
  createdAt: Date;
  updatedAt: Date;
}

export type PasswordCategory = 
  | 'social'
  | 'email'
  | 'banking'
  | 'shopping'
  | 'work'
  | 'entertainment'
  | 'other';

export const categoryIcons: Record<PasswordCategory, string> = {
  social: '👥',
  email: '✉️',
  banking: '🏦',
  shopping: '🛒',
  work: '💼',
  entertainment: '🎮',
  other: '🔐',
};

export const categoryLabels: Record<PasswordCategory, string> = {
  social: 'Social Media',
  email: 'Email',
  banking: 'Banking',
  shopping: 'Shopping',
  work: 'Work',
  entertainment: 'Entertainment',
  other: 'Other',
};
