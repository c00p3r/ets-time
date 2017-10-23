const app = require('./../app');
const knex = require('../app/libs/knex');
const agent = require('supertest').agent(app);
const jwt = require('jsonwebtoken');
const env = require('./../app/config');
const assert = require('assert');
const moment = require('moment');

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

  it('returns 200 with a list of all projects for admin', done => {
    agent
      .get('/api/v1/projects')
      .set('authorization', token_owner)
      .end((err, res) => {
        assert.equal(200, res.statusCode);
        assert.ok(res.body);
        done();
      });
  });

  it('returns 200 with a list of all projects for particular PM', done => {
    agent
      .get('/api/v1/projects')
      .set('authorization', token_pm)
      .end((err, res) => {
        assert.equal(200, res.statusCode);
        assert.ok(res.body);
        res.body.forEach(item => {
          assert.equal(PM_ID, item.user_id);
        });
        done();
      });
  });

  it('returns 201 status code and new record ID after successful project create', done => {
    agent
      .post('/api/v1/projects')
      .set('authorization', token_pm)
      .send({
        name: 'New Project',
        start: moment().format('YYYY-MM-DD'),
        finish: moment()
          .add(90, 'days')
          .format('YYYY-MM-DD')
      })
      .end((err, res) => {
        assert.equal(201, res.statusCode);
        assert.ok(res.body);
        assert.equal(true, res.body.hasOwnProperty('id'));
        done();
      });
  });

  it('returns 200 status code after successful project update', done => {
    agent
      .patch('/api/v1/projects')
      .set('authorization', token_pm)
      .send({
        id: 2,
        name: 'Updated Project Name',
        start: moment().format('YYYY-MM-DD'),
        finish: moment()
          .add(90, 'days')
          .format('YYYY-MM-DD')
      })
      .end((err, res) => {
        assert.equal(200, res.statusCode);
        done();
      });
  });

  it('returns 403 status code if user have no permission to change project PM', done => {
    agent
      .patch('/api/v1/projects')
      .set('authorization', token_pm)
      .send({
        id: 2,
        name: 'Updated Project Name',
        user_id: PM_ID,
        start: moment().format('YYYY-MM-DD'),
        finish: moment()
          .add(90, 'days')
          .format('YYYY-MM-DD')
      })
      .end((err, res) => {
        assert.equal(403, res.statusCode);
        done();
      });
  });

  it('returns 200 status code after successful project PM update by owner', done => {
    agent
      .patch('/api/v1/projects')
      .set('authorization', token_owner)
      .send({
        id: 2,
        name: 'Updated Project Name',
        user_id: PM_ID,
        start: moment().format('YYYY-MM-DD'),
        finish: moment()
          .add(90, 'days')
          .format('YYYY-MM-DD')
      })
      .end((err, res) => {
        assert.equal(200, res.statusCode);
        done();
      });
  });
});
