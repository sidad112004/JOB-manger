import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import CalendarHeatmap from 'react-calendar-heatmap';
import { Building2, FileText, Users, CheckCircle, XCircle, Clock, CalendarDays } from 'lucide-react';
import 'react-calendar-heatmap/dist/styles.css';

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_companies: 0, total_jobs: 0, interviews: 0, offers: 0, rejections: 0
  });
  const [activity, setActivity] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [activitiesList, setActivitiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [statsRes, activityRes, followupsRes, timelineRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/stats', { headers }),
          axios.get('http://localhost:5000/api/dashboard/activity', { headers }),
          axios.get('http://localhost:5000/api/followups/upcoming', { headers }),
          axios.get('http://localhost:5000/api/activities?limit=10', { headers })
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data);
        setFollowups(followupsRes.data);
        setActivitiesList(timelineRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
        setError('Failed to load dashboard data. Please refresh the page.');
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleCompleteFollowup = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/followups/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const res = await axios.get('http://localhost:5000/api/followups/upcoming', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowups(res.data);
    } catch (err) {
      console.error('Failed to complete followup', err);
    }
  };

  const today = new Date();
  const shiftDate = (date, numDays) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-gray-400">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-red-500">
        <p className="text-sm mb-3">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm">Try Again</Button>
      </div>
    );
  }

  const statCards = [
    { label: 'Companies',    value: stats.total_companies, icon: Building2, color: 'text-blue-500',   bg: 'bg-blue-50' },
    { label: 'Applications', value: stats.total_jobs,      icon: FileText,  color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Interviews',   value: stats.interviews,      icon: Users,     color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Offers',       value: stats.offers,          icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Rejections',   value: stats.rejections,      icon: XCircle,   color: 'text-red-500',    bg: 'bg-red-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your job search at a glance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Follow-ups + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Follow-ups */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Follow-ups</h2>
          </div>
          <div className="p-4">
            {followups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <CheckCircle className="h-8 w-8 mb-2 text-green-400" />
                <p className="text-sm">All caught up!</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {followups.map(f => {
                  const fDate = new Date(f.followup_date);
                  const isToday = fDate.toDateString() === today.toDateString();
                  return (
                    <li key={f.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0">
                          {f.person_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{f.person_name}</p>
                          <p className="text-xs text-gray-400">{f.company_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isToday ? 'bg-red-100 text-red-600' : 'bg-yellow-50 text-yellow-700'}`}>
                          {isToday ? 'Today' : fDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => handleCompleteFollowup(f.id)} className="h-7 text-xs px-2">
                          Done
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Application Activity</h2>
          </div>
          <div className="p-6 flex items-center justify-center">
            <CalendarHeatmap
              startDate={shiftDate(today, -135)}
              endDate={today}
              values={activity}
              classForValue={(value) => {
                if (!value) return 'color-empty';
                return `color-scale-${Math.min(value.count, 4)}`;
              }}
            />
          </div>
        </div>
      </div>

      {/* Activity timeline */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-5">
          {activitiesList.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No recent activity.</p>
          ) : (
            <ul className="space-y-4">
              {activitiesList.map((act, idx) => (
                <li key={act.id} className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block" />
                  </div>
                  <div className="flex-1 flex justify-between gap-4">
                    <p className="text-sm text-gray-700">{act.action}</p>
                    <time className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {new Date(act.created_at).toLocaleString()}
                    </time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
