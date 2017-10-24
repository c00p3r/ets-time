const express = require('express');
const router = express.Router();
const knex = require('./../libs/knex');
const {validators: {project_list, project_create, project_edit}} = require('./../middlewares/index');

/* List projects */
router.get('/', (req, res, next) => {
  let query = knex('projects').orderBy('name', 'asc');

  if (req._user.roles.indexOf('owner') === -1) {
    query.where('user_id', req._user.id);
  }
  query
    .then(rows => {
      res.json(rows);
    })
    .catch(next);
});

/* Create project */
router.post('/', project_create, (req, res, next) => {
  knex('projects')
    .insert(req._vars)
    .then(result => {
      // add project activity for PM automatically
      const project_id = result[0];
      const data = {
        project_id: project_id,
        user_id: req._vars.user_id,
        involvement: 8, // default
        start: req._vars.start,
        finish: req._vars.finish
      };
      knex('project_activities')
        .insert(data)
        .then(result => res.status(201).end({id: project_id}))
        .catch(next);
    })
    .catch(next);
});

/* Update project */
router.patch('/', project_edit, (req, res, next) => {
  knex('projects')
    .where({id: req._vars.id})
    .update(req._vars)
    .then(() => res.status(200).send())
    .catch(next);
});

module.exports = router;
