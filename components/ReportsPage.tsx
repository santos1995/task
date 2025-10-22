import React, { useMemo } from 'react';
import { Task } from '../types';

interface ReportsPageProps {
  tasks: Task[];
}

const StatCard: React.FC<{ title: string; value: string | number; description: string; className?: string }> = ({ title, value, description, className = '' }) => (
    <div className={`bg-secondary p-6 rounded-xl shadow-lg ${className}`}>
        <p className="text-sm font-medium text-medium uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-extrabold text-light mt-2">{value}</p>
        <p className="text-sm text-medium mt-1">{description}</p>
    </div>
);

const BarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="bg-secondary p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-light mb-4">Completed Task Breakdown</h3>
            <div className="flex justify-around items-end h-48 gap-4">
                {data.map(item => (
                    <div key={item.label} className="flex flex-col items-center flex-grow h-full">
                        <div className="w-full h-full flex items-end">
                            <div
                                className={`w-full rounded-t-md ${item.color}`}
                                style={{ height: `${(item.value / maxValue) * 100}%` }}
                                title={`${item.label}: ${item.value}`}
                            ></div>
                        </div>
                        <p className="text-xs text-medium mt-2 text-center">{item.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ tasks }) => {
  const report = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed);
    
    const completedOnTime = completedTasks.filter(t => t.completedAt && new Date(t.completedAt) <= new Date(t.dueDate)).length;
    const completedOverdue = completedTasks.length - completedOnTime;

    const notCompletedTasks = tasks.filter(t => !t.completed);
    const currentlyOverdue = notCompletedTasks.filter(t => new Date(t.dueDate) < new Date()).length;
    
    // Scoring
    const onTimeScore = completedOnTime * 10;
    const overdueScore = completedOverdue * 2;
    const penalty = currentlyOverdue * 5;
    const totalScore = onTimeScore + overdueScore - penalty;
    
    const performancePercentage = completedTasks.length > 0
        ? Math.round((completedOnTime / completedTasks.length) * 100)
        : 0;

    return {
      totalTasks,
      completedOnTime,
      completedOverdue,
      currentlyOverdue,
      totalScore,
      performancePercentage,
    };
  }, [tasks]);
  
  const chartData = [
      { label: `On Time (${report.completedOnTime})`, value: report.completedOnTime, color: 'bg-green-500' },
      { label: `Overdue (${report.completedOverdue})`, value: report.completedOverdue, color: 'bg-yellow-500' },
  ];

  if (tasks.length === 0) {
    return (
        <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-light">No Data for Reports</h3>
            <p className="text-medium mt-2">Complete some tasks to see your performance statistics.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={report.totalTasks} description="All tasks created" />
        <StatCard title="Completed On Time" value={report.completedOnTime} description="Tasks finished before the due date" className="text-green-400" />
        <StatCard title="Completed Overdue" value={report.completedOverdue} description="Tasks finished after the due date" className="text-yellow-400" />
        <StatCard title="Currently Overdue" value={report.currentlyOverdue} description="Unfinished tasks past their due date" className="text-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
             <StatCard 
                title="Performance Score" 
                value={report.totalScore} 
                description={`Based on your task completion timeliness.`} 
                className="h-full"
            />
        </div>
        <div className="lg:col-span-2">
            <BarChart data={chartData} />
        </div>
      </div>
    </div>
  );
};