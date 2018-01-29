'use strict';

module.exports = function (Instance) {
  Instance.execute = function (definitionId, data, options, cb) {
    const Definition = Instance.app.models.Definition;
    const engineFactory = Instance.app.engineFactory;

    let xmlData;
    return Definition.findOne({ where: { id: definitionId } })
      .then((definition) => {
        if (!definition) cb('Invalid Definition Id')
        xmlData = definition.xmlData;
        return Instance.create({
          definitionName: definition.name,
          definitionId: definition.id,
          variables: data,
          status: 'starting'
        });
      })
      .then((instance) => {
        const engine = engineFactory.newEngine({
          source: xmlData,
          name: instance.id
        });

        engineFactory.execute(engine, {
          variables: data
        });

        return instance;
      })
      .catch((err) => {
        return cb(err);
      });
  };

  var executeOptions = {
    description: 'Create a new execution Instance of a bpmn definition',
    accessType: 'WRITE',
    accepts: [
      {
        arg: 'id', type: 'any', description: 'Definition id', required: true,
        http: { source: 'query' }
      },
      {
        arg: 'data', type: 'object', model: 'any',
        http: { source: 'body' },
        description: 'An object of variables in name/value pairs',
      },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'Instance', root: true },
    http: [{ verb: 'post', path: '/execute' }],
  };

  Instance.remoteMethod('execute', executeOptions);

}