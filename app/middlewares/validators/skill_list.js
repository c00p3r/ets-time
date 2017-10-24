'use strict';
const Validator = require('./Validator');
const _ = require('lodash');

module.exports = (req, res, next) => {
  const rules = {
    user_id: 'exist:users'
  };

  const validate = new Validator(req.params, rules);

  validate.passes(() => {
    req._user_id = req.params.user_id || 0;
    next();
  });
  validate.fails(() => res.status(404).send(validate.errors));
};
