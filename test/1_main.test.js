const request = require('supertest');
const app = require('./fixtures/loopback-app');

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

describe('BPMN Files loaded and server running', () => {

  before(function (done) {
    if (!app.booting)
      done();
    else
      app.on('BPMN_LOADED', done);
  });

  it('should be able to hit loopback api', function () {
    return request(app)
      .get('/')
      .expect(200);
  });

});