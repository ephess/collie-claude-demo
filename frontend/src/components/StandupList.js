import React from 'react';

const StandupList = ({ standups, loading }) => {
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
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">Blockers:</p>
                    <p className="text-sm text-red-600 bg-red-50 rounded p-2">{standup.blockers}</p>
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