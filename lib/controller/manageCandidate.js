var Promise=require("bluebird");
var user=require("../model/user")
var validation = require('./validation.js');
var caching = require('./manageCache.js');

module.exports = {
    get:{
        all:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    return thisuser.candidate.get.all(info)
                }).then(function(results){
                    resolve(results)
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        one:function(uuid,info){
            return new Promise(function(resolve,reject){
                var validatedinfo
                validation.check(uuid,info,{onlyHave:["cid"],validate:["_cid"]}).then(function(_validatedinfo){
                    validatedinfo=_validatedinfo
                    return validation.get(uuid,"shared_cid")
                }).then(function(results){
                    console.log(results)
                    var thisuser=new user(uuid)
                    if(results.hasOwnProperty(validatedinfo.cid)){
                        validatedinfo.permission=results[validatedinfo.cid]
                    }
                    
                    return thisuser.candidate.get.one(validatedinfo)
                }).then(function(results){
                    resolve(results)
                }).catch(function(err){
                    reject(err)
                })
            })
        },  
    },

    new:function(uuid,info){
        return new Promise(function(resolve,reject){
            var id=shortid.generate()
            validation.check(uuid,info,{includes:["firstname","lastname"]}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                validatedinfo.cid=id
                
                thisuser.log.new({
                    action:"NEW_CANDIDATE",
                    value:id,
                })
                caching.add(uuid,"cid",id)
                return thisuser.candidate.new(validatedinfo)
            }).then(function(){
                resolve(id)
            }).catch(function(err){
                reject(err)
            })
        })
    },
    
    add:{
        experience:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{includes:["cid","type"],validate:["cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id
                    
                    thisuser.log.new({
                        action:"ADD_CANDIDATE_EXPERIENCE",
                        value:validatedinfo.cid,
                        value1:id
                    })
                    
                    return thisuser.candidate.add.experience(validatedinfo)
                }).then(function(){
                    resolve(id)
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        note:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{includes:["cid"],validate:["cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id

                    thisuser.log.new({
                        action:"ADD_CANDIDATE_NOTE",
                        value:validatedinfo.cid,
                        value1:id
                    })
                    
                    return thisuser.candidate.add.note(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        share:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{includes:["cid","touuid","permission"],validate:["cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"SHARE_CANDIDATE",
                        value:validatedinfo.cid,
                        value1:validatedinfo.touuid,
                    })
                    
                    var permission={}
                    permission[validatedinfo.cid]=validatedinfo.permission
                    
                    caching.add(validatedinfo.touuid,"_cid",validatedinfo.cid)
                    caching.replace(validatedinfo.touuid,"shared_cid",permission)
                    return thisuser.candidate.add.share(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },

    },
    
    edit:{
        experience:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{includes:["cid","fieldid"],contentNotNull:true,validate:["cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"EDIT_CANDIDATE_EXPERIENCE",
                        value:validatedinfo.cid,
                        value:validatedinfo.fieldid
                    })
                    
                    return thisuser.candidate.edit.experience(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        note:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{includes:["cid","fieldid"],contentNotNull:true,validate:["cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"EDIT_CANDIDATE_NOTE",
                        value:validatedinfo.cid,
                        value:validatedinfo.fieldid
                    })
                    
                    return thisuser.candidate.edit.note(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        share:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{includes:["cid","touuid","permission"],validate:["cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"EDIT_SHARE",
                        value:validatedinfo.cid,
                        value1:validatedinfo.touuid,
                    })
                    
                    var permission={}
                    permission[validatedinfo.cid]=validatedinfo.permission
                    
                    caching.replace(validatedinfo.touuid,"shared_cid",permission)
                    return thisuser.candidate.edit.share(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },

    },
    
    remove:{   
        experience:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["cid","touuid"],validate:["cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"REMOVE_CANDIDATE_EXPERIENCE",
                        value:validatedinfo.cid,
                        value:validatedinfo.fieldid
                    })
                    
                    return thisuser.candidate.remove.experience(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        note:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["cid","touuid"],validate:["cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"REMOVE_CANDIDATE_NOTE",
                        value:validatedinfo.cid,
                        value:validatedinfo.fieldid
                    })
                    
                    return thisuser.candidate.remove.note(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        share:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["cid","touuid"],validate:["cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"REMOVE_SHARE_CANDIDATE",
                        value:validatedinfo.cid,
                        value1:validatedinfo.touuid,
                    })
                    
                    caching.remove(validatedinfo.touuid,"_cid",validatedinfo.cid)
                    caching.splice(validatedinfo.touuid,"shared_cid",validatedinfo.cid)
                    return thisuser.candidate.remove.share(validatedinfo)
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
            validation.check(uuid,info,{onlyHave:["cid"],validate:["cid"]}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                
                thisuser.log.new({
                    action:"DELETE_CANDIDATE",
                    value:validatedinfo.cid,
                })
                
                caching.remove(uuid,"_cid",validatedinfo.cid)
                return thisuser.candidate.delete(validatedinfo)
            }).then(function(){
                resolve(id)
            }).catch(function(err){
                reject(err)
            })
        })
    }

}
