'use strict';
const express = require('express');
const router = express.Router();
const env = require('./../config');
const knex = require('./../libs/knex');
const async = require('async');

router.get('/', (req, res, next) => {
  async.parallel(
    {
      projects: cb => {
        knex('track_lines')
          .pluck('project')
          .distinct()
          .limit(200)
          .orderBy('project', 'asc')
          .orderByRaw('CHAR_LENGTH(project) asc')
          .where('date_task', '>', knex.raw('DATE_SUB(now(), INTERVAL 60 DAY)'))
          .asCallback(cb);
      }
    },
    (err, results) => {
      if (err) return next(err);
      res.json({
        type_works: env.type_works,
        task_status: env.task_status,
        positions: env.positions,
        roles: env.roles,
        projects: results.projects
      });
    }
  );
});

module.exports = router;
