const {
  auth: authCtrl,
  users: usersCtrl,
  skills: skillsCtrl,
  lines: linesCtrl,
  dictionaries: dictionariesCtrl,
  stat: statCtrl,
  projects: projectsCtrl,
  project_activities: projectsActivitiesCtrl
} = require('./controllers/index');
const { role, auth, no_cache: nc } = require('./middlewares');

module.exports = app => {
  app.use('/api/v1/auth', nc, authCtrl);
  app.use('/api/v1/lines', nc, auth, linesCtrl);
  app.use('/api/v1/users', nc, auth, role(['owner', 'pm']), usersCtrl);
  app.use('/api/v1/dictionaries', nc, auth, dictionariesCtrl);
  app.use('/api/v1/stat', nc, auth, statCtrl);
  app.use('/api/v1/skills', nc, auth, role(['owner', 'pm']), skillsCtrl);
  app.use('/api/v1/projects', nc, auth, role(['owner', 'pm']), projectsCtrl);
  app.use('/api/v1/project_activities', nc, auth, role(['owner', 'pm']), projectsActivitiesCtrl);
};
