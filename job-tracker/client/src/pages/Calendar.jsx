import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarDays, CheckCircle2, Circle, Clock } from 'lucide-react';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const followupsRes = await axios.get('http://localhost:5000/api/followups/upcoming', { headers });

        const followupEvents = followupsRes.data.map(f => {
          const isOverdue = !f.completed && new Date(f.followup_date) < new Date(new Date().setHours(0,0,0,0));
          return {
            title: `${f.person_name} (${f.company_name})`,
            allDay: true,
            start: new Date(f.followup_date),
            end: new Date(f.followup_date),
            resource: { ...f, isOverdue }
          };
        });

        setEvents(followupEvents);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load calendar data', err);
        setLoading(false);
      }
    };
    fetchCalendarData();
  }, []);

  const eventStyleGetter = (event) => {
    let bg = '#f59e0b';
    let border = '#d97706';
    if (event.resource.completed) { bg = '#10b981'; border = '#059669'; }
    else if (event.resource.isOverdue) { bg = '#ef4444'; border = '#dc2626'; }

    return {
      style: {
        backgroundColor: bg,
        borderColor: border,
        border: `1px solid ${border}`,
        borderRadius: '6px',
        color: 'white',
        fontSize: '12px',
        fontWeight: '500',
        padding: '2px 6px',
      }
    };
  };

  const CustomEvent = ({ event }) => (
    <div className="flex items-center gap-1 overflow-hidden truncate">
      {event.resource.completed
        ? <CheckCircle2 className="h-3 w-3 shrink-0" />
        : event.resource.isOverdue
          ? <Clock className="h-3 w-3 shrink-0" />
          : <Circle className="h-3 w-3 shrink-0" />}
      <span className="truncate">{event.title}</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-600" /> Application Calendar
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Track scheduled follow-ups and deadlines</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium bg-white border border-gray-100 px-4 py-2 rounded-lg shadow-sm">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Completed</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" /> Upcoming</div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Overdue</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-4" style={{ height: '75vh' }}>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-7 h-7 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading calendar…</p>
          </div>
        ) : (
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            eventPropGetter={eventStyleGetter}
            components={{ event: CustomEvent }}
          />
        )}
      </div>
    </div>
  );
}
