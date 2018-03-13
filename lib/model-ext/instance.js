'use strict';

const methodNames = [
  "replaceOrCreate", "patchOrCreate",
  "destroyById", "create",
  "exists", "replaceById", "prototype.patchAttributes",
  "createChangeStream", "replaceById", "upsertWithWhere",
  "updateAll"
];

module.exports = function (Instance) {

  methodNames.forEach(function (name) {
    Instance.disableRemoteMethodByName(name);
  });


  Instance.execute = function (definitionId, data, options, cb) {
    const Definition =  Instance.app.loopback.getModelByType('Definition');
    const engineFactory = Instance.app.engineFactory;

    let xmlData;
    return Definition.findOne({ where: { id: definitionId } })
      .then((definition) => {
        if (!definition) {
          let error = new Error('Invalid Definition Id');
          error.code = 'INVALID_DEFINITION';
          error.statusCode = 402;
          return cb(error);
        } else {
          xmlData = definition.xmlData;
          return Instance.create({
            definitionName: definition.name,
            definitionId: definition.id,
            variables: data,
            status: 'starting'
          });
        }
      })
      .then((instance) => {

        engineFactory.execute({
          source: xmlData,
          name: instance.id,
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