'use strict';

const path = require('path');

const definitionExt = require('./definition');
const instanceExt = require('./instance');
const taskExt = require('./task');


module.exports = function (app) {
    let Definition = app.loopback.getModelByType('Definition');
    let Instance = app.loopback.getModelByType('Instance');
    let Task = app.loopback.getModelByType('Task');
    
    definitionExt(Definition);
    instanceExt(Instance);
    taskExt(Task);    
}