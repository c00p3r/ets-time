'use strict';
const express = require('express');
const router = express.Router();
const {validators: {users_list, user_create, user_edit}} = require('./../middlewares/index');
const knex = require('./../libs/knex');
// const _ = require('lodash');
const async = require('async');

// username, position, role
const criteriaForList = function (p) {
    return function () {
        console.log(p);
        if (p.username) {
            this.where('first_name', 'like', '%' + p.username + '%').orWhere('last_name', 'like', '%' + p.username + '%');
        }
        if (p.position) {
            this.whereIn('position', p.position.split(','));
        }
        if (p.role) {
            this.where('roles', 'like', '%' + p.role + '%');
        }
    };
};

/* Create user */
router.post('/', user_create, (req, res, next) => {
    knex('users').insert(req._vars).then(() => res.status(201).send()).catch(next);
});

/* Update user */
router.patch('/', user_edit, (req, res, next) => {
    knex('users').where({id: req._vars.id}).update(req._vars).then(() => res.status(202).send()).catch(next);
});

/* GET users listing. */
router.get('/', users_list, async (req, res) => {
    let param = req.query;

    async.parallel(
        {
            count: callback => {
                knex('users')
                    .where(criteriaForList(param))
                    .first()
                    .count('* as c')
                    .asCallback(callback)
            },
            list: callback => {
                knex('users')
                    .select('first_name', 'last_name', 'roles', 'position', 'email', 'rate', 'id', 'locked')
                    .where(criteriaForList(param))
                    .orderBy('locked', 'asc')
                    .orderBy('first_name', 'asc')
                    .asCallback(callback);
            }
        },
        (err, results) => {
            if (err) {
                res.status(400).end();
            }
            if (results) {
                res.json({
                    count: results.count.c,
                    data: results.list
                });
            }
        }
    );
});

module.exports = router;
