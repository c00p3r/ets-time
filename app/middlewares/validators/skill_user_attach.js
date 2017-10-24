'use strict';
const Validator = require('./Validator');
const { pick, range } = require('lodash');

module.exports = (req, res, next) => {
  const rules = {
    skill_id: 'required|integer|min:1|exist:skills',
    user_id: 'required|integer|min:1|exist:users',
    value: 'required|in:' + range(0, 11).join()
  };

  const validate = new Validator(req.body, rules);

  validate.passes(() => {
    req._vars = pick(req.body, ['skill_id', 'user_id', 'value']);
    next();
  });
  validate.fails(() => res.status(400).send(validate.errors));
};
