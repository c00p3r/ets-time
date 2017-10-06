let config = {
  port: 3000,
  secret: 'ZyXHLWg35z',
  type_works: [
    'Development',
    'Design',
    'Bug fixing',
    'Documentation',
    'Mentoring',
    'Study',
    'Testing',
    'Meeting',
    'Vacation',
    'SickDay',
    'DayOff'
  ],
  task_status: ['Accepted', 'Declined', 'Open'],
  roles: ['owner', 'pm', 'member'],
  positions: ['php', 'nodejs', 'python', 'ios', 'android', 'qa', 'ui/ux', 'fed', 'ba', 'other'],
  db: {
    client: 'mysql',
    connection: {
      host: 'localhost',
      user: 'root',
      password: '1',
      database: 'ets',
        port: '3307'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    pool: {
      min: 1,
      max: 5
    }
  }
};

switch (process.env.NODE_ENV) {
  case 'production':
    config.db.connection.user = process.env.MYSQL_USER;
    config.db.connection.password = process.env.MYSQL_PASS;
    config.db.migrations.directory = process.env.MIGRATION_PATH;
    break;
  case 'testing':
    config.db.connection.user = process.env.MYSQL_USER || 'root';
    config.db.connection.database = process.env.MYSQL_USER ? 'test' : 'ets_test';
    config.db.connection.password = process.env.MYSQL_PASSWORD || '1';
    break;
  default:
    break;
}
module.exports = config;
