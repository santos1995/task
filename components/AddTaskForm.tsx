
import React, { useState, useCallback } from 'react';
import { NewTask, RecurrenceType, MonthlyRecurrenceType } from '../types';
import { suggestSubTasks } from '../services/geminiService';
import { SparklesIcon } from './icons';

interface AddTaskFormProps {
  onAddTask: (task: NewTask) => void;
  onClose: () => void;
}

const WEEK_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKS_OF_MONTH = [
    { value: 'first', label: 'First' },
    { value: 'second', label: 'Second' },
    { value: 'third', label: 'Third' },
    { value: 'fourth', label: 'Fourth' },
    { value: 'last', label: 'Last' },
];

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(RecurrenceType.NONE);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [dayOfMonth, setDayOfMonth] = useState<number>(1);
  const [isSuggesting, setIsSuggesting] = useState(false);

  // New state for advanced monthly recurrence
  const [monthlyRecurrenceType, setMonthlyRecurrenceType] = useState<MonthlyRecurrenceType>(MonthlyRecurrenceType.BY_DAY_OF_MONTH);
  const [weekOfMonth, setWeekOfMonth] = useState<'first' | 'second' | 'third' | 'fourth' | 'last'>('first');
  const [dayOfWeekForMonthly, setDayOfWeekForMonthly] = useState<number>(0); // 0 for Sunday

  const handleDayOfWeekChange = (dayIndex: number) => {
    setDaysOfWeek(prev =>
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const handleSuggestSubTasks = useCallback(async () => {
    if (!title) return;
    setIsSuggesting(true);
    try {
      const suggestions = await suggestSubTasks(title, description);
      if (suggestions.length > 0) {
        const subTaskList = suggestions.map(s => `- ${s}`).join('\n');
        setDescription(prev => (prev ? `${prev}\n\nSub-tasks:\n${subTaskList}` : `Sub-tasks:\n${subTaskList}`));
      }
    } finally {
      setIsSuggesting(false);
    }
  }, [title, description]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let recurrence: NewTask['recurrence'] = { type: recurrenceType };

    if (recurrenceType === RecurrenceType.WEEKLY) {
        recurrence = { ...recurrence, daysOfWeek };
    } else if (recurrenceType === RecurrenceType.MONTHLY) {
        recurrence = { ...recurrence, monthlyType: monthlyRecurrenceType };
        if (monthlyRecurrenceType === MonthlyRecurrenceType.BY_DAY_OF_MONTH) {
            recurrence = { ...recurrence, dayOfMonth };
        } else {
            recurrence = { ...recurrence, weekOfMonth, dayOfWeek: dayOfWeekForMonthly };
        }
    }

    const task: NewTask = {
      title,
      description,
      dueDate,
      recurrence,
    };
    onAddTask(task);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-light mb-6">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-medium mb-1">Title</label>
            <div className="relative">
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)}
                className="w-full bg-primary border border-gray-600 rounded-md p-2.5 text-light focus:ring-accent focus:border-accent"
                required
              />
              <button type="button" onClick={handleSuggestSubTasks} disabled={isSuggesting || !title}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm bg-accent/20 hover:bg-accent/40 text-accent font-semibold px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <SparklesIcon className="w-4 h-4" />
                {isSuggesting ? 'Thinking...' : 'AI Suggest'}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-medium mb-1">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)}
              className="w-full bg-primary border border-gray-600 rounded-md p-2 text-light focus:ring-accent focus:border-accent"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-medium mb-1">Due Date</label>
              <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full bg-primary border border-gray-600 rounded-md p-2 text-light focus:ring-accent focus:border-accent"
                required
              />
            </div>
            <div>
              <label htmlFor="recurrence" className="block text-sm font-medium text-medium mb-1">Recurrence</label>
              <select id="recurrence" value={recurrenceType} onChange={e => setRecurrenceType(e.target.value as RecurrenceType)}
                className="w-full bg-primary border border-gray-600 rounded-md p-2.5 text-light focus:ring-accent focus:border-accent">
                {Object.values(RecurrenceType).map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>
          
          {recurrenceType === RecurrenceType.WEEKLY && (
            <div>
              <label className="block text-sm font-medium text-medium mb-2">Repeat on</label>
              <div className="flex flex-wrap gap-2">
                {WEEK_DAYS.map((day, index) => (
                  <button type="button" key={day} onClick={() => handleDayOfWeekChange(index)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      daysOfWeek.includes(index) ? 'bg-accent text-white font-bold' : 'bg-primary hover:bg-primary/60'
                    }`}>
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {recurrenceType === RecurrenceType.MONTHLY && (
             <div className="bg-primary p-4 rounded-md space-y-4">
                <label className="block text-sm font-medium text-medium">Repeat method</label>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="monthlyType" value={MonthlyRecurrenceType.BY_DAY_OF_MONTH} checked={monthlyRecurrenceType === MonthlyRecurrenceType.BY_DAY_OF_MONTH} onChange={(e) => setMonthlyRecurrenceType(e.target.value as MonthlyRecurrenceType)} className="bg-primary border-gray-600 text-accent focus:ring-accent focus:ring-offset-primary" />
                        <span className="text-light">Day of the month</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="monthlyType" value={MonthlyRecurrenceType.BY_DAY_OF_WEEK} checked={monthlyRecurrenceType === MonthlyRecurrenceType.BY_DAY_OF_WEEK} onChange={(e) => setMonthlyRecurrenceType(e.target.value as MonthlyRecurrenceType)} className="bg-primary border-gray-600 text-accent focus:ring-accent focus:ring-offset-primary" />
                        <span className="text-light">Day of the week</span>
                    </label>
                </div>

                {monthlyRecurrenceType === MonthlyRecurrenceType.BY_DAY_OF_MONTH && (
                    <div>
                        <label htmlFor="dayOfMonth" className="block text-sm font-medium text-medium mb-1">Day of Month</label>
                        <input type="number" id="dayOfMonth" value={dayOfMonth} onChange={e => setDayOfMonth(parseInt(e.target.value))} min="1" max="31" className="w-full bg-primary border border-gray-600 rounded-md p-2 text-light focus:ring-accent focus:border-accent" />
                    </div>
                )}

                {monthlyRecurrenceType === MonthlyRecurrenceType.BY_DAY_OF_WEEK && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="weekOfMonth" className="block text-sm font-medium text-medium mb-1">On the</label>
                            <select id="weekOfMonth" value={weekOfMonth} onChange={e => setWeekOfMonth(e.target.value as any)} className="w-full bg-primary border border-gray-600 rounded-md p-2.5 text-light focus:ring-accent focus:border-accent">
                                {WEEKS_OF_MONTH.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dayOfWeekForMonthly" className="block text-sm font-medium text-medium mb-1">&nbsp;</label>
                            <select id="dayOfWeekForMonthly" value={dayOfWeekForMonthly} onChange={e => setDayOfWeekForMonthly(parseInt(e.target.value))} className="w-full bg-primary border border-gray-600 rounded-md p-2.5 text-light focus:ring-accent focus:border-accent">
                                {WEEK_DAYS.map((day, index) => <option key={index} value={index}>{day}</option>)}
                            </select>
                        </div>
                    </div>
                )}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-light bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-md text-white bg-accent hover:bg-blue-500 transition-colors font-semibold">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};
