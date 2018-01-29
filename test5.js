'use strict';

const Bpmn = require('../bpmn-engine');
const EventEmitter = require('events').EventEmitter;

const processXml = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions id="test" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <process id="theProcess" isExecutable="true">
    <startEvent id="theStart" />
    <userTask id="userTask22" />
    <endEvent id="theEnd" />
    <sequenceFlow id="flow1" sourceRef="theStart" targetRef="userTask22" />
    <sequenceFlow id="flow2" sourceRef="userTask22" targetRef="theEnd" />
  </process>
</definitions>`;

const engine = new Bpmn.Engine({
  source: processXml,
  name: 'testtt'
});
const listener = new EventEmitter();

let state;
listener.on('start', (task, instance) => {
  console.log(`${task.type} <${task.id}> of ${instance.id} is start`);
});
listener.on('leave', (task, instance) => {
  console.log(`${task.type} <${task.id}> of ${instance.id} is leave`);
});
listener.on('enter', (task) => {
  console.log(`${task.type} <${task.id}> of ${instance.id} is enter`);
});
listener.on('cancel', (task, instance) => {
  console.log(`${task.type} <${task.id}> of ${instance.id} is cancel`);
});
listener.on('end', (task, instance) => {
  console.log(`${task.type} <${task.id}> of  is end`);
});
listener.once('wait', (task, instance) => {
  console.log(`${task.type} <${task.id}> of ${instance.id} is wait`);
  state = JSON.stringify(engine.getState());
  //engine.stop();
});

engine.on('end', (err, definition) => {
  console.log('engine ended');
});

engine.execute({
  variables: {
    executionId: 'some-random-id',
  },
  listener: listener,
}, (err, execution) => {
  if (err) throw err;
});

let engine2;
setTimeout(function () {
  //console.log('state', state);
  engine2 = Bpmn.Engine.resume(JSON.parse(state), {
    variables: {
      executionId: 'some-random-id',
    },
    listener: listener,
  });

  engine2.on('end', () => {
    console.log('resumed instance completed');
  });
}, 2000);

setTimeout(function () {
  engine2.signal('userTask22', 'custom message');
}, 5000);