'use strict';
const express = require('express');
const router = express.Router();
const {validators: {user_list, user_create, user_edit}} = require('./../middlewares/index');
const knex = require('./../libs/knex');
const async = require('async');
// const _ = require('lodash');

// username, position, role
const criteriaForList = function (params) {
  return function () {
    let query = this;
    if (params.username) {
      query
        .where('first_name', 'like', '%' + params.username + '%')
        .orWhere('last_name', 'like', '%' + params.username + '%');
    }
    if (params.role) {
      query.where('roles', 'like', '%' + params.role + '%');
    }
    if (params.position) {
      let positions = params.position.split(',');
      query.where(function () {
        for (let i = 0; i < positions.length; i++) {
          this.orWhere('position', 'like', '%' + positions[i] + '%');
        }
      });
    }
  };
};

/* Create user */
router.post('/', user_create, (req, res, next) => {
  knex('users')
    .insert(req._vars)
    .then(() => res.status(201).send())
    .catch(next);
});

/* Update user */
router.patch('/', user_edit, (req, res, next) => {
  knex('users')
    .where({id: req._vars.id})
    .update(req._vars)
    .then(() => res.status(202).send())
    .catch(next);
});

/* GET users listing. */
router.get('/', user_list, async (req, res) => {
  let params = req.query;

  async.parallel(
    {
      count: callback => {
        knex('users')
          .where(criteriaForList(params))
          .count('* as c')
          .first()
          .asCallback(callback);
      },
      list: callback => {
        knex('users')
          .select('first_name', 'last_name', 'roles', 'position', 'email', 'rate', 'id', 'locked')
          .where(criteriaForList(params))
          .orderBy('locked', 'asc')
          .orderBy('first_name', 'asc')
          .asCallback(callback);
      }
    },
    (err, results) => {
      if (err) {
        res.status(400).end();
      }
      if (results) {
        res.json({
          count: results.count.c,
          data: results.list
        });
      }
    }
  );
});

module.exports = router;
