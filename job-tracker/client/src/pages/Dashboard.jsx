import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

export function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    total_companies: 0,
    total_jobs: 0,
    interviews: 0,
    offers: 0,
    rejections: 0
  });
  const [activity, setActivity] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user data (basic mock from token for now, or just generic greeting)
        setUserName('User'); // In a real app, parse JWT or have a /me endpoint

        const [statsRes, activityRes, followupsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/stats', { headers }),
          axios.get('http://localhost:5000/api/dashboard/activity', { headers }),
          axios.get('http://localhost:5000/api/followups/upcoming', { headers })
        ]);

        setStats(statsRes.data);
        setActivity(activityRes.data);
        setFollowups(followupsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
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
      // Refresh followups
      const res = await axios.get('http://localhost:5000/api/followups/upcoming', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFollowups(res.data);
    } catch (err) {
      console.error('Failed to complete followup', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const today = new Date();
  const shiftDate = (date, numDays) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Job Tracker Dashboard</h1>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => navigate('/companies')}>View Companies</Button>
            <Button variant="outline" onClick={() => navigate('/calendar')}>View Calendar</Button>
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div>
          <h2 className="text-xl font-medium text-gray-800 mb-4">Welcome back! Here's your tracker overview.</h2>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_companies}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_jobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.interviews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.offers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Rejections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.rejections}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upcoming Followups */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Follow-ups</CardTitle>
            </CardHeader>
            <CardContent>
              {followups.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming follow-ups scheduled.</p>
              ) : (
                <ul className="space-y-4">
                  {followups.map(f => (
                    <li key={f.id} className="flex justify-between items-center text-sm bg-orange-50 border border-orange-100 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-orange-900">Follow up with {f.person_name} ({f.company_name})</p>
                        <p className="text-xs text-orange-700">{new Date(f.followup_date).toLocaleDateString()}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleCompleteFollowup(f.id)}>Mark Completed</Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Heatmap Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Application Activity</CardTitle>
            </CardHeader>
            <CardContent className="h-48">
              <CalendarHeatmap
                startDate={shiftDate(today, -150)}
                endDate={today}
                values={activity}
                classForValue={(value) => {
                  if (!value) {
                    return 'color-empty fill-gray-100';
                  }
                  return `color-scale-${Math.min(value.count, 4)} fill-blue-${Math.min(value.count, 4) * 200}`;
                }}
                tooltipDataAttrs={value => {
                  return {
                    'data-tip': `${value.date ? value.date : 'No date'} has count: ${
                      value.count
                    }`,
                  };
                }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
