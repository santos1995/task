
import React, { useMemo } from 'react';
import { Task } from '../types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
    }, [tasks]);

    if (tasks.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-light">No tasks yet!</h3>
                <p className="text-medium mt-2">Click "Add New Task" to get started.</p>
            </div>
        );
    }
  
    return (
        <div className="space-y-4">
            {sortedTasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};
