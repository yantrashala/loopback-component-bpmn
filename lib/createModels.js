module.exports = (app, config) => {

	function createModel(definitionJson, customizeFn) {
	    var Model = app.loopback.createModel(definitionJson);
	    customizeFn(Model);
	    return Model;
	}

	//Workflow Definition
	app.dataSource('db', { connector: 'memory' });
	const WorkflowDefinition = createModel(
	    require('./models/workflowdefinition.json'),
	    require('./models/workflowdefinition.js'));
	const WorkflowInstance = createModel(
	    require('./models/workflowinstance.json'),
	    require('./models/workflowinstance.js'));
	const WorkflowSignal = createModel(
	    require('./models/workflowsignal.json'),
	    require('./models/workflowsignal.js'));
	const WorkflowActivity = createModel(
	    require('./models/workflowactivity.json'),
	    require('./models/workflowactivity.js'));

	WorkflowDefinition.autoAttach = "db";
	WorkflowInstance.autoAttach = "db";
	WorkflowSignal.autoAttach = "db";
	WorkflowActivity.autoAttach = "db";
}