'use strict';


const methodNames = [
  "replaceOrCreate", "patchOrCreate",
  "destroyById",
  "exists", "replaceById", "prototype.patchAttributes",
  "createChangeStream", "replaceById", "upsertWithWhere",
  "updateAll"
];

module.exports = function (Definition) {

  methodNames.forEach(function (name) {
    Definition.disableRemoteMethodByName(name);
  });
}