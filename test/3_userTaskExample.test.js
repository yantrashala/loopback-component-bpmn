const request = require('supertest');
const app = require('./fixtures/loopback-app');

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();



describe('userTaskExample BPMN', () => {

  var instanceID;

  it('should execute userTaskExample bpm', function () {
    return request(app)
      .post('/api/definitions/userTaskExample/execute')
      .then(function (res) {
        instanceID = res.body.id;
        console.log('instanceID', instanceID);
        expect(res.status).to.equal(200);
      });
  });

  it('should finish userTaskExample bpm', function () {
    return request(app)
      .get('/api/instances/' + instanceID)
      .then(function (res2) {
        console.log('res2.body.status', res2.body);
        expect(res2.body.status).to.equal('running');
      });
  });

});