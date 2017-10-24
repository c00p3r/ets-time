const express = require('express');
const router = express.Router();
const knex = require('./../libs/knex');
const {
  validators: {project_activity_list, project_activity_create, project_activity_edit}
} = require('./../middlewares/index');

const criteriaForList = function (params) {
  return function () {
    let query = this;

    if (params.user_id) {
      query.where('user_id', params.user_id);
    }
    if (params.project_id) {
      query.where('project_id', params.project_id);
    }
    // if (params.position) {
    //   let positions = params.position.split(',');
    //   query.where(function () {
    //     for (let i = 0; i < positions.length; i++) {
    //       this.orWhere('position', 'like', '%' + positions[i] + '%');
    //     }
    //   });
    // }
  };
};

/**
 * List projects
 * by project ID, by user ID
 */

router.get('/', (req, res, next) => {
  knex('project_activities')
    .where(criteriaForList(req.query))
    .then(rows => {
      res.json(rows);
    })
    .catch(next);
});

/* Create project */
router.post('/', project_activity_create, (req, res, next) => {
  knex('project_activities')
    .insert(req._vars)
    .then(result => res.status(201).end())
    .catch(next);
});

/* Update project */
router.patch('/', project_activity_edit, (req, res, next) => {
  knex('project_activities')
    .where({id: req._vars.id})
    .update(req._vars)
    .then(() => res.status(200).send())
    .catch(next);
});

module.exports = router;
