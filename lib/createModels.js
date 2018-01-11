module.exports = (app, config) => {
	//Workflow Definition
	app.createModel(
	  'WorkflowDefinition',
	  {
	    "name": {
	      "type": "string",
	      "required": true
	    },
	    "xmldata": {
	      "type": "string",
	      "required": false
	    },
	    "participants": {
	      "type": "object",
	      "required": false
	    }
	  }
	);

	//Workflow Instance
	app.createModel(
	  'WorkflowInstance',
	  {
	    "workflowDefinitionName": {
	      "type": "string",
	      "required": true
	    },
	    "workflowDefinitionId": {
	      "type": "string",
	      "required": true
	    },
	    "processVariables": {
	      "type": "object",
	      "required": false
	    },
	    "message": {
	      "type": "object",
	      "required": false
	    },
	    "currentStatus": {
	      "type": "object",
	      "required": false
	    },
	    "statusChanges": {
	      "type": "array",
	      "required": false
	    }
	  }
	);	

	// Workflow Signal is triggered when workflow needs to be communicate
	app.createModel(
	  'WorkflowSignal',
	   {
	      "signalRef": {
	      "type": "string",
	      "index": true,
	      "required": true
	    },
	    "tokenId": {
	      "type" : "string",
	      "required" : true
	    }
	  }
	);

		
}