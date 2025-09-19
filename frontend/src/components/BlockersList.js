import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

const BlockersList = () => {
  const [blockers, setBlockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchBlockers();
  }, []);

  const fetchBlockers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/standups/blockers`);
      const data = await response.json();
      setBlockers(data);
    } catch (error) {
      console.error('Error fetching blockers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNudge = async (blocker) => {
    try {
      setActionLoading(prev => ({ ...prev, [`nudge-${blocker.id}`]: true }));
      
      const response = await fetch(`${API_URL}/standups/nudge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          standupId: blocker.id,
          recipientName: blocker.name
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ ${result.message}`);
      } else {
        alert(`❌ Failed to send nudge: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending nudge:', error);
      alert('❌ Failed to send nudge');
    } finally {
      setActionLoading(prev => ({ ...prev, [`nudge-${blocker.id}`]: false }));
    }
  };

  const handleMeet = async (blocker) => {
    try {
      setActionLoading(prev => ({ ...prev, [`meet-${blocker.id}`]: true }));
      
      const response = await fetch(`${API_URL}/standups/meet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          standupId: blocker.id,
          participants: [blocker.name, 'Team Lead'],
          blockerDescription: blocker.blockers
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ ${result.message}\n🔗 Meeting Link: ${result.meetingLink}\n📝 Agenda: ${result.agenda}`);
      } else {
        alert(`❌ Failed to create meeting: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('❌ Failed to create meeting');
    } finally {
      setActionLoading(prev => ({ ...prev, [`meet-${blocker.id}`]: false }));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-l-4 border-red-200 pl-4">
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (blockers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No active blockers</h3>
        <p className="text-gray-600">Great! No team members are currently blocked.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-red-700">Active Blockers ({blockers.length})</h2>
          <button
            onClick={fetchBlockers}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
        
        <div className="space-y-6">
          {blockers.map(blocker => (
            <div key={blocker.id} className="border-l-4 border-red-500 pl-4 bg-red-50 rounded-r-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <img
                    src={blocker.avatar_url}
                    alt={blocker.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{blocker.name}</h3>
                    <p className="text-sm text-gray-600">{blocker.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 block">
                    {new Date(blocker.date).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(blocker.created_at).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-red-700 mb-2">🚫 Blocker:</p>
                <p className="text-sm text-red-800 bg-white rounded p-3 border border-red-200">
                  {blocker.blockers}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleNudge(blocker)}
                  disabled={actionLoading[`nudge-${blocker.id}`]}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {actionLoading[`nudge-${blocker.id}`] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>💬 Nudge</>
                  )}
                </button>
                
                <button
                  onClick={() => handleMeet(blocker)}
                  disabled={actionLoading[`meet-${blocker.id}`]}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {actionLoading[`meet-${blocker.id}`] ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    <>📅 Meet</>
                  )}
                </button>
              </div>
              
              <div className="mt-3 text-xs text-gray-600">
                <p><strong>Yesterday:</strong> {blocker.yesterday}</p>
                <p><strong>Today:</strong> {blocker.today}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockersList;