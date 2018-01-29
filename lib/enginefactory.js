'use strict';
const Bpmn = require('bpmn-engine');
const EventEmitter = require('events').EventEmitter;

var _app = null;
var Engine = {};
let Definition, Instance, Task;

Engine.init = function (app) {
  _app = app;
  Definition = app.loopback.getModelByType('Definition');
  Instance = app.loopback.getModelByType('Instance');
  Task = app.loopback.getModelByType('Task');
  Task.on('complete', Engine.taskHandler);
}

Engine.newEngine = function (options) {
  const engine = new Bpmn.Engine(options);
  return engine;
}

Engine.execute = function (engine, options) {

  options = options || {};
  var listener = new EventEmitter();
  listener.on('start', (task, instance) => {
    console.log(`${task.type} <${task.id}>  is start`);
  });
  listener.on('leave', (task, instance) => {
    console.log(`${task.type} <${task.id}>  is leave`);
  });
  listener.on('enter', (task, instance) => {
    console.log(`${task.type} <${task.id}>  is enter`);
  });
  listener.on('cancel', (task, instance) => {
    console.log(`${task.type} <${task.id}>  is cancel`);
  });
  listener.on('end', (task, instance) => {
    console.log(`${task.type} <${task.id}>  is end`);
  });
  listener.on('wait', (task, process) => {
    console.log(`${task.type} <${task.id}>  is wait`);
    let state = engine.getState();
    engine.stop();
    let _instance;
    Instance.findOne({
      where: {
        id: engine.name,
      }
    })
      .then((instance) => {
        _instance = instance;
        return instance.updateAttribute('state', state);
      })
      .then(() => {
        return _app.models.Task.create({
          'name': task.id,
          'description': task.id,
          'assignedTo': 'none',
          'formDef': {
            instanceID: _instance.id,
          },
        });
      });
  });

  engine.on('error', (err, eventSource) => {
    console.log('err', err, 'eventSource', eventSource);
    Instance.findOne({
      where: {
        id: engine.name
      }
    })
      .then((instance) => {
        return instance.updateAttribute('status', 'error');
      });
  });

  engine.on('end', (err, definition) => {
    console.log('closing engine');
    Instance.findOne({
      where: {
        id: engine.name
      }
    })
      .then((instance) => {
        return instance.updateAttribute('status', 'finished');
      });
  });

  options.listener = listener;

  engine.execute(options, function (err, definition) {
    Instance.findOne({
      where: {
        id: engine.name
      }
    })
      .then((instance) => {
        return instance.updateAttribute('status', 'running');
      });
  });
}

Engine.taskHandler = function (task) {

}
module.exports = Engine;