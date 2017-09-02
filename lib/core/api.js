var Promise=require("bluebird");
var account=require("../controller/manageAccount.js")
var candidate=require("../controller/manageCandidate.js")
var client=require("../controller/manageClient.js")
var job=require("../controller/manageJob.js")
var message=require("../controller/manageMessage.js")
var workgroup=require("../controller/manageWorkgroup.js")
var caching=require("../controller/manageCache.js")


module.exports = function(app) {

//================================================================================== Verify
//==============================================================================================
    
    app.get('/:option/:action/:uuid', function (req, res, next) {
        switch(req.params.option){
            case "account":
                account[req.params.action](req.params.uuid).then(function(results){
                    res.json(results) 
                })
                break;
            case "job":
                job[req.params.action](req.params.uuid).then(function(results){
                    res.json(results) 
                })
                break;
            case "candidate":
                candidate[req.params.action](req.params.uuid).then(function(results){
                    res.json(results) 
                })
                break;
            case "client":
                client[req.params.action](req.params.uuid).then(function(results){
                    res.json(results) 
                })
                break;    
        }
    });
    
    app.get('/cache/:uuid', function (req, res, next) {
        caching.cache(req.params.uuid).then(function(results){
            res.json("done") 
        })
    });
    
    app.get('/c/one/:uuid/:cid', function (req, res, next) {
        candidate.get.one(req.params.uuid,{cid:req.params.cid}).then(function(results){
            res.json(results) 
        })
    });
    
    app.get('/cl/one/:uuid/:clientid', function (req, res, next) {
        client.get.one(req.params.uuid,{clientid:req.params.clientid}).then(function(results){
            res.json(results) 
        })
    });
    
    app.get('/j/one/:uuid/:clientid', function (req, res, next) {
        job.get.one(req.params.uuid,{jid:req.params.clientid}).then(function(results){
            res.json(results) 
        })
    });
    
    /*
    app.all('*',function(req, res) {
        res.redirect('/');  
    });
    
    function valid_api_request(req, res, next) {
        return new Promise(function(resolve,reject){
            account.ipguard(req.headers['x-forwarded-for']||req.connection.remoteAddress).then(function(){
                if (req.isAuthenticated()){
                    return next();
                }else{
                    res.status(500).end();  
                }
            }).catch(function(){
                res.status(500).end();  
            })
        })
    }
    */
};