const request = require('supertest');
const app = require('./fixtures/loopback-app');

const chai = require('chai'),
  assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

describe('Exclusive gateway example BPMN', () => {

  var instanceID;
  
  before(function (done) {
    if (!app.booting)
      done();
    else
      app.on('BPMN_LOADED', done);
  });


  it('should execute Exclusive gateway bpm with pasta as input', function () {
    return request(app)
      .post('/api/instances/execute?id=exclusive_gateway')
      .set('Content-Type', 'application/json')
      .send({"recipie": "pasta"})
      .then(function (res) {
        instanceID = res.body.id;
        
        expect(res.status).to.equal(200);
      });
  });

  it('should finish engine execution with pasta prepared', function (done) {
    function delayedExecution(cb) {
      request(app)
        .get('/api/instances/' + instanceID)
        .then(function (res2) {
          expect(res2.body.status).to.equal('finished');
          expect(res2.body.state.variables.taskInput.Task_Prepare_Pasta.result).to.equal('pasta prepared');
          should.not.exist(res2.body.state.variables.taskInput.Task_Prepare_Rice);
          should.not.exist(res2.body.state.variables.taskInput.Task_Prepare_Salad);

          cb();
        })
        .catch(err => {
          cb(err);
        });
    }

    setTimeout(delayedExecution, 1, done);
  });

  it('should execute Exclusive gateway bpm with rice as input', function () {
    return request(app)
      .post('/api/instances/execute?id=exclusive_gateway')
      .set('Content-Type', 'application/json')
      .send({"recipie": "rice"})
      .then(function (res) {
        instanceID = res.body.id;
        
        expect(res.status).to.equal(200);
      });
  });

  it('should finish engine execution with rice prepared', function (done) {
    function delayedExecution(cb) {
      request(app)
        .get('/api/instances/' + instanceID)
        .then(function (res2) {
          expect(res2.body.status).to.equal('finished');
          expect(res2.body.state.variables.taskInput.Task_Prepare_Rice.result).to.equal('rice prepared');

          should.not.exist(res2.body.state.variables.taskInput.Task_Prepare_Pasta);
          should.not.exist(res2.body.state.variables.taskInput.Task_Prepare_Salad);

          cb();
        })
        .catch(err => {
          cb(err);
        });
    }

    setTimeout(delayedExecution, 1, done);
  });

  it('should execute Exclusive gateway bpm with salad as input', function () {
    return request(app)
      .post('/api/instances/execute?id=exclusive_gateway')
      .set('Content-Type', 'application/json')
      .send({"recipie": "salad"})
      .then(function (res) {
        instanceID = res.body.id;
        
        expect(res.status).to.equal(200);
      });
  });

  it('should finish engine execution with salad prepared', function (done) {
    function delayedExecution(cb) {
      request(app)
        .get('/api/instances/' + instanceID)
        .then(function (res2) {
          expect(res2.body.status).to.equal('finished');
          expect(res2.body.state.variables.taskInput.Task_Prepare_Salad.result).to.equal('salad prepared');
          should.not.exist(res2.body.state.variables.taskInput.Task_Prepare_Pasta);
          should.not.exist(res2.body.state.variables.taskInput.Task_Prepare_Rice);

          cb();
        })
        .catch(err => {
          cb(err);
        });
    }

    setTimeout(delayedExecution, 1, done);
  });
});