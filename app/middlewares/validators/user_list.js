'use strict';
const Validator = require('./Validator');
const env = require('./../../config');

module.exports = (req, res, next) => {
  const rules = {
    username: 'string|min:3',
    // position: 'string|in:' + env.positions.join(','),
    position: 'string|position_exist',
    role: 'string|in:' + env.roles.join(',')
  };
  const validate = new Validator(req.query, rules);
  /**
   * Async
   */
  // validate.fails(() => {
  //     res.status(400).send(validate.errors);
  // });
  // validate.passes(() => {
  //     next();
  // });
  /**
   * Sync
   */
  let fails = validate.fails();
  if (fails) {
    return res.status(400).send(validate.errors);
  }
  next();
};
