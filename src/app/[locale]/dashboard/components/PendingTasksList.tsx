'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { 
  RiCheckboxCircleLine, 
  RiTimeLine, 
  RiArrowRightLine,
  RiFileList2Line,
  RiExternalLinkLine
} from 'react-icons/ri';

interface PendingTask {
  id: string;
  taskType: string;
  taskTitle: string;
  taskDescription: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED' | 'SNOOZED';
  dueDate: string | null;
  snoozedUntil: string | null;
  actionUrl: string | null;
  referenceType: string | null;
  referenceId: string | null;
  createdAt: string;
}

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700'
};

const priorityBorders = {
  LOW: 'border-l-gray-300',
  MEDIUM: 'border-l-blue-400',
  HIGH: 'border-l-orange-400',
  URGENT: 'border-l-red-500'
};

export default function PendingTasksList() {
  const [tasks, setTasks] = useState<PendingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/user/pending-tasks', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        // Only show pending and in-progress tasks on dashboard (max 3)
        const activeTasks = (data.tasks || [])
          .filter((t: PendingTask) => t.status === 'PENDING' || t.status === 'IN_PROGRESS')
          .slice(0, 3);
        setTasks(activeTasks);
      }
    } catch (error) {
      console.error('Failed to fetch pending tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-16 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <RiCheckboxCircleLine className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
          </div>
        </div>
        <div className="text-center py-6 text-gray-500">
          <RiCheckboxCircleLine className="w-12 h-12 mx-auto mb-2 text-green-400" />
          <p>All caught up! No pending tasks.</p>
        </div>
      </div>
    );
  }

  return (
    <Link 
      href={`/${locale}/dashboard/tasks`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-amber-200 transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
            <RiFileList2Line className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
          View All <RiExternalLinkLine className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`border-l-4 ${priorityBorders[task.priority]} bg-gray-50 rounded-r-lg p-4`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                  {task.taskType === 'questionnaire' && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">
                      Questionnaire
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <RiTimeLine className="w-3 h-3" />
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-gray-900">{task.taskTitle}</h4>
                {task.taskDescription && (
                  <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">{task.taskDescription}</p>
                )}
              </div>
              
              <div className="flex items-center flex-shrink-0">
                <RiArrowRightLine className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <span className="text-sm text-amber-600 font-medium group-hover:underline">
            View all tasks →
          </span>
        </div>
      )}
    </Link>
  );
}
