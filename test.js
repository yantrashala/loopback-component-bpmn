'use strict';

const Bpmn = require('bpmn-engine');

const processXml = `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="1.11.2">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>SequenceFlow_1pqm1za</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:exclusiveGateway id="ExclusiveGateway_0q6vqtj" default="SequenceFlow_1t0ar2b">
      <bpmn:incoming>SequenceFlow_1pqm1za</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0h1yx4i</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_1t0ar2b</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="SequenceFlow_1pqm1za" sourceRef="StartEvent_1" targetRef="ExclusiveGateway_0q6vqtj" />
    <bpmn:endEvent id="EndEvent_1ssqle1">
      <bpmn:incoming>SequenceFlow_0h1yx4i</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0h1yx4i" sourceRef="ExclusiveGateway_0q6vqtj" targetRef="EndEvent_1ssqle1">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">true</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:endEvent id="EndEvent_1evuxjm">
      <bpmn:incoming>SequenceFlow_1t0ar2b</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1t0ar2b" sourceRef="ExclusiveGateway_0q6vqtj" targetRef="EndEvent_1evuxjm" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="173" y="102" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ExclusiveGateway_0q6vqtj_di" bpmnElement="ExclusiveGateway_0q6vqtj" isMarkerVisible="true">
        <dc:Bounds x="286" y="95" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="311" y="149" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1pqm1za_di" bpmnElement="SequenceFlow_1pqm1za">
        <di:waypoint xsi:type="dc:Point" x="209" y="120" />
        <di:waypoint xsi:type="dc:Point" x="286" y="120" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="247.5" y="99" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_1ssqle1_di" bpmnElement="EndEvent_1ssqle1">
        <dc:Bounds x="501" y="57" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="519" y="97" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0h1yx4i_di" bpmnElement="SequenceFlow_0h1yx4i">
        <di:waypoint xsi:type="dc:Point" x="311" y="95" />
        <di:waypoint xsi:type="dc:Point" x="311" y="75" />
        <di:waypoint xsi:type="dc:Point" x="501" y="75" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="326" y="79" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="EndEvent_1evuxjm_di" bpmnElement="EndEvent_1evuxjm">
        <dc:Bounds x="518" y="188" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="536" y="228" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_1t0ar2b_di" bpmnElement="SequenceFlow_1t0ar2b">
        <di:waypoint xsi:type="dc:Point" x="311" y="145" />
        <di:waypoint xsi:type="dc:Point" x="311" y="206" />
        <di:waypoint xsi:type="dc:Point" x="518" y="206" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="326" y="169.5" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`;

const processXml2 = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
<bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1">
      <bpmn:outgoing>SequenceFlow_1pqm1za</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:exclusiveGateway id="ExclusiveGateway_0q6vqtj" default="SequenceFlow_1t0ar2b">
      <bpmn:incoming>SequenceFlow_1pqm1za</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0h1yx4i</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_1t0ar2b</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="SequenceFlow_1pqm1za" sourceRef="StartEvent_1" targetRef="ExclusiveGateway_0q6vqtj" />
    <bpmn:endEvent id="EndEvent_1ssqle1">
      <bpmn:incoming>SequenceFlow_0h1yx4i</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0h1yx4i" sourceRef="ExclusiveGateway_0q6vqtj" targetRef="EndEvent_1ssqle1">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">true</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:endEvent id="EndEvent_1evuxjm">
      <bpmn:incoming>SequenceFlow_1t0ar2b</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1t0ar2b" sourceRef="ExclusiveGateway_0q6vqtj" targetRef="EndEvent_1evuxjm" />
     </bpmn:process>
    <bpmn:process id="Process_2" isExecutable="true">
    <bpmn:startEvent id="StartEvent_05hnjat">
      <bpmn:outgoing>SequenceFlow_0yw50qi</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:exclusiveGateway id="ExclusiveGateway_0jhumom">
      <bpmn:incoming>SequenceFlow_0yw50qi</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1s8dbh9</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="SequenceFlow_0yw50qi" sourceRef="StartEvent_05hnjat" targetRef="ExclusiveGateway_0jhumom" />
    <bpmn:endEvent id="EndEvent_14mgytw">
      <bpmn:incoming>SequenceFlow_1s8dbh9</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1s8dbh9" sourceRef="ExclusiveGateway_0jhumom" targetRef="EndEvent_14mgytw" />
  </bpmn:process>
</bpmn:definitions>`;



const id = Math.floor(Math.random() * 10000);
const engine = new Bpmn.Engine({
  name: 'execution example',
  source: processXml
});

engine.execute({
  variables: {
    id: id
  }
}, (err, definition) => {
  console.log(err);
  console.log('Bpmn definition definition started with id', definition.getProcesses()[0].id);
});

engine.on('end', () => {
  console.log('resumed instance completed');
});