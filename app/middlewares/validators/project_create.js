const Validator = require('./Validator');
const {pick} = require('lodash');

module.exports = (req, res, next) => {
  const rules = {
    name: 'required|string|min:2',
    desc: 'string',
    user_id: 'integer|min:1|exist:users',
    start: 'required|date|my_date',
    finish: 'required|date|my_date'
  };

  let is_owner = req._user.roles.indexOf('owner') !== -1;

  if (!is_owner && typeof req.body.user_id !== 'undefined') {
    res.status(403).send('You have no permission to assign project PM');
  }

  const validate = new Validator(req.body, rules);

  validate.passes(() => {
    req._vars = pick(req.body, Object.keys(rules));
    if (is_owner) {
      if (typeof req.body.user_id !== 'undefined') {
        return res.status(422).send('User_id field is required');
      }
      req._vars.user_id = req.body.user_id;
    } else {
      req._vars.user_id = req._user.id;
    }
    next();
  });
  validate.fails(() => res.status(422).send(validate.errors));
};
