const request = require('supertest');
const app = require('./fixtures/loopback-app');

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

describe('two_userLaneAndPoolExample BPMN', () => {

  var instanceID;
  var task1ID, task2ID,taskID;

  before(function (done) {
    if (!app.booting)
      done();
    else
      app.on('BPMN_LOADED', done);
  });


  it('should execute userTaskExample bpm', function () {
    return request(app)
      .post('/api/instances/execute?id=poolAndLane')
      .then(function (res) {
        instanceID = res.body.id;
        console.log('instanceID....', instanceID);
        expect(res.status).to.equal(200);
      });
  });

  it('should remain in pending mode', function () {
    return request(app)
      .get('/api/instances/' + instanceID)
      .then(function (res2) {
        //console.log('res2.body.status', res2.body);
        expect(res2.body.status).to.equal('pending');
      });
  });

  it('should have a new task created', function () {
    let filter = {
      where: {
        formDef: { instanceID: instanceID },
        status: 0
      }
    };
    return request(app)
      .get('/api/tasks?filter=' + JSON.stringify(filter))
      .then(function (res2) {
        taskID = res2.body[res2.body.length-1].id;
        console.log('TASK id 1###',taskID);

        expect(res2.body).to.be.an('array');
        //expect(res2.body.length).to.equal(1);
      });
  });

  it('should complete pending user task', function () {
    console.log('TASK id 2###',taskID);
    return request(app)
      .put('/api/tasks/' + taskID + '/complete')
      .then(function (res) {
        expect(res.status).to.equal(204);
      });
  });

  it('should have the task marked as complete', function () {
    return request(app)
      .get('/api/tasks/' + taskID)
      .then(function (res) {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(2);
      });
  });

  it('should have a new task created', function () {
    let filter = {
      where: {
        formDef: { instanceID: instanceID },
        status: 0
      }
    };
    return request(app)
      .get('/api/tasks?filter=' + JSON.stringify(filter))
      .then(function (res2) {
        taskID = res2.body[res2.body.length-1].id;
        expect(res2.body).to.be.an('array');
        //expect(res2.body.length).to.equal(1);
        
      });
  });

  it('should complete pending user task', function () {
    return request(app)
      .put('/api/tasks/' + taskID + '/complete')
      .then(function (res) {
        expect(res.status).to.equal(204);
      });
  });

  it('should finish engine execution', function (done) {

    function delayedExecution(cb) {
      request(app)
        .get('/api/instances/' + instanceID)
        .then(function (res2) {
          expect(res2.body.status).to.equal('finished');
          cb();
        })
        .catch(err => {
          cb(err);
        });
    }

    setTimeout(delayedExecution, 1, done);
  });

});