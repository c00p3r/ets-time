'use strict';
const Validator = require('./Validator');
const moment = require('moment');
const { getDatesInMounth } = require('./../../helpers');

module.exports = (req, res, next) => {
  const rules = {
    user_id: 'required|integer|min:1|exist:users',
    month: 'regex:/^\\d{4}-\\d{2}-01$/|my_date'
  };

  let params = {
    user_id: req.params.user_id,
    month: req.query.month
  };

  const validate = new Validator(params, rules);
  validate.passes(() => {
    req.query.month = req.query.month ? moment(req.query.month).format('YYYY-MM') : moment().format('YYYY-MM');
    req.month_days = getDatesInMounth(req.query.month);
    next();
  });
  validate.fails(() => res.status(400).send(validate.errors));
};
