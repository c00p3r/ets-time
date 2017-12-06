'use strict';
const { pick } = require('lodash');
const Validator = require('./Validator');
const env = require('./../../config');
const knex = require('./../../libs/knex');
const hasRole = require('./../../libs/hasRole');

module.exports = (req, res, next) => {
  const rules = {
    id: 'required|integer|min:0',
    project: 'required|min:2|max:60',
    task: 'required|min:3|max:255',
    type_work: 'required|in:' + env.type_works.join(','),
    hours: 'required|numeric|min:0',
    date_task: 'required|regex:/^\\d{4}-\\d{2}-\\d{2}$/|my_date'
  };
  const validate = new Validator(req.body, rules);
  if (validate.fails()) {
    res.status(400).send(validate.errors);
  } else {
    let criteria = { id: req.body.id };

    if (!hasRole(req._user.roles, ['owner', 'pm'])) {
      criteria['user_id'] = req._user.id;
    }

    knex('track_lines')
      .where(criteria)
      .first()
      .count('* as c')
      .then(count => {
        if (count.c) {
          let vars = pick(req.body, ['project', 'task', 'type_work', 'hours', 'date_task']);
          vars.status = 'Open';
          vars.updated_at = new Date();
          req._vars = vars;
          next();
        } else {
          res.status(404).send();
        }
      })
      .catch(next);
  }
};
