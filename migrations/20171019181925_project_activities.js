exports.up = function (knex, Promise) {
  return knex.schema.createTable('project_activities', table => {
    table.increments();
    table
      .integer('project_id')
      .unsigned()
      .notNullable()
      .comment('Project ID');
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .comment('Project member ID');
    table.date('start');
    table.date('finish');
    table.collate('utf8_general_ci');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('project_activities');
};
