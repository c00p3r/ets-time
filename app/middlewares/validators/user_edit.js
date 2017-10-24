'use strict';
const Validator = require('./Validator');
const env = require('./../../config');
const bcrypt = require('bcrypt-nodejs');
const { pick } = require('lodash');
const salt = bcrypt.genSaltSync();

module.exports = (req, res, next) => {
  const rules = {
    id: 'required|exist:users',
    first_name: 'required|min:2',
    last_name: 'required|min:2',
    position: 'required|array|in:' + env.positions.join(','),
    roles: 'required|array|in:' + env.roles.join(','),
    rate: 'required|numeric|min:0',
    password: 'alpha_num|min:5',
    locked: 'in:0,1'
  };

  const validate = new Validator(req.body, rules);

  validate.passes(() => {
    let vars = pick(req.body, ['id', 'first_name', 'last_name', 'position', 'roles', 'rate', 'locked']);
    vars.roles = vars.roles.join(',');
    vars.position = req.body.position.join(',');
    vars.updated_at = new Date();
    if (req.body.password) {
      vars.password = bcrypt.hashSync(req.body.password, salt);
    }
    req._vars = vars;
    next();
  });
  validate.fails(() => res.status(400).send(validate.errors));
};
