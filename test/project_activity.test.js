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
const PROJECT_ID = 2;

let token_owner = jwt.sign({id: ADMIN_ID}, env.secret);

describe('Projects controller', () => {
  before(done => {
    require('./TestCase')(knex, done);
  });

  it('returns 200 with a list of all project activity by project ID', done => {
    agent
      .get('/api/v1/project_activities')
      .set('authorization', token_owner)
      .query({project_id: PROJECT_ID})
      .end((err, res) => {
        assert.equal(200, res.statusCode);
        assert.ok(res.body);
        res.body.forEach(item => {
          assert.equal(PROJECT_ID, item.project_id);
        });
        done();
      });
  });

  it('returns 200 with a list of all projects activity by user ID (role:member)', done => {
    agent
      .get('/api/v1/project_activities')
      .set('authorization', token_owner)
      .query({user_id: MEMBER_ID})
      .end((err, res) => {
        assert.equal(200, res.statusCode);
        assert.ok(res.body);
        res.body.forEach(item => {
          assert.equal(MEMBER_ID, item.user_id);
        });
        done();
      });
  });

  // it('returns 201 with new record ID after successful project create', done => {
  //   agent
  //     .post('/api/v1/projects')
  //     .set('authorization', token_pm)
  //     .send({
  //       name: 'New Project',
  //       start: moment().format('YYYY-MM-DD'),
  //       finish: moment()
  //         .add(90, 'days')
  //         .format('YYYY-MM-DD')
  //     })
  //     .end((err, res) => {
  //       assert.equal(201, res.statusCode);
  //       assert.ok(res.body);
  //       assert.equal(true, res.body.hasOwnProperty('id'));
  //       done();
  //     });
  // });
  //
  // it('returns 200 after successful project update', done => {
  //   agent
  //     .patch('/api/v1/projects')
  //     .set('authorization', token_pm)
  //     .send({
  //       id: 2,
  //       name: 'Updated Project Name',
  //       start: moment().format('YYYY-MM-DD'),
  //       finish: moment()
  //         .add(90, 'days')
  //         .format('YYYY-MM-DD')
  //     })
  //     .end((err, res) => {
  //       assert.equal(200, res.statusCode);
  //       done();
  //     });
  // });
  //
  // it('returns 403 if user have no permission to change project PM', done => {
  //   agent
  //     .patch('/api/v1/projects')
  //     .set('authorization', token_pm)
  //     .send({
  //       id: 2,
  //       name: 'Updated Project Name',
  //       user_id: PM_ID,
  //       start: moment().format('YYYY-MM-DD'),
  //       finish: moment()
  //         .add(90, 'days')
  //         .format('YYYY-MM-DD')
  //     })
  //     .end((err, res) => {
  //       assert.equal(403, res.statusCode);
  //       done();
  //     });
  // });
  //
  // it('returns 200 after successful project PM update by owner', done => {
  //   agent
  //     .patch('/api/v1/projects')
  //     .set('authorization', token_owner)
  //     .send({
  //       id: 2,
  //       name: 'Updated Project Name',
  //       user_id: PM_ID,
  //       start: moment().format('YYYY-MM-DD'),
  //       finish: moment()
  //         .add(90, 'days')
  //         .format('YYYY-MM-DD')
  //     })
  //     .end((err, res) => {
  //       assert.equal(200, res.statusCode);
  //       done();
  //     });
  // });
});
