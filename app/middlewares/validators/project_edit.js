const Validator = require('./Validator');
const {pick} = require('lodash');

module.exports = (req, res, next) => {
  let rules = {
    id: 'required|project_exist',
    name: 'required|string|min:2',
    desc: 'string',
    start: 'required|date|my_date',
    finish: 'required|date|my_date'
  };

  let is_owner = req._user.roles.indexOf('owner') !== -1;

  if (is_owner) {
    rules.user_id = 'integer|min:1|user_exist';
  }

  if (!is_owner && typeof req.body.user_id !== 'undefined') {
    return res.status(403).send('You have no permission to change project PM');
  }

  const validate = new Validator(req.body, rules);

  validate.passes(() => {
    req._vars = pick(req.body, ['id', 'name', 'desc', 'start', 'finish']);
    if (is_owner && typeof req.body.user_id !== 'undefined') {
      req._vars.user_id = req.body.user_id;
    }
    next();
  });
  validate.fails(() => res.status(422).send(validate.errors));
};
