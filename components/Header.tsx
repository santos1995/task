import React from 'react';
import { PlusIcon, ChartBarIcon } from './icons';

interface HeaderProps {
    onAddTaskClick: () => void;
    onNavigate: (page: 'tasks' | 'reports') => void;
    activePage: 'tasks' | 'reports';
}

export const Header: React.FC<HeaderProps> = ({ onAddTaskClick, onNavigate, activePage }) => {
    
    const getButtonClasses = (page: 'tasks' | 'reports') => {
        const baseClasses = "font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg";
        if (activePage === page) {
            return `${baseClasses} bg-accent/20 text-accent`;
        }
        return `${baseClasses} bg-transparent hover:bg-secondary`;
    };

    return (
        <header className="bg-secondary shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-light">
                        IntelliTask <span className="text-accent">Manager</span>
                    </h1>
                     <div className="hidden sm:flex items-center gap-2 border-l border-gray-600 pl-4 ml-2">
                        <button onClick={() => onNavigate('tasks')} className={getButtonClasses('tasks')}>
                            Tasks
                        </button>
                        <button onClick={() => onNavigate('reports')} className={getButtonClasses('reports')}>
                            Reports
                        </button>
                    </div>
                </div>

                <button
                    onClick={onAddTaskClick}
                    className="flex items-center gap-2 bg-accent hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 shadow-lg"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Add New Task</span>
                </button>
            </div>
             <div className="sm:hidden flex items-center justify-around bg-primary/50 py-2">
                <button onClick={() => onNavigate('tasks')} className={getButtonClasses('tasks')}>
                    Tasks
                </button>
                <button onClick={() => onNavigate('reports')} className={getButtonClasses('reports')}>
                    Reports
                </button>
            </div>
        </header>
    );
}