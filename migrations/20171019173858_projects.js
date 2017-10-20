exports.up = function (knex, Promise) {
  return knex.schema.createTable('projects', table => {
    table.increments();
    table.string('name').notNullable();
    table.string('description');
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .comment('Project Manager ID');
    table.date('start').notNullable();
    table.date('finish').notNullable();
    table.collate('utf8_general_ci');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('projects');
};
