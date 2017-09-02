var Promise=require("bluebird");
var user=require("../model/user")
var validation = require('./validation.js');

module.exports = {
    get:function(uuid){
        return new Promise(function(resolve,reject){
            var thisuser=new user(uuid)
            thisuser.account.get().then(function(results){
                resolve(results)
            }).catch(function(err){
                reject(err)
            })
        })
    },
    
    edit:function(uuid,info){
        return new Promise(function(resolve,reject){
            validation.check(uuid,info,{contentNotNull:true}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                
                thisuser.log.new({
                    action:"EDIT_ACCOUNT",
                })
                return thisuser.message.new(validatedinfo)
            }).then(function(){
                resolve()
            }).catch(function(err){
                reject(err)
            })
        })
    },
}
