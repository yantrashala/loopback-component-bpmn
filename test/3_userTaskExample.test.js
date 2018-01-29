const request = require('supertest');
const app = require('./fixtures/loopback-app');

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();



describe('BasicExample BPMN', () => {

  let instanceID;

  it('should execute userTaskExample bpm', function () {
    return request(app)
      .post('/api/instances/execute?id=userTaskExample')
      .then(function (res) {
        instanceID = res.body.id;
        expect(res.status).to.equal(200);
      });
  });

  it('should finish basicExample bpm', function () {
    return request(app)
      .get('/api/instances/' + instanceID)
      .then(function (res2) {
        expect(res2.body.status).to.equal('running');
      });
  });

});