import React from 'react';

const TeamMember = ({ user, hasSubmittedToday, onAddStandup }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.role}</p>
          </div>
        </div>
        <div className="flex items-center">
          {hasSubmittedToday ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              ✓ Submitted
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pending
            </span>
          )}
        </div>
      </div>
      
      {!hasSubmittedToday && (
        <button
          onClick={onAddStandup}
          className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          Add Standup for {user.name.split(' ')[0]}
        </button>
      )}
    </div>
  );
};

export default TeamMember;