const request = require('supertest');
const app = require('./fixtures/loopback-app');

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();



describe('BasicExample BPMN', () => {

  let instanceID;

  it('should execute basicExample bpm', function () {
    return request(app)
      .post('/api/definitions/basicExample/execute')
      .then(function (res) {
        instanceID = res.body.id;
        expect(res.status).to.equal(200);
      });
  });

  it('should finish basicExample bpm', function () {
    return request(app)
      .get('/api/instances/' + instanceID)
      .then(function (res2) {
        expect(res2.body.status).to.equal('finished');
      });
  });

  it('should execute basicExample bpm with variables', function () {
    return request(app)
      .post('/api/definitions/basicExample/execute')
      .set('Content-Type', 'application/json')
      .send('{"somedata":"test"}')
      .then(function (res) {
        instanceID = res.body.id;
        expect(res.status).to.equal(200);
      });
  });

  it('should finish basicExample bpm with variables', function (done) {

    function delayedExecution(cb) {
      request(app)
        .get('/api/instances/' + instanceID)
        .then(function (res2) {
          expect(res2.body.status).to.equal('finished');
          expect(res2.body.variables.somedata).to.equal('test');
          cb();
        })
        .catch(err => {
          cb(err);
        });
    }

    setTimeout(delayedExecution, 10, done);
  });
});