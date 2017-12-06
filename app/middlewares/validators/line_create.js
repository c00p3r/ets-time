'use strict';
const Validator = require('./Validator');
const env = require('./../../config');
const { pick } = require('lodash');

module.exports = (req, res, next) => {
  const rules = {
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
    let vars = pick(req.body, ['project', 'task', 'type_work', 'hours', 'date_task']);
    vars.user_id = req._user.id;
    vars.created_at = new Date();
    req._vars = vars;
    next();
  }
};
