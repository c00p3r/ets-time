const async = require('async');

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
          resolve(
            knex.table('project_activities').insert([
              {
                project_id: projects[Math.floor(Math.random() * projects.length)]['id'], // random array elem
                user_id: members[Math.floor(Math.random() * members.length)]['id'], // random array elem
                start: new Date(2017, 1, 17),
                finish: new Date(2017, 6, 30)
              },
              {
                project_id: projects[Math.floor(Math.random() * projects.length)]['id'], // random array elem
                user_id: members[Math.floor(Math.random() * members.length)]['id'], // random array elem
                start: new Date(2016, 9, 1),
                finish: new Date(2017, 3, 25)
              }
            ])
          );
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
