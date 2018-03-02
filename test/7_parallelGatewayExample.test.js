const request = require('supertest');
const app = require('./fixtures/loopback-app');

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

describe('Parallel Gateway Example BPMN', () => {

  before(function (done) {
    if (!app.booting)
      done();
    else
      app.on('BPMN_LOADED', done);
  });

  let instanceID;

  it('should execute Parallel Gateway example bpm', function () {
    return request(app)
      .post('/api/instances/execute?id=parallel_gateway')
      .then(function (res) {
        instanceID = res.body.id;
        console.log(instanceID);
        expect(res.status).to.equal(200);
      });
  });

  it('should finish  Parallel Gateway example bpm with all parallel flows', function () {
    return request(app)
      .get('/api/instances/' + instanceID)
      .then(function (res2) {
        expect(res2.body.status).to.equal('finished');
        expect(res2.body.state.variables.taskInput.Task_EatPizza.result).to.equal('pizza');
        expect(res2.body.state.variables.taskInput.Task_EatPasta.result).to.equal('pasta');
        expect(res2.body.state.variables.taskInput.Task_HaveDrink.result).to.equal('drink');
      });
  });

});