var Promise=require("bluebird");
var user=require("../model/user")
var validation = require('./validation.js');

module.exports = {
    new:function(uuid,info){
        return new Promise(function(resolve,reject){
            var id=shortid.generate()
            validation.check(uuid,info,{includes:["note"]}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                validatedinfo.fieldid=id
                
                thisuser.log.new({
                    action:"NEW_REMINDER",
                    value:id,
                })
                return thisuser.account.reminder.new(validatedinfo)
            }).then(function(){
                resolve(id)
            }).catch(function(err){
                reject(err)
            })
        })
    },
    
    edit:function(uuid,info){
        return new Promise(function(resolve,reject){
            validation.check(uuid,info,{includes:["fieldid"]}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                
                thisuser.log.new({
                    action:"EDIT_REMINDER",
                })
                return thisuser.account.reminder.edit(validatedinfo)
            }).then(function(){
                resolve()
            }).catch(function(err){
                reject(err)
            })
        })
    },
    
    delete:function(uuid,info){
        return new Promise(function(resolve,reject){
            validation.check(uuid,info,{onlyHave:["fieldid"]}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                
                thisuser.log.new({
                    action:"DELETE_REMINDER",
                })
                return thisuser.account.reminder.delete(validatedinfo)
            }).then(function(){
                resolve()
            }).catch(function(err){
                reject(err)
            })
        })
    },
}
