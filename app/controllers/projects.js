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
    .then(result => res.status(201).send({id: result[0]}))
    .catch(next);
});

module.exports = router;
