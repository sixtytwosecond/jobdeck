var Promise=require("bluebird");
var user=require("../model/user")
var validation = require('./validation.js');
var caching = require('./manageCache.js');

module.exports = {
    get:function(uuid){
        return new Promise(function(resolve,reject){
            var thisuser=new user(uuid)
            thisuser.workgroup.get().then(function(results){
                resolve(results)
            }).catch(function(err){
                reject(err)
            })
        })
    },
    
    new:function(uuid,info){
        return new Promise(function(resolve,reject){
            var id=shortid.generate()
            validation.check(uuid,info,{includes:["name"]}).then(function(validatedinfo){
                var thisuser=new user(uuid)
                validatedinfo.gid=id
                validatedinfo.permission="admin"
                validatedinfo.accepted=true
                
                thisuser.log.new({
                    action:"NEW_WORKGROUP",
                    value:id,
                })
                
                caching.add(uuid,"gid",id)
                caching.add(uuid,"admin_gid",id)
                return thisuser.workgroup.new(validatedinfo)
            }).then(function(){
                resolve(id)
            })
        })
    },
    
    add:{
        member:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{includes:["gid","touuid"],validate:["admin_gid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"SHARE_WORKGROUP",
                        value:validatedinfo.gid,
                        value1:validatedinfo.touuid,
                    })
                    
                    caching.add(validatedinfo.touuid,"_gid",validatedinfo.gid)
                    caching.add(validatedinfo.touuid,"member_gid",validatedinfo.gid)
                    return thisuser.workgroup.add.member(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        }, 
    },
    
    remove:{
        member:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["gid","touuid"],validate:["admin_gid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    
                    thisuser.log.new({
                        action:"REMOVE_SHARE_WORKGROUP",
                        value:validatedinfo.gid,
                        value1:validatedinfo.touuid,
                    })
                    
                    caching.remove(validatedinfo.touuid,"_gid",validatedinfo.gid)
                    caching.remove(validatedinfo.touuid,"gid",validatedinfo.gid)
                    caching.remove(validatedinfo.touuid,"member_gid",validatedinfo.gid)
                    return thisuser.workgroup.remove.member(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },  
        
        me:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["gid"],validate:["member_gid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.touuid=uuid
                    
                    thisuser.log.new({
                        action:"REMOVE_FROM_WORKGROUP",
                        value:validatedinfo.gid,
                        value1:validatedinfo.touuid,
                    })
                    
                    caching.remove(uuid,"_gid",validatedinfo.gid)
                    caching.remove(uuid,"gid",validatedinfo.gid)
                    caching.remove(uuid,"member_gid",validatedinfo.gid)
                    return thisuser.workgroup.remove.member(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        admin:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["gid"],validate:["admin_gid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.touuid=uuid
                    
                    thisuser.log.new({
                        action:"REMOVE_ADMIN_FROM_WORKGROUP",
                        value:validatedinfo.gid,
                        value1:validatedinfo.touuid,
                    })
                    
                    caching.remove(validatedinfo.touuid,"_gid",validatedinfo.gid)
                    caching.remove(validatedinfo.touuid,"gid",validatedinfo.gid)
                    caching.remove(validatedinfo.touuid,"admin_gid",validatedinfo.gid)
                    return thisuser.workgroup.remove.admin(validatedinfo)
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },
    },

    change:{
        permission:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["gid","touuid","permission"],validate:["admin_gid"]}).then(function(validatedinfo){
                    if(validatedinfo.touuid!=uuid){
                        var thisuser=new user(uuid)
                        thisuser.log.new({
                            action:"CHANGE_WORKGROUP_PERMISSION",
                            value:validatedinfo.gid,
                            value1:validatedinfo.touuid,
                        })
                        
                        if(validation.permission=="admin"){
                            caching.remove(validatedinfo.touuid,"member_gid",validatedinfo.gid)
                            caching.add(validatedinfo.touuid,"admin_gid",validatedinfo.gid)
                        }else{
                            caching.add(validatedinfo.touuid,"member_gid",validatedinfo.gid)
                            caching.remove(validatedinfo.touuid,"admin_gid",validatedinfo.gid)
                        }
                        return thisuser.workgroup.change.share(validatedinfo)
                    }else{
                        reject("invalid_input")
                    }                    
                }).then(function(){
                    resolve()
                }).catch(function(err){
                    reject(err)
                })
            })
        },  
    },
    
    accept:{
        share:function(uuid,info){
            return new Promise(function(resolve,reject){
                validation.check(uuid,info,{onlyHave:["gid"],validate:["pending_gid"]}).then(function(validatedinfo){
                    var thisuser=new user(uuid)
                    validatedinfo.touuid=uuid
                    validatedinfo.accepted=true

                    thisuser.log.new({
                        action:"ACCEPT_WORKGROUP",
                        value:validatedinfo.gid,
                    })

                    caching.add(uuid,"gid",validatedinfo.gid)
                    caching.remove(uuid,"_gid",validatedinfo.gid)
                    return thisuser.workgroup.change.share(validatedinfo)
                }).then(function(){
                    resolve()
                })
            })
        },
    },
    
    edit:function(uuid,info){
        return new Promise(function(resolve,reject){
            validation.check(uuid,info,{includes:["gid"],validate:["admin_gid"],contentNotNull:true}).then(function(validatedinfo){
                var thisuser=new user(uuid)

                thisuser.log.new({
                    action:"EDIT_WORKGROUP",
                    value:validatedinfo.gid,
                })

                return thisuser.workgroup.edit(validatedinfo)
            }).then(function(){
                resolve()
            })
        })
    },
    
    delete:function(uuid,info){
        return new Promise(function(resolve,reject){
            validation.check(uuid,info,{onlyHave:["gid"],validate:["admin_gid"]}).then(function(validatedinfo){
                var thisuser=new user(uuid)

                thisuser.log.new({
                    action:"REMOVE_WORKGROUP",
                    value:validatedinfo.gid,
                })

                caching.remove(uuid,"gid",validatedinfo.gid)
                caching.remove(uuid,"admin_gid",validatedinfo.gid)
                return thisuser.workgroup.delete(validatedinfo)
            }).then(function(){
                resolve()
            })
        })
    },
    

}
