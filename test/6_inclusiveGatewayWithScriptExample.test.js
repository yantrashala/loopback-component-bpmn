const request = require('supertest');
const app = require('./fixtures/loopback-app');

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

describe('Inclusive Gateway with script example BPMN', () => {
  var instanceID;
  
  before(function (done) {
    if (!app.booting)
      done();
    else
      app.on('BPMN_LOADED', done);
  });

 it('should execute Inclusive Gateway  with script Example bpm with data as A', function () {
    return request(app)
      .post('/api/instances/execute?id=inclusive_gateway_with_script')
      .set('Content-Type', 'application/json')
      .send({"data": "A", "result" : ""})
      .then(function (res) {
        instanceID = res.body.id;
        expect(res.status).to.equal(200);
      });
 });

   
it(' Inclusive Gateway  with script should finish engine execution with Path 1', function (done) {

  function delayedExecution(cb) {
    
    request(app)
      .get('/api/instances/' + instanceID)
      .then(function (res2) {
          expect(res2.body.status).to.equal('finished');
          expect(res2.body.state.variables.taskInput.Task_add_A_to_email_list.result).to.equal('Add A');
          should.not.exist(res2.body.state.variables.taskInput.Task_add_B_to_email_list);
          should.not.exist(res2.body.state.variables.taskInput.Task_send_voucher);

        cb();
      })
      .catch(err => {
        cb(err);
      });
  }

  setTimeout(delayedExecution, 1, done);
});

it('should execute Inclusive Gateway  with script Example bpm with data as B', function () {
    return request(app)
      .post('/api/instances/execute?id=inclusive_gateway_with_script')
      .set('Content-Type', 'application/json')
      .send({"data": "B", "result" : ""})
      .then(function (res) {
        instanceID = res.body.id;
        expect(res.status).to.equal(200);
      });
});
  
it(' Inclusive Gateway  with script should finish engine execution with Path 2 and Path 3', function (done) {

  function delayedExecution(cb) {
    
    request(app)
      .get('/api/instances/' + instanceID)
      .then(function (res2) {
          expect(res2.body.status).to.equal('finished');
          expect(res2.body.state.variables.taskInput.Task_add_B_to_email_list.result).to.equal('Add B');
          expect(res2.body.state.variables.taskInput.Task_send_voucher.result).to.equal('Send Voucher');
          should.not.exist(res2.body.state.variables.taskInput.Task_add_A_to_email_list);

        cb();
      })
      .catch(err => {
        cb(err);
      });
  }

   setTimeout(delayedExecution, 1, done);
  });

  
  it('should execute Inclusive Gateway  with script Example bpm with data as CD', function () {
    return request(app)
      .post('/api/instances/execute?id=inclusive_gateway_with_script')
      .set('Content-Type', 'application/json')
      .send({"data": "CD", "result" : ""})
      .then(function (res) {
        instanceID = res.body.id;
        expect(res.status).to.equal(200);
      });
  });

   
it(' Inclusive Gateway  with script should finish engine execution with Path 1', function (done) {

  function delayedExecution(cb) {
    
    request(app)
      .get('/api/instances/' + instanceID)
      .then(function (res2) {
          expect(res2.body.status).to.equal('finished');
          expect(res2.body.state.variables.taskInput.Task_send_voucher.result).to.equal('Send Voucher');
          should.not.exist(res2.body.state.variables.taskInput.Task_add_A_to_email_list);
          should.not.exist(res2.body.state.variables.taskInput.Task_add_B_to_email_list);

        cb();
      })
      .catch(err => {
        cb(err);
      });
  }

  setTimeout(delayedExecution, 1, done);
});

});