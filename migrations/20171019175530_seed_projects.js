exports.up = function (knex, Promise) {
  return new Promise((resolve, reject) => {
    knex
      .table('users')
      .select('id')
      .where('roles', 'like', '%pm%')
      .then(pms => {
        if (pms.length > 0) {
          resolve(
            knex.table('projects').insert([
              {
                name: 'Project One',
                description: 'One Lorem ipsum',
                user_id: pms[Math.floor(Math.random() * pms.length)]['id'], // random array elem
                start: new Date(2017, 1, 17),
                finish: new Date(2017, 6, 30)
              },
              {
                name: 'Project Two',
                description: 'Two Lorem ipsum',
                user_id: pms[Math.floor(Math.random() * pms.length)]['id'], // random array elem
                start: new Date(2016, 9, 1),
                finish: new Date(2017, 3, 25)
              }
            ])
          );
        } else {
          reject();
        }
      });
  });
};

exports.down = function (knex, Promise) {
  return knex.table('projects').truncate();
};
