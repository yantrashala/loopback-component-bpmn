'use strict';
const Bpmn = require('bpmn-engine');
const { EventEmitter } = require('events');
const debug = require('debug')('loopback-component-bpmn');
var stringify = require('json-stringify-safe');

var _app = null;
var Engine = {};
let Definition, Instance, Task;

Engine.init = function (app) {
  _app = app;
  Definition = app.loopback.getModelByType('Definition');
  Instance = app.loopback.getModelByType('Instance');
  Task = app.loopback.getModelByType('Task');

  if (!Definition || !Instance || !Task) {
    throw new Error('Engine Factory Initialization Failed');
  }

  // Adding eventHandler for Task Model
  Task.on('complete', Engine.taskHandler.bind(this, _app));
  debug('Module initialized');
}

Engine.execute = function (options) {
  if (!options) throw new Error('Invalid Options');

  debug('Execute called');
  const engineOptions = {
    source: options.source,
    name: options.name || 'defaultEngine'
  }

  var engine = new Bpmn.Engine(engineOptions);
  engine.on('error', onEngineError.bind(this, engine));
  engine.on('end', onEngineEnd.bind(this, engine));

  const executeOptions = getExecuteOption(engine, options);

  engine.execute(executeOptions, function (err, definition) {
    debug('Execute finished');
  });

  Instance.findOne({
    where: {
      id: engine.name
    }
  })
    .then((instance) => {
      debug('changing instance state to running');
      return instance.updateAttribute('status', 'running');
    });
}

function getExecuteOption(engine, options) {
  const executeOptions = {
    variables: {},
    listener: {}
  }

  if(options && options.variables){
    executeOptions.variables = options.variables;
  }
  

  const listener = new EventEmitter();
  addDebugListener(listener);
  listener.on('wait', onEngineWait.bind(this, engine));
  executeOptions.listener = listener;
  return executeOptions;
}

Engine.taskHandler = function (app, task,data) {
  debug('received task completion event');
  return Instance.findOne({ where: { id: task.formDef.instanceID } })
    .then((instance) => {
      if (!instance) throw new Error('Instance not found')

      const state = instance.state;

      var engine = new Bpmn.Engine({ name: instance.state.name });
      engine.FROMTASKHANDLER = true;
      engine.on('error', onEngineError.bind(this, engine));
      engine.on('end', onEngineEnd.bind(this, engine));

      const executeOptions = getExecuteOption(engine);

      engine.resume(state, executeOptions, function (err, definition) {
        if (err) return onEngineError(engine, err)
        debug('resume finished');
      });
      
      debug('resuming execution for instance id:', instance.id);
      
      process.nextTick(function () { 
        if(data && Object.keys(data).length > 0){
          engine.signal(data);
        }
        else{
          engine.signal(task.name);
        }
      });

      return instance;
    })
    .then((instance) => {
      instance.updateAttributes({
        'status': 'running',
        'state': {}
      })
        .then((instance) => {
          //console.log('instance.state', instance.status, instance.state);
        });
      debug('clearing state from db');
    });
}

function onEngineError(engine, err, eventSource) {
  return Instance.findOne({
    where: {
      id: engine.name
    }
  })
    .then((instance) => {
      return instance.updateAttributes({
        status: 'error',
        errorData: {
          'err': err,
          'eventSource': eventSource
        }
      });
    });
}

function onEngineEnd(engine, err, definition) {

  const pending = engine.getPendingActivities();
  let status =
    pending.definitions[0].state === 'completed' ?
      'finished' : 'pending';

  return Instance.findOne({
    where: {
      id: engine.name
    }
  })
    .then((instance) => {
      debug('engine execution ended');

      // avoid circular reference
      let variables = definition.environment.variables;
      variables = JSON.parse( stringify(variables, null, 2));

      let instanceOutput = {
        variables: variables
      }

      return instance.updateAttributes({'status': status, state:instanceOutput});  
    })
    .finally(() => {
      engine = null;
    });
}

function addDebugListener(listener) {
  listener.on('start', (task, instance) => {
    debug(`${task.type} <${task.id}> start event`);
  });
  listener.on('leave', (task, instance) => {
    debug(`${task.type} <${task.id}> leave event`);
  });
  listener.on('enter', (task, instance) => {
    debug(`${task.type} <${task.id}> enter event`);
  });
  listener.on('cancel', (task, instance) => {
    debug(`${task.type} <${task.id}> cancel event`);
  });
  listener.on('end', (task, instance) => {
    debug(`${task.type} <${task.id}> end event`);
  });
  listener.on('wait', (task, instance) => {
    debug(`${task.type} <${task.id}> wait event`);
  });
}

function onEngineWait(engine, task, process) {
  if (engine.FROMTASKHANDLER) {
    engine.FROMTASKHANDLER = false;
    return;
  }
  let state = JSON.parse(JSON.stringify(engine.getState()));
  engine.stop();
  let _instance;
  return Instance.findOne({
    where: {
      id: engine.name,
    }
  })
    .then((instance) => {
      _instance = instance;
      debug('persisting state to db');
      return instance.updateAttribute('state', state);
    })
    .then(() => {
        return Task.create({
        'name': task.id,
        'description': task.id,
        'assignedTo': 'none',
        'formDef': {
          instanceID: _instance.id,
        },
      });
    });
}

module.exports = Engine;