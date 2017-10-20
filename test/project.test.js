const app = require('./../app');
const knex = require('../app/libs/knex');
const agent = require('supertest').agent(app);
const jwt = require('jsonwebtoken');
const env = require('./../app/config');
const assert = require('assert');

const ADMIN_ID = 1;
const PM_ID = 2;
const MEMBER_ID = 4;

let token_owner = jwt.sign({id: ADMIN_ID}, env.secret);
let token_pm = jwt.sign({id: PM_ID}, env.secret);
let token_member = jwt.sign({id: MEMBER_ID}, env.secret);

describe('Projects controller', () => {
  before(done => {
    require('./TestCase')(knex, done);
  });

  it('returns a list of all projects for admin', done => {
    agent
      .get('/api/v1/projects')
      .set('authorization', token_owner)
      .end((er, res) => {
        assert.equal(200, res.statusCode);
        assert.notEqual(null, res.body);
        assert.notEqual([], res.body);
        done();
      });
  });

  it('returns a list of all projects for particular PM', done => {
    agent
      .get('/api/v1/projects')
      .set('authorization', token_pm)
      .end((er, res) => {
        assert.equal(200, res.statusCode);
        assert.ok(res.body);
        res.body.forEach(item => {
          assert.equal(PM_ID, item.user_id);
        });
        done();
      });
  });

  it('returns 201 status code and new record ID', done => {
    agent
      .post('/api/v1/projects')
      .set('authorization', token_pm)
      .end((er, res) => {
        assert.equal(201, res.statusCode);
        assert.ok(res.body);
        assert.equal(true, res.body.hasOwnProperty('id'));
        done();
      });
  });
});
