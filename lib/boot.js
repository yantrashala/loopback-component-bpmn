const createModels = require('./createModels');
const attachWorkFLowUI = require('./attachWorkFLowUI');
module.exports = (app, configs) => {
	//Check if datasource is not available create a mongo Datasource.

	//create models
	createModels(app,configs);

	//check if any workflow is in progress resume it.

	//Add handlers or triggers to update the workflow.

	//Add a page to create workflows.
	attachWorkFLowUI(app);

}