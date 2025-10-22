export enum RecurrenceType {
  NONE = 'Does not repeat',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export enum MonthlyRecurrenceType {
  BY_DAY_OF_MONTH = 'by_day_of_month',
  BY_DAY_OF_WEEK = 'by_day_of_week',
}

export interface RecurrenceRule {
  type: RecurrenceType;
  // For WEEKLY
  daysOfWeek?: number[];
  // For MONTHLY
  monthlyType?: MonthlyRecurrenceType;
  dayOfMonth?: number; // for MonthlyRecurrenceType.BY_DAY_OF_MONTH
  weekOfMonth?: 'first' | 'second' | 'third' | 'fourth' | 'last'; // for MonthlyRecurrenceType.BY_DAY_OF_WEEK
  dayOfWeek?: number; // for MonthlyRecurrenceType.BY_DAY_OF_WEEK
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  completed: boolean;
  recurrence: RecurrenceRule;
  createdAt: string; // ISO string
  completedAt?: string; // ISO string - New field for reporting
}

export type NewTask = Omit<Task, 'id' | 'completed' | 'createdAt' | 'completedAt'>;