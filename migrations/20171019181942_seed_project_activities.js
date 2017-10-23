const async = require('async');

const MEMBER_ID = 4;
const PROJECT_ID = 2;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; // [min, max)
}

exports.up = function (knex, Promise) {
  return new Promise((resolve, reject) => {
    async.parallel(
      {
        projects: function (cb) {
          knex
            .table('projects')
            .select('id')
            .then(data => {
              cb(null, data);
            })
            .catch(err => {
              cb(err);
            });
        },
        members: function (cb) {
          knex
            .table('users')
            .select('id')
            .where('roles', 'like', '%member%')
            .then(data => {
              cb(null, data);
            })
            .catch(err => {
              cb(err);
            });
        }
      },
      function (err, results) {
        if (err) throw err;

        let {projects, members} = results;

        if (projects.length > 0 && members.length > 0) {
          let data = [];
          data.push({
            project_id: PROJECT_ID,
            user_id: MEMBER_ID,
            start: new Date(getRandomInt(2015, 2018), getRandomInt(1, 12), getRandomInt(1, 28)),
            finish: new Date(getRandomInt(2015, 2018), getRandomInt(1, 12), getRandomInt(1, 28))
          });
          for (let i = 0; i < 10; i++) {
            data.push({
              project_id: projects[getRandomInt(0, projects.length)]['id'],
              user_id: members[getRandomInt(0, members.length)]['id'],
              start: new Date(getRandomInt(2015, 2018), getRandomInt(1, 12), getRandomInt(1, 28)),
              finish: new Date(getRandomInt(2015, 2018), getRandomInt(1, 12), getRandomInt(1, 28))
            });
          }
          resolve(knex.table('project_activities').insert(data));
        } else {
          reject();
        }
      }
    );
  });
};

exports.down = function (knex, Promise) {
  return knex.table('project_activities').truncate();
};
