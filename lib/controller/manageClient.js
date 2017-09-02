var Promise=require("bluebird");
var user=require("../model/user")
var validation = require('./validation.js');
var caching = require('./manageCache.js');

module.exports = {
    get:{
        all:function(uuid){
            return new Promise(function(resolve,reject){
                var thisuser=new user(uuid)
                thisuser.client.get.all().then(function(results){
                    resolve(results)
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        one:function(uuid,info){
            return new Promise(function(resolve,reject){
                var validatedinfo
                validation.check(uuid,info,{onlyHave:["clientid"],validate:["_clientid"]}).then(function(_validatedinfo){
                    validatedinfo=_validatedinfo
                    return validation.get(uuid,"shared_clientid")
                }).then(function(results){
                    var thisuser=new user(uuid)
                    if(results.hasOwnProperty(validatedinfo.clientid)){
                        validatedinfo.permission=results[validatedinfo.clientid]
                    }
                    
                    return thisuser.client.get.one(validatedinfo)
                }).then(function(results){
                    resolve(results)
                }).catch(function(err){
                    reject(err)
                })
            })
        } 
    },
    
    new:function(uuid,info){
        return new Promise(function(resolve,reject){
            var id=shortid.generate()
            validation.check(uuid,info,{contentNotNull:true}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                validatedinfo.clientid=id
                
                thisuser.log.new({
                    action:"NEW_CLIENT",
                    value:id
                })
                
                caching.add(uuid,"clientid",id)
                return thisuser.client.new(validatedinfo)
            }).then(function(){
                resolve()
            }).catch(function(err){
                reject(err)
            })
        })
    },
    
    add:{
        contact:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{includes:["clientid"],validate:["clientid"],contentNotNull:true}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id
                    
                    thisuser.log.new({
                        action:"NEW_CONTACT",
                        value:validatedinfo.clientid,
                        value1:id
                    })

                    return thisuser.client.add.contact(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        share:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{includes:["clientid","touuid","permission"],validate:["clientid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id
                    
                    thisuser.log.new({
                        action:"SHARE_CLIENT",
                        value:validatedinfo.clientid,
                        value1:validatedinfo.touuid
                    })
                    
                    var permission={}
                    permission[validatedinfo.clientid]=validatedinfo.permission
                    
                    caching.add(validatedinfo.touuid,"_clientid",validatedinfo.clientid)
                    caching.replace(validatedinfo.touuid,"shared_clientid",permission)
                    
                    return thisuser.client.add.share(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
    },
    
    edit:{
        contact:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{includes:["clientid","fieldid"],
                                            validate:["clientid"],contentNotNull:true}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"EDIT_CONTACT",
                        value:validatedinfo.clientid,
                        value1:validatedinfo.fieldid
                    })

                    return thisuser.client.edit(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        share:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{includes:["clientid","touuid"],validate:["clientid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"SHARE_CLIENT",
                        value:validatedinfo.clientid,
                        value1:validatedinfo.touuid
                    })

                    var permission={}
                    permission[validatedinfo.clientid]=validatedinfo.permission
                    
                    caching.replace(validatedinfo.touuid,"shared_clientid",permission)
                    return thisuser.client.edit.share(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
    },
    
    remove:{
        contact:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["clientid","fieldid"],validate:["clientid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"REMOVE_CONTACT",
                        value:validatedinfo.clientid,
                        value1:validatedinfo.fieldid
                    })

                    return thisuser.client.remove.contact(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        share:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["clientid","touuid"],validate:["clientid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"SHARE_CLIENT",
                        value:validatedinfo.clientid,
                        value1:validatedinfo.touuid
                    })
                    
                    caching.remove(validatedinfo.touuid,"_clientid",validatedinfo.clientid)
                    caching.splice(validatedinfo.touuid,"shared_clientid",validatedinfo.clientid)
                    return thisuser.client.edit.share(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
    },
    
    delete:function(uuid,info){
        return new Promise(function(resolve,reject){
            validation.check(uuid,info,{onlyHave:["clientid"],validate:["clientid"]}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                
                thisuser.log.new({
                    action:"DELETE_CLIENT",
                    value:validatedinfo.clientid,
                })
                
                caching.remove(uuid,"_clientid",validatedinfo.clientid)
                return thisuser.client.delete(validatedinfo)
            }).then(function(){
                resolve(id)
            })
        })
    }
}
