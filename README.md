# Team Standup Dashboard

A simple, clean full-stack application for tracking daily team standups. Built with Node.js/Express backend and React frontend for workshop demonstrations.

## Features

- **Daily Standup Tracking**: Team members can submit their daily updates (yesterday, today, blockers)
- **Team Overview**: See which team members have submitted their standups
- **Week View**: Calendar grid showing standup submission history
- **Clean UI**: Professional design using Tailwind CSS
- **Real-time Updates**: Instantly see new standup submissions
- **Pre-seeded Data**: Comes with 5 team members and 2 weeks of standup history

## Tech Stack

- **Backend**: Node.js, Express, SQLite
- **Frontend**: React (Hooks), Tailwind CSS
- **Database**: SQLite (no configuration needed)

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- OpenAI API key (optional, for AI features)

## Quick Start

### Automated Setup (Recommended)

Run the setup script to install all dependencies and seed the database:

```bash
chmod +x setup.sh
./setup.sh
```

### OpenAI API Key Setup (Optional)

For AI-powered features in the workshop:

1. **Get an OpenAI API key** from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

2. **Configure the API key** in `backend/.env`:
```bash
cd backend
cp .env.example .env
# Edit .env and add your API key
```

### Manual Setup

If you prefer to set up manually:

1. **Install Backend Dependencies**
```bash
cd backend
npm install
npm run seed  # Seeds the database with sample data
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

## Running the Application

You'll need two terminal windows:

### Terminal 1 - Backend Server
```bash
cd backend
npm start
```
The backend will run on http://localhost:3001

### Terminal 2 - Frontend Application
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000 and open automatically in your browser

## Project Structure

```
team-standup-dashboard/
├── backend/
│   ├── server.js           # Express server setup
│   ├── routes/
│   │   ├── standups.js     # Standup CRUD operations
│   │   └── users.js        # User management
│   ├── db/
│   │   ├── database.js     # SQLite connection
│   │   └── seed.js         # Database seeding script
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   ├── components/
│   │   │   ├── TeamMember.js    # User card component
│   │   │   ├── StandupEntry.js  # Standup form component
│   │   │   ├── StandupList.js   # Today's standups list
│   │   │   └── WeekView.js      # Weekly calendar view
│   │   ├── index.js
│   │   └── index.css       # Tailwind CSS imports
│   ├── tailwind.config.js
│   └── package.json
├── setup.sh                # Automated setup script
├── .gitignore
└── README.md

```

## API Endpoints

### Users
- `GET /api/users` - Get all team members
- `GET /api/users/:id` - Get specific user

### Standups
- `GET /api/standups` - Get all standups (with optional date filter)
- `GET /api/standups/date/:date` - Get standups for specific date
- `GET /api/standups/week/:startDate` - Get week overview
- `POST /api/standups` - Create/update standup

### Health Check
- `GET /api/health` - Server status

## Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `role` - Job title/role
- `avatar_url` - Profile picture URL

### Standups Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `date` - Standup date (YYYY-MM-DD)
- `yesterday` - What was accomplished yesterday
- `today` - What's planned for today
- `blockers` - Any impediments (optional)
- `created_at` - Timestamp

## Seeded Team Members

The database comes pre-seeded with 5 team members:
1. Alex Chen - Frontend Developer
2. Sarah Kim - Backend Developer
3. Marcus Johnson - DevOps Engineer
4. Emily Rodriguez - QA Engineer
5. David Park - Tech Lead

Each member has ~2 weeks of realistic standup history with varying updates and blockers.

## Development

### Re-seeding Database
To reset and re-seed the database with fresh data:
```bash
cd backend
npm run seed
```

### Backend Development Mode
For auto-restart on file changes:
```bash
cd backend
npm run dev  # Uses nodemon
```

## Workshop Enhancement Ideas

This application is designed as a starting point for live coding demonstrations. Some enhancement ideas:

- Add user authentication
- Implement real-time updates with WebSockets
- Add filtering and search functionality
- Export standups to CSV/PDF
- Add team metrics and analytics
- Implement email notifications
- Add dark mode toggle
- Create mobile-responsive improvements
- Add rich text editor for standup entries
- Implement standup templates

## Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are already in use:
- Backend: Change port in `backend/server.js`
- Frontend: React will prompt to use a different port

### Database Issues
If you encounter database errors:
```bash
cd backend
rm db/standup.db  # Remove existing database
npm run seed      # Create fresh database
```

### CORS Issues
CORS is pre-configured, but if you encounter issues:
- Ensure backend is running on port 3001
- Check that frontend API_URL is set to `http://localhost:3001/api`

## License

MIT - Feel free to use for workshops, demos, and learning!