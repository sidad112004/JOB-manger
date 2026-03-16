import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  CheckCircle2, Circle, Trash2, Plus,
  Building2, CalendarDays, ClipboardList
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const PRIORITY_STYLES = {
  High:   { dot: 'bg-red-500' },
  Medium: { dot: 'bg-yellow-500' },
  Low:    { dot: 'bg-gray-400' },
};

const CATEGORY_STYLES = {
  Prep:     'bg-purple-100 text-purple-700',
  Apply:    'bg-blue-100 text-blue-700',
  Research: 'bg-cyan-100 text-cyan-700',
  Personal: 'bg-gray-100 text-gray-600',
};

const getHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

// ── Moved outside Tasks so references are stable across renders ──
function TaskItem({ task, showComplete = true, onComplete, onDelete }) {
  const p        = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;
  const today    = new Date(); today.setHours(0, 0, 0, 0);
  const overdue  = task.due_date && new Date(task.due_date) < today;
  const dueToday = task.due_date && new Date(task.due_date).toDateString() === today.toDateString();

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group ${
      task.completed
        ? 'border-gray-100 bg-gray-50/50 opacity-60'
        : overdue
          ? 'border-red-100 bg-red-50/30 hover:border-red-200'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
    }`}>
      {/* Complete toggle */}
      {showComplete ? (
        <button onClick={() => onComplete(task.id)} className="shrink-0 transition-colors">
          {task.completed
            ? <CheckCircle2 className="h-5 w-5 text-green-500" />
            : <Circle className={`h-5 w-5 ${overdue ? 'text-red-400' : 'text-gray-300 group-hover:text-gray-400'}`} />
          }
        </button>
      ) : (
        <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_STYLES[task.category] || CATEGORY_STYLES.Personal}`}>
            {task.category}
          </span>
          {task.company_name && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Building2 className="h-3 w-3" /> {task.company_name}
            </span>
          )}
          {task.due_date && !task.completed && (
            <span className={`flex items-center gap-1 text-xs font-medium ${
              overdue ? 'text-red-500' : dueToday ? 'text-yellow-600' : 'text-gray-400'
            }`}>
              <CalendarDays className="h-3 w-3" />
              {overdue ? 'Overdue · ' : dueToday ? 'Today · ' : ''}
              {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}
          {task.completed && task.completed_at && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Done {new Date(task.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* Priority dot */}
      <div className={`w-2 h-2 rounded-full shrink-0 ${p.dot}`} title={task.priority} />

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        className="p-1.5 text-gray-200 hover:text-red-400 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function Group({ label, tasks, color = 'text-gray-400', onComplete, onDelete }) {
  if (tasks.length === 0) return null;
  return (
    <div className="space-y-2">
      <p className={`text-xs font-semibold uppercase tracking-widest px-1 ${color}`}>{label}</p>
      {tasks.map(t => (
        <TaskItem key={t.id} task={t} onComplete={onComplete} onDelete={onDelete} />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function Tasks() {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [quickTitle, setQuickTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', due_date: '', priority: 'Medium', category: 'Personal', company_id: ''
  });
  const [companies, setCompanies] = useState([]);
  const quickRef = useRef(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, { headers: getHeaders() });
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/companies`, { headers: getHeaders() });
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCompanies();
  }, []);

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    try {
      await axios.post(`${API_URL}/api/tasks`, { title: quickTitle }, { headers: getHeaders() });
      setQuickTitle('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFullCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/tasks`, formData, { headers: getHeaders() });
      setFormData({ title: '', due_date: '', priority: 'Medium', category: 'Personal', company_id: '' });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/tasks/${id}/complete`, {}, { headers: getHeaders() });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, { headers: getHeaders() });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const isOverdue = (due) => due && new Date(due) < today;
  const isToday   = (due) => due && new Date(due).toDateString() === today.toDateString();

  const activeTasks    = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const overdueTasks   = activeTasks.filter(t => isOverdue(t.due_date));
  const todayTasks     = activeTasks.filter(t => isToday(t.due_date));
  const upcomingTasks  = activeTasks.filter(t => t.due_date && !isOverdue(t.due_date) && !isToday(t.due_date));
  const noDueTasks     = activeTasks.filter(t => !t.due_date);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
      <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            My Tasks
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeTasks.length} active · {completedTasks.length} completed
          </p>
        </div>
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      {/* Quick capture */}
      <form onSubmit={handleQuickAdd} className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Plus className="absolute left-3 top-2.5 h-4 w-4 text-gray-300" />
          <input
            ref={quickRef}
            type="text"
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            placeholder="Quick add task… press Enter"
            className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          />
        </div>
        <button type="submit" className="px-4 h-10 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          Add
        </button>
      </form>

      {/* Full form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-3">Task details</p>
          <form onSubmit={handleFullCreate} className="space-y-3">
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Task title *"
              required
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Due Date</label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={e => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                >
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">⚪ Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                >
                  <option value="Personal">Personal</option>
                  <option value="Prep">Prep</option>
                  <option value="Apply">Apply</option>
                  <option value="Research">Research</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Link to Company</label>
                <select
                  value={formData.company_id}
                  onChange={e => setFormData({ ...formData, company_id: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                >
                  <option value="">None</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="flex-1 h-9 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Save Task
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 h-9 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="active">
        <TabsList className="mb-5 w-full">
          <TabsTrigger value="active" className="flex-1">
            Active
            {activeTasks.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {activeTasks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Completed
            {completedTasks.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-500 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {completedTasks.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {activeTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-400 mb-3" />
              <p className="text-sm font-semibold text-gray-900">All done!</p>
              <p className="text-xs text-gray-500 mt-1">No active tasks. Add one above.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <Group label="Overdue"      tasks={overdueTasks}  color="text-red-400"    onComplete={handleComplete} onDelete={handleDelete} />
              <Group label="Today"        tasks={todayTasks}    color="text-yellow-500" onComplete={handleComplete} onDelete={handleDelete} />
              <Group label="Upcoming"     tasks={upcomingTasks} color="text-blue-400"   onComplete={handleComplete} onDelete={handleDelete} />
              <Group label="No due date"  tasks={noDueTasks}    color="text-gray-400"   onComplete={handleComplete} onDelete={handleDelete} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-gray-400">No completed tasks yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 px-1 mb-3">
                {completedTasks.length} task{completedTasks.length !== 1 ? 's' : ''} completed
              </p>
              {completedTasks.map(t => (
                <TaskItem key={t.id} task={t} showComplete={false} onComplete={handleComplete} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
