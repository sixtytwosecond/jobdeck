var Promise=require("bluebird");
var validator = require('validator');
var Promise=require("bluebird");
var redisjs = require("redis");
Promise.promisifyAll(redisjs);
var redis = redisjs.createClient();
var caching = require("./manageCache.js");

module.exports = {
    check:function(uuid,info,options){
        var self=this
        return new Promise(function(resolve,reject){            
            if(!uuid){
                reject("invalid_input")
            }else{
                var validatedInfo={}
                var includeItems=options.includes||[]
                var onlyHaveItems=options.onlyHave||[]
                var validateItems=options.validate||[]                

                for(var prop in info){
                    if(prop=="email"&&validator.isEmail(info[prop])){
                        validatedInfo[prop]=info[prop]
                    }else{
                        validatedInfo[prop]=validator.escape(info[prop])
                    }

                    if(!!validatedInfo[prop]&&includeItems.indexOf(validatedInfo[prop])>-1){
                        var index=includeItems.indexOf(validatedInfo[prop])
                        includeItems.splice(index,1)
                    }
                }   

                if(onlyHaveItems.length>0){
                    for(var prop in validatedInfo){
                        if(onlyHaveItems.indexOf(prop)==-1){
                            delete validatedInfo[prop]
                        }
                    }
                }

                var _includeItems=options.includes||[]
                var contentNotNull=options.contentNotNull?validatedInfo.length-_includeItems.length>0:true

                if(includeItems.length==0&&contentNotNull){
                    self.validate(uuid,validatedInfo,options).then(function(_validatedInfo){
                        resolve(_validatedInfo)
                    }).catch(function(err){
                        reject(err)
                    })
                }else{
                    reject("invalid_input")
                }
            }
        })
    },
    
    validate:function(uuid,info,options){
        return new Promise(function(resolve,reject){
            var validateItems=options.validate||[] 
            
            if(validateItems.length==0){
                resolve(info)
            }else{
                var items=options.includes||options.onlyHave||[]
                
                redis.existsAsync(uuid).then(function(exists){
                    if(!exists){
                        return caching.cache(uuid)
                    }
                }).then(function(){
                    var tasks=[]
                    for(var i=0;i<validateItems.length;i++){
                        tasks.push(redis.hmgetAsync(uuid,validateItems[i]))
                    }
                    return Promise.all(tasks)
                }).then(function(results){
                    var isValid=results.every(function(v,i){
                        var data=JSON.parse(results[i])
                        return data.indexOf(info[items[i]])>-1
                    })
                    
                    if(isValid){
                        resolve(info)
                    }else{
                        reject("validation.validate")
                    }
                }).catch(function(err){
                    console.err("validation.validate")
                    reject(err)
                })
            }
        })
    },
    
    get:function(uuid,label){
        return new Promise(function(resolve,reject){ 
            redis.existsAsync(uuid).then(function(exists){
                if(!exists){
                    return caching.cache(uuid)
                }
            }).then(function(){
                return redis.hmgetAsync(uuid,label)
            }).then(function(results){
                results=JSON.parse(results)
                resolve(results)
            }).catch(function(err){
                console.err("validation.get")
                reject(err)
            })
        })
    },
}