const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'standup.db');
const db = new sqlite3.Database(dbPath);

// Team members data
const users = [
  { name: 'Alex Chen', role: 'Frontend Developer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { name: 'Sarah Kim', role: 'Backend Developer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  { name: 'Marcus Johnson', role: 'DevOps Engineer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
  { name: 'Emily Rodriguez', role: 'QA Engineer', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily' },
  { name: 'David Park', role: 'Tech Lead', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' }
];

// Standup templates for realistic data
const standupTemplates = {
  'Frontend Developer': {
    yesterday: [
      'Implemented user authentication flow',
      'Fixed responsive layout issues on mobile',
      'Reviewed PRs for the dashboard component',
      'Updated component library documentation',
      'Completed user profile page',
      'Integrated new API endpoints',
      'Fixed CSS grid issues in Safari'
    ],
    today: [
      'Working on form validation',
      'Implementing dark mode toggle',
      'Refactoring navigation component',
      'Adding unit tests for new features',
      'Meeting with design team for new mockups',
      'Optimizing bundle size',
      'Implementing accessibility improvements'
    ],
    blockers: [
      '',
      'Waiting for API documentation',
      'Need design clarification on mobile view',
      '',
      'Blocked by CORS issues',
      '',
      'Need access to staging environment'
    ]
  },
  'Backend Developer': {
    yesterday: [
      'Optimized database queries',
      'Implemented new REST endpoints',
      'Fixed authentication middleware bug',
      'Updated API documentation',
      'Deployed hotfix to production',
      'Reviewed database migration scripts',
      'Implemented caching layer'
    ],
    today: [
      'Working on payment integration',
      'Setting up monitoring alerts',
      'Implementing rate limiting',
      'Writing integration tests',
      'Reviewing security audit findings',
      'Optimizing API response times',
      'Updating dependency versions'
    ],
    blockers: [
      '',
      'Waiting for third-party API credentials',
      '',
      'Database migration pending approval',
      '',
      'Need clarification on business logic',
      ''
    ]
  },
  'DevOps Engineer': {
    yesterday: [
      'Set up CI/CD pipeline',
      'Configured monitoring dashboards',
      'Updated Docker containers',
      'Resolved production incident',
      'Implemented backup automation',
      'Updated SSL certificates',
      'Optimized cloud resources'
    ],
    today: [
      'Working on Kubernetes migration',
      'Setting up log aggregation',
      'Implementing disaster recovery plan',
      'Updating deployment scripts',
      'Configuring auto-scaling policies',
      'Security patches installation',
      'Infrastructure cost optimization'
    ],
    blockers: [
      '',
      'Waiting for AWS quota increase',
      '',
      'Need approval for infrastructure changes',
      '',
      '',
      'Vendor support ticket pending'
    ]
  },
  'QA Engineer': {
    yesterday: [
      'Executed regression test suite',
      'Filed 5 bug reports',
      'Updated test documentation',
      'Automated login test scenarios',
      'Performed mobile app testing',
      'Reviewed test coverage metrics',
      'Validated production deployment'
    ],
    today: [
      'Testing new feature branch',
      'Writing E2E test scenarios',
      'Performance testing preparation',
      'Updating test data sets',
      'Cross-browser compatibility testing',
      'API testing for new endpoints',
      'Security testing for auth flow'
    ],
    blockers: [
      '',
      'Test environment is down',
      'Need test data refresh',
      '',
      'Waiting for bug fixes to retest',
      '',
      ''
    ]
  },
  'Tech Lead': {
    yesterday: [
      'Conducted architecture review',
      'Led sprint planning meeting',
      'Mentored junior developers',
      'Reviewed technical specifications',
      'Met with stakeholders',
      'Code review for critical features',
      'Updated project roadmap'
    ],
    today: [
      'Technical debt prioritization',
      'System design for new feature',
      'Team 1-on-1 meetings',
      'Preparing sprint demo',
      'Reviewing architecture proposals',
      'Incident postmortem meeting',
      'Cross-team collaboration session'
    ],
    blockers: [
      '',
      '',
      'Waiting for budget approval',
      'Need product requirements clarification',
      '',
      'Resource allocation conflicts',
      ''
    ]
  }
};

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const seedDatabase = async () => {
  console.log('🌱 Starting database seed...');
  
  // Clear existing data
  db.serialize(() => {
    db.run('DELETE FROM standups', (err) => {
      if (err) console.log('Note: standups table might not exist yet');
    });
    
    db.run('DELETE FROM users', (err) => {
      if (err) console.log('Note: users table might not exist yet');
    });
    
    // Insert users
    const userStmt = db.prepare('INSERT INTO users (name, role, avatar_url) VALUES (?, ?, ?)');
    users.forEach(user => {
      userStmt.run(user.name, user.role, user.avatar_url);
    });
    userStmt.finalize();
    
    // Generate standups for the last 2 weeks
    const today = new Date();
    const standupStmt = db.prepare(
      'INSERT INTO standups (user_id, date, yesterday, today, blockers, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    // For each day in the last 14 days
    for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      const dateStr = date.toISOString().split('T')[0];
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }
      
      // Each user has a 80% chance of submitting a standup for any given day
      users.forEach((user, index) => {
        if (Math.random() > 0.2) {
          const templates = standupTemplates[user.role];
          const yesterday = getRandomItem(templates.yesterday);
          const todayTask = getRandomItem(templates.today);
          const blockers = getRandomItem(templates.blockers);
          
          // Set created_at to morning of that day (9-10 AM)
          const createdAt = new Date(date);
          createdAt.setHours(9, Math.floor(Math.random() * 60), 0, 0);
          
          standupStmt.run(
            index + 1, // user_id
            dateStr,
            yesterday,
            todayTask,
            blockers,
            createdAt.toISOString()
          );
        }
      });
    }
    
    standupStmt.finalize();
    
    console.log('✅ Database seeded successfully!');
    console.log('📊 Created:');
    console.log(`   - ${users.length} users`);
    console.log('   - ~50 standup entries (2 weeks of data)');
    
    // Display sample data
    db.all('SELECT COUNT(*) as count FROM users', (err, rows) => {
      if (!err) console.log(`   ✓ Total users in database: ${rows[0].count}`);
    });
    
    db.all('SELECT COUNT(*) as count FROM standups', (err, rows) => {
      if (!err) console.log(`   ✓ Total standups in database: ${rows[0].count}`);
    });
    
    db.close();
  });
};

seedDatabase();