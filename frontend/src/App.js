import React, { useState, useEffect } from 'react';
import StandupEntry from './components/StandupEntry';
import StandupList from './components/StandupList';
import WeekView from './components/WeekView';
import TeamMember from './components/TeamMember';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [users, setUsers] = useState([]);
  const [todayStandups, setTodayStandups] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    fetchUsers();
    fetchTodayStandups();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTodayStandups = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${API_URL}/standups/date/${today}`);
      const data = await response.json();
      setTodayStandups(data);
    } catch (error) {
      console.error('Error fetching standups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStandupSubmit = async (standupData) => {
    try {
      const response = await fetch(`${API_URL}/standups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standupData),
      });
      
      if (response.ok) {
        fetchTodayStandups();
        setShowEntryForm(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Error submitting standup:', error);
    }
  };

  const getUsersWithoutStandup = () => {
    const submittedUserIds = todayStandups.map(s => s.user_id);
    return users.filter(u => !submittedUserIds.includes(u.id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Team Standup Dashboard</h1>
              <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={() => {
                setShowEntryForm(true);
                setSelectedUser(null);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Add Standup
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('today')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'today'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Today's Standups
            </button>
            <button
              onClick={() => setActiveTab('week')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'week'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'team'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Team Members
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Status Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Today's Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{todayStandups.length}</p>
                  <p className="text-sm text-gray-600">Submitted</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">{getUsersWithoutStandup().length}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                  <p className="text-sm text-gray-600">Team Size</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {todayStandups.filter(s => s.blockers && s.blockers.trim()).length}
                  </p>
                  <p className="text-sm text-gray-600">Blockers</p>
                </div>
              </div>
            </div>

            {/* Missing Standups */}
            {getUsersWithoutStandup().length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-900 mb-2">Pending Standups</h3>
                <div className="flex flex-wrap gap-2">
                  {getUsersWithoutStandup().map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEntryForm(true);
                      }}
                      className="bg-white border border-yellow-300 rounded-full px-3 py-1 text-sm hover:bg-yellow-100 transition-colors"
                    >
                      {user.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Standups List */}
            <StandupList standups={todayStandups} loading={loading} />
          </div>
        )}

        {activeTab === 'week' && (
          <WeekView />
        )}

        {activeTab === 'team' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map(user => (
              <TeamMember 
                key={user.id} 
                user={user}
                hasSubmittedToday={todayStandups.some(s => s.user_id === user.id)}
                onAddStandup={() => {
                  setSelectedUser(user);
                  setShowEntryForm(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {/* Standup Entry Modal */}
      {showEntryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <StandupEntry
              users={users}
              selectedUser={selectedUser}
              onSubmit={handleStandupSubmit}
              onClose={() => {
                setShowEntryForm(false);
                setSelectedUser(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;