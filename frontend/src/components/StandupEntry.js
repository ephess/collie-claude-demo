import React, { useState } from 'react';

const StandupEntry = ({ users, selectedUser, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    user_id: selectedUser?.id || '',
    yesterday: '',
    today: '',
    blockers: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.user_id) {
      newErrors.user_id = 'Please select a team member';
    }
    if (!formData.yesterday.trim()) {
      newErrors.yesterday = 'Please describe what you worked on yesterday';
    }
    if (!formData.today.trim()) {
      newErrors.today = 'Please describe what you plan to work on today';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Daily Standup Entry</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Selection */}
        <div>
          <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
            Team Member *
          </label>
          <select
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.user_id ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={selectedUser}
          >
            <option value="">Select a team member</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} - {user.role}
              </option>
            ))}
          </select>
          {errors.user_id && (
            <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
          )}
        </div>

        {/* Yesterday */}
        <div>
          <label htmlFor="yesterday" className="block text-sm font-medium text-gray-700 mb-1">
            What did you work on yesterday? *
          </label>
          <textarea
            id="yesterday"
            name="yesterday"
            rows={3}
            value={formData.yesterday}
            onChange={handleChange}
            placeholder="Describe your accomplishments from yesterday..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.yesterday ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.yesterday && (
            <p className="mt-1 text-sm text-red-600">{errors.yesterday}</p>
          )}
        </div>

        {/* Today */}
        <div>
          <label htmlFor="today" className="block text-sm font-medium text-gray-700 mb-1">
            What will you work on today? *
          </label>
          <textarea
            id="today"
            name="today"
            rows={3}
            value={formData.today}
            onChange={handleChange}
            placeholder="Describe your plans for today..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.today ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.today && (
            <p className="mt-1 text-sm text-red-600">{errors.today}</p>
          )}
        </div>

        {/* Blockers */}
        <div>
          <label htmlFor="blockers" className="block text-sm font-medium text-gray-700 mb-1">
            Any blockers? (Optional)
          </label>
          <textarea
            id="blockers"
            name="blockers"
            rows={2}
            value={formData.blockers}
            onChange={handleChange}
            placeholder="Describe any impediments or issues blocking your progress..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Submit Standup
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StandupEntry;