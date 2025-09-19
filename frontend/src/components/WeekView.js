import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

const WeekView = () => {
  const [weekData, setWeekData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()));

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(d.setDate(diff));
  }

  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  function getWeekDays(startDate) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  }

  useEffect(() => {
    fetchWeekData();
  }, [currentWeek]);

  const fetchWeekData = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await fetch(`${API_URL}/users`);
      const usersData = await usersResponse.json();
      setUsers(usersData);
      
      // Fetch week standups
      const weekResponse = await fetch(`${API_URL}/standups/week/${formatDate(currentWeek)}`);
      const weekStandups = await weekResponse.json();
      setWeekData(weekStandups);
    } catch (error) {
      console.error('Error fetching week data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const hasStandup = (userId, date) => {
    return weekData.some(s => 
      s.user_id === userId && 
      s.date === formatDate(date)
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const weekDays = getWeekDays(currentWeek);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-8 gap-2">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-lg font-semibold">
            Week of {currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Week Grid */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Member
                </th>
                {weekDays.map(day => (
                  <th
                    key={day.toISOString()}
                    className={`px-3 py-2 text-center text-xs font-medium uppercase tracking-wider ${
                      isToday(day)
                        ? 'text-blue-600 bg-blue-50'
                        : isWeekend(day)
                        ? 'text-gray-400 bg-gray-50'
                        : 'text-gray-500'
                    }`}
                  >
                    <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-lg">{day.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-8 w-8 rounded-full mr-2"
                        src={user.avatar_url}
                        alt={user.name}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
                    </div>
                  </td>
                  {weekDays.map(day => {
                    const hasSubmitted = hasStandup(user.id, day);
                    const weekend = isWeekend(day);
                    
                    return (
                      <td
                        key={day.toISOString()}
                        className={`px-3 py-4 text-center ${
                          isToday(day) ? 'bg-blue-50' : weekend ? 'bg-gray-50' : ''
                        }`}
                      >
                        {!weekend && (
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            hasSubmitted
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {hasSubmitted ? '✓' : '○'}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800 mr-2">
              ✓
            </span>
            <span className="text-gray-600">Submitted</span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 mr-2">
              ○
            </span>
            <span className="text-gray-600">Not Submitted</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-6 h-6 bg-gray-50 rounded mr-2"></span>
            <span className="text-gray-600">Weekend</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekView;