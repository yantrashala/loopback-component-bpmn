'use strict';

const Bpmn = require('bpmn-engine');
const path = require('path');
const fs = require('fs');
const EngineFactory = require('./lib/enginefactory');

module.exports = function (app, config) {

  const basePath = path.join(__dirname, config.repoPath);
  const files = fs.readdirSync(basePath);

  if (app.models.Definition) {
    files.forEach((file) => {
      const xmlData = fs.readFileSync(path.join(basePath, file));
      const engine = new Bpmn.Engine({
        source: xmlData
      });

      engine.getDefinition((err, firstDefinition) => {
        if (err) console.log('Error loading file=', file);
        app.models.Definition.findOrCreate({ where: { id: firstDefinition.id } },
          {
            id: firstDefinition.id,
            name: firstDefinition.name || firstDefinition.id,
            xmlData: xmlData
          })
      });
    });
  }

  EngineFactory.init(app);
  // Creating a singleton EngineFactory
  app.engineFactory = EngineFactory;
};
