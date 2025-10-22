import React, { useState } from 'react';
import { useTaskManager } from './hooks/useTaskManager';
import { AddTaskForm } from './components/AddTaskForm';
import { TaskList } from './components/TaskList';
import { Header } from './components/Header';
import { ReportsPage } from './components/ReportsPage';
import { NewTask } from './types';

type Page = 'tasks' | 'reports';

function App() {
  const { tasks, addTask, deleteTask, toggleTaskCompletion } = useTaskManager();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('tasks');

  const handleAddTask = (task: NewTask) => {
    addTask(task);
    setIsModalOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-primary">
      <Header
        onAddTaskClick={() => setIsModalOpen(true)}
        onNavigate={setCurrentPage}
        activePage={currentPage}
      />
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {currentPage === 'tasks' && (
            <TaskList
              tasks={tasks}
              onToggle={toggleTaskCompletion}
              onDelete={deleteTask}
            />
        )}
        {currentPage === 'reports' && <ReportsPage tasks={tasks} />}
      </main>

      {isModalOpen && (
        <AddTaskForm
          onAddTask={handleAddTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;