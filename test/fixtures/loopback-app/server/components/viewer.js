module.exports = function (app, options) {  
    app.use(options.mountPath, function(req, res, next) {
        getDefinitionIds(app)
            .then((definitions)=>{                        
                var data = definitions || {};             
                var render = app.loopback.template(__dirname + '/viewer.ejs');
                var html = render({data:data});
              
                res.status(200).send(html);
            });
    });
}

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
