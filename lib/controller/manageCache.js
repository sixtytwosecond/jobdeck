var Promise=require("bluebird");
var user=require("../model/user")
var redisjs = require("redis");
Promise.promisifyAll(redisjs);
var redis = redisjs.createClient();

module.exports = {
    cache:function(uuid){
        return new Promise(function(resolve,reject){
            var thisuser=new user(uuid)            
            var tasks=[]
            
            thisuser.account.get().then(function(results){
                var cacheItems=["replytoemail","telephone"]
                for(var i=0;i<cacheItems.length;i++){
                    tasks.push(redis.hmsetAsync(uuid,cacheItems[i],results.account[cacheItems[i]]))
                }
    
                return thisuser.candidate.get.all()
            }).then(function(results){
                var candidates=[]
                for(var i=0;i<results.candidates.length;i++){
                    candidates.push(results.candidates[i].cid)
                }
                tasks.push(redis.hmsetAsync(uuid,"cid",JSON.stringify(candidates)))
                
                var _candidates=[]
                for(var i=0;i<results.shared.length;i++){
                    _candidates.push(results.shared[i][0].cid)
                }
                _candidates=_candidates.concat(candidates)
                tasks.push(redis.hmsetAsync(uuid,"_cid",JSON.stringify(_candidates)))
                tasks.push(redis.hmsetAsync(uuid,"shared_cid",JSON.stringify(results.permission)))
                
                return thisuser.client.get.all()
            }).then(function(results){
                var clients=[]
                for(var i=0;i<results.clients.length;i++){
                    clients.push(results.clients[i].clientid)
                }
                tasks.push(redis.hmsetAsync(uuid,"clientid",JSON.stringify(clients)))
                
                var _clients=[]
                for(var i=0;i<results.shared.length;i++){
                    clients.push(results.shared[i][0].clientid)
                }
                _clients=_clients.concat(clients)
                tasks.push(redis.hmsetAsync(uuid,"_clientid",JSON.stringify(_clients)))
                tasks.push(redis.hmsetAsync(uuid,"shared_clientid",JSON.stringify(results.permission)))
                
                return thisuser.job.get.all()
            }).then(function(results){
                var jobs=[]
                for(var i=0;i<results.jobs.length;i++){
                    jobs.push(results.jobs[i].jid)
                }
                tasks.push(redis.hmsetAsync(uuid,"jid",JSON.stringify(jobs)))
                
                var _jobs=[]
                for(var i=0;i<results.shared.length;i++){
                    _jobs.push(results.shared[i][0].jid)
                }
                _jobs=_jobs.concat(jobs)
                tasks.push(redis.hmsetAsync(uuid,"_jid",JSON.stringify(_jobs)))
                tasks.push(redis.hmsetAsync(uuid,"shared_jid",JSON.stringify(results.permission)))
                
                return thisuser.workgroup.get.all()
            }).then(function(results){
                var workgroup=[]
                var _workgroup=[]
                var admin_workgroup=[]
                var member_workgroup=[]
                for(var i=0;i<results.length;i++){
                    if(results[i].accepted=="Y"){
                        workgroup.push(results[i].gid)
                    }else{
                        _workgroup.push(results[i].gid)
                    }
                    
                    if(results[i].permission=="admin"){
                        admin_workgroup(results[i].gid)
                    }else{
                        member_workgroup.push(results[i].gid)
                    }
                }
                tasks.push(redis.hmsetAsync(uuid,"gid",JSON.stringify(workgroup)))
                tasks.push(redis.hmsetAsync(uuid,"pending_gid",JSON.stringify(_workgroup)))
                tasks.push(redis.hmsetAsync(uuid,"admin_gid",JSON.stringify(admin_workgroup)))
                tasks.push(redis.hmsetAsync(uuid,"member_gid",JSON.stringify(member_workgroup)))
                return Promise.all(tasks)
            }).then(function(){
                resolve()
            }).catch(function(err){
                console.error("manageCache.cache")
                reject(err)
            })
        })
    },

    add:function(uuid,label,item){
        var self=this
        return new Promise(function(resolve,reject){
            redis.existsAsync(uuid).then(function(exists){
                if(exists){
                    redis.hmgetAsync(uuid,label).then(function(results){
                        results=JSON.parse(results)
                        results.push(item)
                        return redis.hmsetAsync(uuid,label,results)
                    }).then(function(){
                        resolve()
                    })
                }else{
                    resolve()
                }
            }).catch(function(err){
                console.error("manageCache.add")
                reject(err)
            })
        })
    },
    
    replace:function(uuid,label,item){
        var self=this
        return new Promise(function(resolve,reject){
            redis.existsAsync(uuid).then(function(exists){
                if(exists){
                    redis.hmgetAsync(uuid,label).then(function(results){
                        results=JSON.parse(results)
                        for(var prop in item){
                            results[prop]=item[prop]
                        }
                        return redis.hmsetAsync(uuid,label,results)
                    }).then(function(){
                        resolve()
                    })
                }else{
                    resolve()
                }
            }).catch(function(err){
                console.error("manageCache.replace")
                reject(err)
            })
        })
    },
    
    splice:function(uuid,label,item){
        var self=this
        return new Promise(function(resolve,reject){
            redis.existsAsync(uuid).then(function(exists){
                if(exists){
                    redis.hmgetAsync(uuid,label).then(function(results){
                        results=JSON.parse(results)
                        delete results[item]
                        return redis.hmsetAsync(uuid,label,results)
                    }).then(function(){
                        resolve()
                    })
                }else{
                    resolve()
                }
            }).catch(function(err){
                console.error("manageCache.replace")
                reject(err)
            })
        })
    },
    
    remove:function(uuid,label,item){
        var self=this
        return new Promise(function(resolve,reject){
            redis.existsAsync(uuid).then(function(exists){
                if(exists){
                    redis.hmgetAsync(uuid,label).then(function(results){
                        results=JSON.parse(results)
                        var index=results.indexOf(item)
                        if(index>-1){
                            results.splice(index,1)
                        }
                        return redis.hmsetAsync(uuid,label,results)
                    }).then(function(){
                        resolve()
                    })
                }else{
                    resolve()
                }
            }).catch(function(err){
                console.error("manageCache.remove")
                reject(err)
            })
        })
    },
}
