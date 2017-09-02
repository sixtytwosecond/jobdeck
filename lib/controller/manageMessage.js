var Promise=require("bluebird");
var user=require("../model/user")
var validation = require('./validation.js');

module.exports = {
    get:function(uuid){
        return new Promise(function(resolve,reject){
            var thisuser=new user(uuid)
            thisuser.message.get().then(function(results){
                resolve(results)
            }).catch(function(err){
                reject(err)
            })
        })
    },
    
    new:function(uuid,info){
        return new Promise(function(resolve,reject){
            var id=shortid.generate()
            validation.check(uuid,info,{includes:["touuid","message"],contentNotNull:true}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                validatedinfo.mid=id
                
                thisuser.log.new({
                    action:"NEW_MESSAGE",
                    value:validatedinfo.touuid,
                    value1:id
                })
                return thisuser.message.new(validatedinfo)
            }).then(function(){
                resolve(id)
            })
        })
    },
}
