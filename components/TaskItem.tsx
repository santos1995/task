import React from 'react';
import { Task, RecurrenceType, MonthlyRecurrenceType } from '../types';
import { TrashIcon, CalendarIcon, RepeatIcon } from './icons';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const getRecurrenceText = (task: Task) => {
    const { recurrence } = task;
    if (!recurrence || recurrence.type === RecurrenceType.NONE) return null;

    // FIX: Explicitly type `text` as `string`. Without this, `text` is inferred as type `RecurrenceType` from `recurrence.type`.
    // Appending a string to it (e.g., `text += '...'`) creates a `string`, which cannot be assigned back to a variable of type `RecurrenceType`.
    let text: string = recurrence.type;

    if (recurrence.type === RecurrenceType.WEEKLY && recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const selectedDays = recurrence.daysOfWeek.sort((a,b) => a - b).map(d => days[d]).join(', ');
        text += ` on ${selectedDays}`;
    }
    
    if (recurrence.type === RecurrenceType.MONTHLY) {
        if (recurrence.monthlyType === MonthlyRecurrenceType.BY_DAY_OF_WEEK && recurrence.weekOfMonth && recurrence.dayOfWeek !== undefined) {
            const weeks: { [key: string]: string } = { first: 'first', second: 'second', third: 'third', fourth: 'fourth', last: 'last' };
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            text += ` on the ${weeks[recurrence.weekOfMonth]} ${days[recurrence.dayOfWeek]}`;
        } else if (recurrence.dayOfMonth) { // Handles new BY_DAY_OF_MONTH and provides fallback for old data
            text += ` on day ${recurrence.dayOfMonth}`;
        }
    }
    
    if (recurrence.type === RecurrenceType.YEARLY) {
        text += ` on ${new Date(task.dueDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`;
    }

    return text;
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
    const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
    const recurrenceText = getRecurrenceText(task);

    return (
        <div className={`
            bg-secondary p-4 rounded-lg shadow-lg flex items-start gap-4 transition-all duration-300
            ${task.completed ? 'opacity-50' : ''}
            ${isOverdue ? 'border-l-4 border-red-500' : 'border-l-4 border-accent'}
        `}>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="mt-1.5 h-5 w-5 rounded bg-primary border-medium text-accent focus:ring-accent"
            />
            <div className="flex-grow">
                <p className={`font-bold text-lg ${task.completed ? 'line-through text-medium' : 'text-light'}`}>
                    {task.title}
                </p>
                {task.description && (
                    <p className="text-medium text-sm mt-1 whitespace-pre-wrap">{task.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-medium">
                    <div className="flex items-center gap-1.5">
                        <CalendarIcon className={`w-4 h-4 ${isOverdue ? 'text-red-400' : ''}`} />
                        <span className={isOverdue ? 'text-red-400 font-semibold' : ''}>{formatDate(task.dueDate)}</span>
                    </div>
                    {recurrenceText && (
                        <div className="flex items-center gap-1.5">
                            <RepeatIcon className="w-4 h-4" />
                            <span>{recurrenceText}</span>
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={() => onDelete(task.id)}
                className="text-medium hover:text-red-500 transition-colors p-1"
                aria-label="Delete task"
            >
                <TrashIcon />
            </button>
        </div>
    );
};