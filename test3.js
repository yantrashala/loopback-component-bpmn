const Bpmn = require('bpmn-engine');
const fs = require('fs');

const processXml = `
<?xml version="1.0" encoding="UTF-8"?>
<definitions id="transformer" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <process id="theProcess" isExecutable="true">
    <startEvent id="theStart" />
    <userTask id="userTask" />
    <endEvent id="theEnd" />
    <sequenceFlow id="flow1" sourceRef="theStart" targetRef="userTask" />
    <sequenceFlow id="flow2" sourceRef="userTask" targetRef="theEnd" />
  </process>
</definitions>`;

Bpmn.transformer.transform(processXml, {
  camunda: require('camunda-bpmn-moddle/resources/camunda')
}, (err, def, moddleContext) => {
  //console.log(Bpmn.validation.validateModdleContext(moddleContext));
  fs.writeFileSync('./moddleContext.json', JSON.stringify(moddleContext, null, 2));
  const engine = new Bpmn.Engine({
    moddleContext: moddleContext
  });

  engine.execute((err, instance) => {
    if (err) throw err;

    console.log('Definition started with process', instance.mainProcess.id);
  });
});