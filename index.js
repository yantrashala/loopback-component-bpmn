'use strict';

const path = require('path');

const EngineFactory = require('./lib/enginefactory');
const bpmnLoader = require('./lib/bpmnLoader');

module.exports = function (app, config) {

  // if repoPath is specified than try loading files
  if (config.repoPath) {
    const basePath = path.join(__dirname, config.repoPath);
    bpmnLoader(basePath, app);
  }

  EngineFactory.init(app);
  // Creating a singleton EngineFactory
  app.engineFactory = EngineFactory;
};
