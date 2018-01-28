'use strict';

module.exports = function (Definition) {

  Definition.prototype.execute = function (data, options, cb) {
    const Instance = Definition.app.models.Instance;
    const engineFactory = Definition.app.engineFactory;
    const self = this;
    return Instance.create({
      definitionName: self.name,
      definitionId: self.id,
      variables: data,
      status: 'starting'
    })
      .then((instance) => {
        const engine = engineFactory.newEngine({
          source: self.xmlData,
          name: instance.id
        });

        engineFactory.execute(engine,{
          variables: data
        });

        return instance;
      })
      .catch((err) => {
        throw err;
      });
  };

  var executeOptions = {
    description: 'Execute a bpmn process',
    accessType: 'WRITE',
    accepts: [
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

  Definition.remoteMethod('prototype.execute', executeOptions);

}