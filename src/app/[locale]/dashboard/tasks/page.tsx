'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { 
  RiCheckboxCircleLine, 
  RiTimeLine, 
  RiArrowRightLine,
  RiArrowLeftLine,
  RiFileList2Line,
  RiFilterLine,
  RiCalendarLine,
  RiShoppingBag2Line,
  RiAlarmLine
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
  LOW: 'bg-gray-100 text-gray-700 border-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-700 border-blue-300',
  HIGH: 'bg-orange-100 text-orange-700 border-orange-300',
  URGENT: 'bg-red-100 text-red-700 border-red-300'
};

const priorityBorders = {
  LOW: 'border-l-gray-400',
  MEDIUM: 'border-l-blue-500',
  HIGH: 'border-l-orange-500',
  URGENT: 'border-l-red-600'
};

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  DISMISSED: 'bg-gray-100 text-gray-600',
  SNOOZED: 'bg-purple-100 text-purple-800'
};

type FilterType = 'all' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED';

export default function PendingTasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const [tasks, setTasks] = useState<PendingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/en/login');
      return;
    }
    if (user) {
      fetchTasks();
    }
  }, [user, authLoading, router]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/user/pending-tasks', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Failed to fetch pending tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  const pendingCount = tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/en/dashboard"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RiArrowLeftLine className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pending Tasks</h1>
                <p className="text-sm text-gray-500">
                  {pendingCount} {pendingCount === 1 ? 'task' : 'tasks'} pending
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <RiFilterLine className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {(['all', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'DISMISSED'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              {f === 'all' && ` (${tasks.length})`}
              {f !== 'all' && ` (${tasks.filter(t => t.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <RiCheckboxCircleLine className="w-16 h-16 mx-auto text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No tasks yet' : `No ${filter.toLowerCase().replace('_', ' ')} tasks`}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'Tasks will appear here when you have orders to complete.'
                : 'Try selecting a different filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white border-l-4 ${priorityBorders[task.priority]} rounded-lg shadow-sm border border-gray-200 overflow-hidden`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header with badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        {task.taskType === 'questionnaire' && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">
                            Questionnaire
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.taskTitle}</h3>
                      
                      {/* Description */}
                      {task.taskDescription && (
                        <p className="text-gray-600 mb-3">{task.taskDescription}</p>
                      )}

                      {/* Meta info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <RiCalendarLine className="w-4 h-4" />
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <RiTimeLine className="w-4 h-4" />
                          Created {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        {task.status === 'SNOOZED' && task.snoozedUntil && (
                          <span className="flex items-center gap-1 text-purple-600">
                            <RiAlarmLine className="w-4 h-4" />
                            Snoozed until {new Date(task.snoozedUntil).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {task.status !== 'COMPLETED' && task.status !== 'DISMISSED' && (
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                      {task.actionUrl && (
                        <Link
                          href={task.actionUrl}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                        >
                          <RiFileList2Line className="w-4 h-4" />
                          Start Task
                          <RiArrowRightLine className="w-4 h-4" />
                        </Link>
                      )}
                      
                      <Link
                        href={`/${locale}/dashboard/orders`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <RiShoppingBag2Line className="w-4 h-4" />
                        Manage Order
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
