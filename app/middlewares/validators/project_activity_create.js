const Validator = require('./Validator');
const {pick} = require('lodash');

module.exports = (req, res, next) => {
  const rules = {
    project_id: 'integer|min:1|exist:projects',
    user_id: 'integer|min:1|exist:users',
    involvement: 'integer|min:1|max:8',
    start: 'required|date|my_date',
    finish: 'required|date|my_date'
  };

  const validate = new Validator(req.body, rules);

  validate.passes(() => {
    req._vars = pick(req.body, Object.keys(rules));
    next();
  });
  validate.fails(() => res.status(422).send(validate.errors));
};
