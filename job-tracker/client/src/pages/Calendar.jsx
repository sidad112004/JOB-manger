import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';
import { Button } from '../components/ui/button';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function Calendar() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // We fetch jobs and followups to populate the calendar
        const [companiesRes, followupsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/companies', { headers }),
          axios.get('http://localhost:5000/api/followups/upcoming', { headers })
        ]);

        const calendarEvents = [];
        const companies = companiesRes.data;

        // Fetch jobs individually to build the big picture (Alternatively, we could build a specific /api/calendar endpoint)
        // Here we just map followups for simplicity in this implementation step.
        const followupEvents = followupsRes.data.map(f => ({
          title: `Follow up: ${f.person_name} (${f.company_name})`,
          allDay: true,
          start: new Date(f.followup_date),
          end: new Date(f.followup_date),
          resource: f
        }));

        setEvents(followupEvents);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load calendar data', err);
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-white mt-8 rounded-lg shadow-sm border">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading Calendar...</div>
        ) : (
          <div style={{ height: '70vh' }}>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
