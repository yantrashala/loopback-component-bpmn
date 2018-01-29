'use strict';

const Bpmn = require('bpmn-engine');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');


const processXml2 = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.11.2">
<bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>SequenceFlow_1ey0m0l</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:exclusiveGateway id="ExclusiveGateway_1lv8z14" default="SequenceFlow_0zop5ho">
      <bpmn:incoming>SequenceFlow_1ey0m0l</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1v2h9yp</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_0zop5ho</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="SequenceFlow_1ey0m0l" sourceRef="StartEvent_1" targetRef="ExclusiveGateway_1lv8z14" />
    <bpmn:endEvent id="EndEvent_0m9w5af">
      <bpmn:incoming>SequenceFlow_1qdkr7l</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:task id="Task_1" name="Task 1">
      <bpmn:incoming>SequenceFlow_1v2h9yp</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0jr50hz</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="SequenceFlow_1v2h9yp" sourceRef="ExclusiveGateway_1lv8z14" targetRef="Task_1">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[x > 100]]></bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:endEvent id="EndEvent_12iakki">
      <bpmn:incoming>SequenceFlow_0jr50hz</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0jr50hz" sourceRef="Task_1" targetRef="EndEvent_12iakki" />
    <bpmn:task id="Task_2" name="Task 2">
      <bpmn:incoming>SequenceFlow_0zop5ho</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1qdkr7l</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="SequenceFlow_0zop5ho" sourceRef="ExclusiveGateway_1lv8z14" targetRef="Task_2" />
    <bpmn:sequenceFlow id="SequenceFlow_1qdkr7l" sourceRef="Task_2" targetRef="EndEvent_0m9w5af" />
  </bpmn:process>
</bpmn:definitions>
`;

const xml = fs.readFileSync('/media/sf_Shared_VM/Buddy Recruitment.bpmn');


const id = Math.floor(Math.random() * 10000);
const engine = new Bpmn.Engine({
  name: 'execution example',
  source: xml,
  moddleOptions: {
    camunda: require('camunda-bpmn-moddle/resources/camunda'),
  },
});

var listener = new EventEmitter();

listener.on('start', (task, instance) => {
  console.log('start', task.id);
});
listener.on('leave', (task, instance) => {
  console.log('leave', task.id);
  //console.log(`${task.type} <${task.id}> of ${instance.id} is leave`);
});

engine.execute({
  variables: {
    x: 100,
    flag: false,
  },
  listener: listener,
}, (err, definition) => {
  console.log(err);
  console.log('Bpmn definition definition started with id', definition.getProcesses()[0].id);
});

engine.on('end', () => {
  console.log('resumed instance completed');
});
