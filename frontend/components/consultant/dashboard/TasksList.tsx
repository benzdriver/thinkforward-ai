import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  clientId?: string;
  clientName?: string;
}

interface TasksListProps {
  tasks: Task[];
}

export default function TasksList({ tasks }: TasksListProps) {
  const { t } = useTranslation('consultant');
  const [tasksList, setTasksList] = useState(tasks);
  
  const handleToggleComplete = (taskId: string) => {
    setTasksList(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {t('dashboard.tasks')}
      </h2>
      
      {tasksList.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('dashboard.no_pending_tasks')}
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tasksList.map((task) => (
            <li key={task.id} className="py-3">
              <div className="flex items-start">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className={`flex-shrink-0 h-5 w-5 mr-3 mt-1 ${
                    task.completed 
                      ? 'text-green-500' 
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <CheckCircleIcon />
                </button>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className={`text-sm font-medium ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                    }`}>
                      {task.title}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(task.priority)}`}>
                      {t(`dashboard.priority.${task.priority}`)}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${
                    task.completed ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {task.description}
                  </p>
                  
                  {task.clientName && (
                    <p className="text-xs text-gray-500 mt-1">
                      {t('dashboard.client')}: {task.clientName}
                    </p>
                  )}
                  
                  <div className="flex items-center mt-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <div className="mt-4 flex justify-between">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {t('dashboard.view_all_tasks')}
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
          {t('dashboard.add_task')}
        </button>
      </div>
    </div>
  );
} 