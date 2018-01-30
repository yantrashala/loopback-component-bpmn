'use strict';
const fs = require('fs');
const Bpmn = require('bpmn-engine');
const path = require('path');
const debug = require('debug')('loopback-component-bpmn');

module.exports = function (basePath, app) {

  app.on('booted', function () {
    const files = fs.readdirSync(basePath);
    const Definition = app.loopback.getModelByType('Definition');

    if (Definition) {
      let promiseArray = [];

      files.forEach((file) => {
        debug('Loading data from file', file);
        const xmlData = fs.readFileSync(path.join(basePath, file));
        const engine = new Bpmn.Engine({
          source: xmlData
        });

        promiseArray.push(new Promise(function (resolve) {

          engine.getDefinition((err, firstDefinition) => {
            if (err) {
              console.log('Error loading file=', file);
              return;
            } else {
              Definition.findOrCreate({ where: { id: firstDefinition.id } },
                {
                  id: firstDefinition.id,
                  name: firstDefinition.name || firstDefinition.id,
                  xmlData: xmlData
                })
                .then(() => {
                  debug('Added definition to dataSource', firstDefinition.id);
                  engine.stop();
                  resolve();
                });
            }
          });
        }))

      });
      Promise.all(promiseArray).then(function () {
        app.emit('BPMN_LOADED');
      });
    }
  })
}