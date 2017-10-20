const Validator = require('./Validator');
const {pick} = require('lodash');

module.exports = (req, res, next) => {
  const rules = {
    name: 'required|string|min:2',
    desc: 'string',
    user_id: 'required|integer|min:1|user_exist',
    start: 'required|date|my_date',
    finish: 'required|date|my_date',
  };

  const validate = new Validator(req.body, rules);

  validate.passes(() => {
    req._vars = pick(req.body, ['name', 'desc', 'user_id', 'start', 'finish']);
    next();
  });
  validate.fails(() => res.status(422).send(validate.errors));
};
