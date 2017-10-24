'use strict';
const Validator = require('./Validator');
const { pick } = require('lodash');

module.exports = (req, res, next) => {
  const rules = {
    parent_id: 'required|min:1|exist:skills',
    name: 'required|min:2',
    desc: 'min:5'
  };

  const validate = new Validator(req.body, rules);

  validate.passes(() => {
    let vars = pick(req.body, ['name', 'parent_id']);
    if (req.body.desc) {
      vars['desc'] = req.body.desc;
    }
    req._vars = vars;
    next();
  });
  validate.fails(() => res.status(400).send(validate.errors));
};
