const assert = require('assert');
const app = require('./../app');
const agent = require('supertest').agent(app);
const knex = require('../app/libs/knex');
const jwt = require('jsonwebtoken');
const env = require('./../app/config');
const async = require('async');

const urls = {
    users: '/api/v1/users'
};

let token_owner = jwt.sign({id: 1}, env.secret);
let token_member = jwt.sign({id: 3}, env.secret);

const createCredentials = [
    [
        {
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '0',
            password: 'password'
        },
        400,
        'First name not exist'
    ],
    [
        {
            first_name: 'n',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '0',
            password: 'password'
        },
        400,
        'First name length must be greater then 1'
    ],
    [
        {
            first_name: 'newuser_first_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '0',
            password: 'password'
        },
        400,
        'Last name not exist'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'n',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '0',
            password: 'password'
        },
        400,
        'Last name length must be greater then 1'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '0',
            password: 'password'
        },
        400,
        'Email not exist'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '0',
            password: 'password'
        },
        400,
        'Invalid email'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'owner-pm@tmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '0',
            password: 'password'
        },
        400,
        'Invalid email'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '0'
        },
        400,
        'Password is required'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '0',
            password: "!@#&()–[{}]:;',?/*"
        },
        400,
        'Password must be alpha numeric'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '0',
            password: 'pass'
        },
        400,
        'Password length must be greater than 4'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            password: 'password'
        },
        400,
        'Rate not exist'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: 'a',
            password: 'password'
        },
        400,
        'Rate must be a number'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['nodejs'],
            rate: '-10',
            password: 'password'
        },
        400,
        'Rate length must be greater than 0'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            rate: '0',
            password: 'password'
        },
        400,
        'Position not exist'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: 'nodejs',
            rate: '0',
            password: 'password'
        },
        400,
        'Position must be array'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['owner', 'pm'],
            position: ['node', 'andrd'],
            rate: '0',
            password: 'password'
        },
        400,
        'Position is invalid'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            position: ['nodejs'],
            rate: '0',
            password: 'password'
        },
        400,
        'Roles is not exist'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: 'owner',
            position: ['nodejs'],
            rate: '0',
            password: 'password'
        },
        400,
        'Roles must be array'
    ],
    [
        {
            first_name: 'newuser_first_name',
            last_name: 'newuser_last_name',
            email: 'newusererror@gmail.com',
            roles: ['own', 'p'],
            position: ['nodejs'],
            rate: '0',
            password: 'password'
        },
        400,
        'Roles is invalid'
    ]
];

const updateCredentials = [
    [
        {
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            roles: ['owner', 'pm'],
            position: ['other'],
            rate: 8,
            locked: 0
        },
        400,
        'Id not exist'
    ],
    [
        {
            id: 100,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            roles: ['owner', 'pm'],
            position: ['other'],
            rate: 8,
            locked: 0
        },
        400,
        'Id not found'
    ],
    [
        {
            id: 2,
            last_name: 'update_error_pm_last_name',
            roles: ['owner', 'pm'],
            position: ['other'],
            rate: 8,
            locked: 0
        },
        400,
        'First name not exist'
    ],
    [
        {
            id: 2,
            first_name: 'u',
            last_name: 'update_error_pm_last_name',
            roles: ['owner', 'pm'],
            position: ['other'],
            rate: 8,
            locked: 0
        },
        400,
        'First name length must be greater than 1'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            roles: ['owner', 'pm'],
            position: ['other'],
            rate: 8,
            locked: 0
        },
        400,
        'Last name not exist'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'u',
            roles: ['owner', 'pm'],
            position: ['other'],
            rate: 8,
            locked: 0
        },
        400,
        'Last name length must be greater than 1'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: ['other'],
            rate: 8,
            locked: 0
        },
        400,
        'Roles not exist'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: ['other'],
            roles: 'owner,pm',
            rate: 8,
            locked: 0
        },
        400,
        'Roles must be array'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: ['other'],
            roles: ['ownerr', 'pmm'],
            rate: 8,
            locked: 0
        },
        400,
        'Invalid roles'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            roles: ['owner', 'pm'],
            rate: 8,
            locked: 0
        },
        400,
        'Position not exist'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: 'other',
            roles: ['owner', 'pm'],
            rate: 8,
            locked: 0
        },
        400,
        'Position must be array'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: ['otherr'],
            roles: ['owner', 'pm'],
            rate: 8,
            locked: 0
        },
        400,
        'Invalid position'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: ['other'],
            roles: ['owner', 'pm'],
            locked: 0
        },
        400,
        'Rate not exist'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: ['other'],
            roles: ['owner', 'pm'],
            rate: 'a',
            locked: 0
        },
        400,
        'Rate must be numeric'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: ['other'],
            roles: ['owner', 'pm'],
            rate: -1,
            locked: 0
        },
        400,
        'Rate must be at least 0'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: ['other'],
            roles: ['owner', 'pm'],
            rate: 8,
            password: "!@#&()–[{}]:;',?/*",
            locked: 0
        },
        400,
        'Password must be alpha numeric'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: ['other'],
            roles: ['owner', 'pm'],
            rate: 8,
            password: 'pass',
            locked: 0
        },
        400,
        'Password must be at least 5 characters'
    ],
    [
        {
            id: 2,
            first_name: 'update_error_pm_first_name',
            last_name: 'update_error_pm_last_name',
            position: ['other'],
            roles: ['owner', 'pm'],
            rate: 8,
            locked: 2
        },
        400,
        'Invalid locked'
    ]
];

const listCredentials = [
    [{username: 'na'}, 400, 'Username must be at least 3 characters'],
    [{position: 'otherr'}, 400, 'Invalid position'],
    [{role: 'owne'}, 400, 'Invalid role'],
    [{position: 'php, ios'}, 400, 'Invalid position'],
];

describe('User controller', () => {
    before(done => {
        require('./TestCase')(knex, done);
    });

    it('create', done => {
        agent
            .post(urls.users)
            .set('authorization', token_owner)
            .send({
                first_name: 'newuser_first_name',
                last_name: 'newuser_last_name',
                email: 'newuser@gmail.com',
                roles: ['owner', 'pm'],
                position: ['nodejs'],
                rate: '0',
                password: 'password'
            })
            .expect(201, done);
    });

    it('create (without token)', done => {
        agent.post(urls.users).expect(401, done);
    });

    it('create (as member)', done => {
        agent
            .post(urls.users)
            .set('authorization', token_member)
            .send({
                first_name: 'newuser_first_name',
                last_name: 'newuser_last_name',
                email: 'newuser@gmail.com',
                roles: ['owner', 'pm'],
                position: ['nodejs'],
                rate: '0',
                password: 'password'
            })
            .expect(403, done);
    });

    it('create errors', done => {
        async.each(
            createCredentials,
            (item, cb) => {
                agent.post(urls.users).set('authorization', token_owner).send(item[0]).end((err, res) => {
                    if (item[1] === res.statusCode) {
                        cb();
                    } else {
                        cb(new Error(item[2]));
                    }
                });
            },
            err => {
                done(err);
            }
        );
    });

    it('update', done => {
        agent
            .patch(urls.users)
            .set('authorization', token_owner)
            .send({
                id: 2,
                first_name: 'update_pm_first_name',
                last_name: 'update_pm_last_name',
                roles: ['owner', 'pm'],
                position: ['other'],
                rate: 8,
                locked: 0
            })
            .expect(202, done);
    });

    it('update (without token)', done => {
        agent.patch(urls.users).expect(401, done);
    });

    it('update (as member)', done => {
        agent
            .patch(urls.users)
            .set('authorization', token_member)
            .send({
                id: 2,
                first_name: 'update_pm_first_name',
                last_name: 'update_pm_last_name',
                roles: ['owner', 'pm'],
                position: ['other'],
                rate: 8,
                locked: 0
            })
            .expect(403, done);
    });

    it('update errors', done => {
        async.each(
            updateCredentials,
            (item, cb) => {
                agent.patch(urls.users).set('authorization', token_owner).send(item[0]).end((err, res) => {
                    if (item[1] === res.statusCode) {
                        cb();
                    } else {
                        cb(new Error(item[2]));
                    }
                });
            },
            err => {
                done(err);
            }
        );
    });

    it('list', done => {
        agent.get(urls.users).set('authorization', token_owner).end((err, res) => {
            assert.notEqual(null, res.body.count);
            assert.notEqual(null, res.body.data);
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('list (without token)', done => {
        agent.get(urls.users).expect(401, done);
    });

    it('returns a list filtered by positions', done => {
        console.log(done);
        agent.get(urls.users)
            .set('authorization', token_owner)
            .query({
                position: 'php,ios'
            })
            .end((err, res) => {
                assert.equal(200, res.statusCode);

                assert.notEqual(null, res.body.count);
                assert.notEqual(null, res.body.data);

                let wrongItem = false;
                console.log(res.body.data);
                res.body.data.forEach(item => {
                    if (!(item.position === 'php' || item.position === 'ios')) wrongItem = true;
                });
                assert.equal(false, wrongItem);
                done();
            });
    });

    it('list (as member)', done => {
        agent.get(urls.users).set('authorization', token_member).expect(403, done);
    });

    it('list errors', done => {
        async.each(
            listCredentials,
            (item, cb) => {
                agent.get(urls.users).query(item[0]).set('authorization', token_owner).end((err, res) => {
                    if (item[1] === res.statusCode) {
                        cb();
                    } else {
                        cb(new Error(item[2]));
                    }
                });
            },
            err => {
                done(err);
            }
        );
    });
});
