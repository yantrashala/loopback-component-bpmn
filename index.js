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


  // Add BPMN Viewer routes
  if(config.mountPath){
    app.use(config.mountPath, function(req, res, next) {
        getDefinitionIds(app)
            .then((definitions)=>{                        
                var data = definitions || {};             
                var render = app.loopback.template(__dirname + '/component/viewer.ejs');
                var html = render({data:data});
              
                res.status(200).send(html);
            });
    });
  }  
};

function getDefinitionIds(app){
    return new Promise(function(resolve, reject){
        app.models.Definition.find({ fields : {id:true}}, function(err, result){
            if(err){
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    })  
  }
