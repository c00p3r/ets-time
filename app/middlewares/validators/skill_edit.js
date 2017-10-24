'use strict';
const Validator = require('./Validator');
const knex = require('./../../libs/knex');
const { pick } = require('lodash');

module.exports = (req, res, next) => {
  const rules = {
    id: 'required|integer|min:0|exist:skills',
    name: 'required|min:2',
    desc: 'min:5',
    parent_id: 'required|min:1|exist:skills'
  };

  const validate = new Validator(req.body, rules);

  validate.passes(() => {
    knex('skills')
      .where({ id: req.body.id, parent_id: req.body.parent_id })
      .first()
      .count('* as c')
      .then(count => {
        if (count.c) {
          let vars = pick(req.body, ['name', 'parent_id']);
          if (req.body.desc) {
            vars['desc'] = req.body.desc;
          }
          req._vars = vars;
          next();
        } else {
          res.status(404).end();
        }
      })
      .catch(next);
  });
  validate.fails(() => res.status(400).send(validate.errors));
};
