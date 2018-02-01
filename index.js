'use strict';

const path = require('path');

const EngineFactory = require('./lib/enginefactory');
const bpmnLoader = require('./lib/bpmnLoader');

module.exports = function (app, config) {

  // if repoPath is specified than try loading files
  if (config.repoPath) {
    const basePath = path.resolve(config.repoPath);
    bpmnLoader(basePath, app);
  }

  EngineFactory.init(app);
  // Creating a singleton EngineFactory
  app.engineFactory = EngineFactory;


  // Adding BPMN Viewer routes
  // TODO: adding reactjs page
};
