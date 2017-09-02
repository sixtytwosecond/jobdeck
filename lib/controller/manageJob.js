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
                    return thisuser.job.get.all(validatedinfo)
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
                validation.check(uuid,info,{onlyHave:["jid"],validate:["_jid"]}).then(function(_validatedinfo){
                    validatedinfo=_validatedinfo
                    return validation.get(uuid,"shared_jid")
                }).then(function(results){
                    var thisuser=new user(uuid)
                    if(results.hasOwnProperty(validatedinfo.jid)){
                        validatedinfo.permission=results[validatedinfo.jid]
                    }
                    
                    return thisuser.job.get.one(validatedinfo)
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
            validation.check(uuid,info,{contentNotNull:true}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                validatedinfo.jid=id
                
                thisuser.log.new({
                    action:"NEW_JOB",
                    value:id,
                })
                
                caching.add(uuid,"jid",id)
                return thisuser.job.new(validatedinfo)
            }).then(function(){
                resolve(id)
            })
        })
    },
    
    add:{
        candidate:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["jid","cid"],validate:["jid","_cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"SUBMIT_CANDIDATE",
                        value:validatedinfo.jid,
                        value1:validatedinfo.cid,
                    })
                    
                    return thisuser.job.add.candidate(validatedinfo)
                }).then(function(){
                    resolve(id)
                })
            })
        },
        
        interview:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{onlyHave:["jid","cid"],validate:["jid","_cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id
                    
                    thisuser.log.new({
                        action:"ADD_INTERVIEW",
                        value:validatedinfo.jid,
                        value1:id,
                    })
                    
                    return thisuser.candidate.add.interview(validatedinfo)
                }).then(function(){
                    resolve(id)
                })
            })
        },
        
        offer:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{onlyHave:["jid","cid"],validate:["jid","_cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id
                    
                    thisuser.log.new({
                        action:"ADD_OFFER",
                        value:validatedinfo.jid,
                        value1:id,
                    })
                    
                    return thisuser.candidate.add.interview(validatedinfo)
                }).then(function(){
                    resolve(id)
                })
            })
        },
        
        share:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{includes:["jid","cid","touuid","premission"],
                                            validate:["jid","_cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id
                    
                    thisuser.log.new({
                        action:"ADD_JOB_SHARE",
                        value:validatedinfo.jid,
                        value1:validatedinfo.touuid,
                    })
                    
                    var permission={}
                    permission[validatedinfo.jid]=validatedinfo.permission
                    
                    caching.add(validatedinfo.touuid,"_jid",validatedinfo.jid)
                    caching.replace(validatedinfo.touuid,"shared_jid",permission)
                    return thisuser.job.add.share(validatedinfo)
                }).then(function(){
                    resolve(id)
                })
            })
        },
        
    },
    
    edit:{
        candidate:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{includes:["jid","cid"],
                                            validate:["jid","cid"],contentNotNull:true}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"EDIT_JOB_CANDIDATE",
                        value:validatedinfo.jid,
                        value1:validatedinfo.cid
                    })
                    
                    return thisuser.job.edit.candidate(validatedinfo)
                }).then(function(){
                    resolve()
                })
            })
        },
        
        job:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{includes:["jid"],validate:["jid"],contentNotNull:true}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"EDIT_JOB",
                        value:validatedinfo.jid,
                    })
                    
                    return thisuser.job.edit.candidate(validatedinfo)
                }).then(function(){
                    resolve()
                })
            })
        },
        
        interview:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{includes:["jid","cid","fieldid"],
                                            validate:["jid","cid"],contentNotNull:true}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id
                    
                    thisuser.log.new({
                        action:"EDIT_INTERVIEW",
                        value:validatedinfo.jid,
                        value1:validatedinfo.fieldid,
                    })
                    
                    return thisuser.candidate.edit.interview(validatedinfo)
                }).then(function(){
                    resolve(id)
                })
            })
        },
        
        offer:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{includes:["jid","cid","fieldid"],
                                            validate:["jid","cid"],contentNotNull:true}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"EDIT_OFFER",
                        value:validatedinfo.jid,
                        value1:validatedinfo.fieldid,
                    })
                    
                    return thisuser.candidate.add.interview(validatedinfo)
                }).then(function(){
                    resolve(id)
                })
            })
        },
        
        share:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{includes:["jid","cid","touuid"],
                                            validate:["jid","_cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id
                    
                    thisuser.log.new({
                        action:"EDIT_JOB_SHARE",
                        value:validatedinfo.jid,
                        value1:validatedinfo.touuid,
                    })
                    
                    var permission={}
                    permission[validatedinfo.jid]=validatedinfo.permission
                    
                    caching.replace(validatedinfo.touuid,"shared_jid",permission)
                    return thisuser.job.edit.share(validatedinfo)
                }).then(function(){
                    resolve(id)
                })
            })
        },
    },
    
    remove:{   
        candidate:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["jid","cid"],validate:["jid","_cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"REMOVE_JOB_CANDIDATE",
                        value:validatedinfo.jid,
                        value1:validatedinfo.cid
                    })
                    
                    return thisuser.job.remove.candidate(validatedinfo)
                }).then(function(){
                    resolve()
                })
            })
        },
        
        interview:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{onlyHave:["jid","cid","fieldid"],validate:["jid","_cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id
                    
                    thisuser.log.new({
                        action:"REMOVE_INTERVIEW",
                        value:validatedinfo.jid,
                        value1:validatedinfo.fieldid,
                    })
                    
                    return thisuser.candidate.edit.interview(validatedinfo)
                }).then(function(){
                    resolve(id)
                })
            })
        },
        
        offer:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["jid","cid","fieldid"],validate:["jid","_cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"REMOVE_OFFER",
                        value:validatedinfo.jid,
                        value1:validatedinfo.fieldid,
                    })
                    
                    return thisuser.candidate.add.interview(validatedinfo)
                }).then(function(){
                    resolve(id)
                })
            })
        },
        
        share:function(uuid,info){
            return new Promise(function(resolve,reject){
                var id=shortid.generate()
                validation.check(uuid,info,{includes:["jid","cid","touuid"],
                                            validate:["jid","_cid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.fieldid=id
                    
                    thisuser.log.new({
                        action:"EDIT_JOB_SHARE",
                        value:validatedinfo.jid,
                        value1:validatedinfo.touuid,
                    })
                    
                    caching.remove(validatedinfo.touuid,"_jid",validatedinfo.jid)
                    caching.splice(validatedinfo.touuid,"shared_jid",permission)
                    return thisuser.job.remove.share(validatedinfo)
                }).then(function(){
                    resolve(id)
                })
            })
        },
    },
    
    delete:function(uuid,info){
        return new Promise(function(resolve,reject){
            validation.check(uuid,info,{onlyHave:["cid"],validate:["_cid"]}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                
                thisuser.log.new({
                    action:"DELETE_CANDIDATE",
                    value:validatedinfo.cid,
                })
                
                caching.remove(uuid,"jid",id)
                return thisuser.job.delete(validatedinfo)
            }).then(function(){
                resolve(id)
            })
        })
    }

}
