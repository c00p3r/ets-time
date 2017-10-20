'use strict';
module.exports = {
  validators: {
    line_create: require('./validators/line_create'),
    line_edit: require('./validators/line_edit'),
    line_delete: require('./validators/line_delete'),
    line_list: require('./validators/line_list'),
    line_status: require('./validators/line_status'),
    user_create: require('./validators/user_create'),
    user_list: require('./validators/user_list'),
    user_edit: require('./validators/user_edit'),
    skill_create: require('./validators/skill_create'),
    skill_edit: require('./validators/skill_edit'),
    skill_delete: require('./validators/skill_delete'),
    skill_user_attach: require('./validators/skill_user_attach'),
    skill_list: require('./validators/skill_list'),
    stat_user: require('./validators/stat_user'),
    project_list: require('./validators/project_list'),
    project_create: require('./validators/project_create'),
    project_edit: require('./validators/project_edit'),
  },
  role: require('./role'),
  auth: require('./auth'),
  no_cache: require('./no_cache')
};
