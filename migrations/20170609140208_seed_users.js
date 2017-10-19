const bcrypt = require('bcrypt-nodejs');
const salt = bcrypt.genSaltSync(10);

exports.up = knex => {
  return knex.table('users').insert([
    {
      email: 'owner@mail.com',
      first_name: 'Owner',
      last_name: 'Owner',
      password: bcrypt.hashSync('password', salt),
      position: 'default',
      roles: 'owner',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'pm@mail.com',
      first_name: 'Pm',
      last_name: 'Pm',
      password: bcrypt.hashSync('password', salt),
      position: 'default',
      roles: 'pm',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'member@mail.com',
      first_name: 'Member',
      last_name: 'Member',
      password: bcrypt.hashSync('password', salt),
      position: 'nodejs,php',
      roles: 'member',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'user1@mail.com',
      first_name: 'John',
      last_name: 'Doe',
      password: bcrypt.hashSync('password', salt),
      position: 'php,python',
      roles: 'member',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      email: 'user2@mail.com',
      first_name: 'Billy',
      last_name: 'Bones',
      password: bcrypt.hashSync('password', salt),
      position: 'ios',
      roles: 'member',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};

exports.down = knex => {
  return knex('users').truncate();
};
