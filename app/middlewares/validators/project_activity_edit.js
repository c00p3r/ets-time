const Validator = require('./Validator');
const {pick} = require('lodash');

module.exports = (req, res, next) => {
  let rules = {
    id: 'required|integer|exist:project_activities',
    project_id: 'required|integer|min:1|exist:projects',
    user_id: 'required|integer|min:1|exist:users',
    involvement: 'required|integer|min:1|max:8',
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
