import React, { useState } from 'react';

const API_URL = 'http://localhost:3001/api';

const StandupList = ({ standups, loading }) => {
  const [actionLoading, setActionLoading] = useState({});

  const handleNudge = async (standup) => {
    try {
      setActionLoading(prev => ({ ...prev, [`nudge-${standup.id}`]: true }));
      
      const response = await fetch(`${API_URL}/standups/nudge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          standupId: standup.id,
          recipientName: standup.name
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
      setActionLoading(prev => ({ ...prev, [`nudge-${standup.id}`]: false }));
    }
  };

  const handleMeet = async (standup) => {
    try {
      setActionLoading(prev => ({ ...prev, [`meet-${standup.id}`]: true }));
      
      const response = await fetch(`${API_URL}/standups/meet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          standupId: standup.id,
          participants: [standup.name, 'Team Lead'],
          blockerDescription: standup.blockers
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
      setActionLoading(prev => ({ ...prev, [`meet-${standup.id}`]: false }));
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border-l-4 border-gray-200 pl-4">
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

  if (standups.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No standups yet today</h3>
        <p className="text-gray-600">Team members haven't submitted their daily standups yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Today's Standups ({standups.length})</h2>
        <div className="space-y-6">
          {standups.map(standup => (
            <div key={standup.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <img
                    src={standup.avatar_url}
                    alt={standup.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{standup.name}</h3>
                    <p className="text-sm text-gray-600">{standup.role}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(standup.created_at).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
              
              <div className="space-y-3 ml-13">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Yesterday:</p>
                  <p className="text-sm text-gray-600">{standup.yesterday}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Today:</p>
                  <p className="text-sm text-gray-600">{standup.today}</p>
                </div>
                
                {standup.blockers && standup.blockers.trim() && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-red-700 mb-2">🚫 Blockers:</p>
                    <p className="text-sm text-red-600 mb-3">{standup.blockers}</p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleNudge(standup)}
                        disabled={actionLoading[`nudge-${standup.id}`]}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center"
                      >
                        {actionLoading[`nudge-${standup.id}`] ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                        onClick={() => handleMeet(standup)}
                        disabled={actionLoading[`meet-${standup.id}`]}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center"
                      >
                        {actionLoading[`meet-${standup.id}`] ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 012h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                          </span>
                        ) : (
                          <>📅 Meet</>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StandupList;