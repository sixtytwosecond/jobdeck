var Promise=require("bluebird");
var candsubmit=require("../db/candsubmit.js")
var candinterview=require("../db/candinterview.js")
var candoffer=require("../db/candoffer.js")
var jobshare=require("../db/jobshare.js")
var jobs=require("../db/jobs.js")


module.exports=job

function job(uuid){
    var self=this
    self.uuid=uuid
    
    this.get={
        all:function(info){
            return new Promise(function(resolve,reject){
                info=info||{}
                var output={}
                output.permission={}
                var tasks=[]
                info.uuid=self.uuid
                jobs.getAll(info).then(function(results){
                    output.jobs=results
                    var _info={
                        touuid:self.uuid
                    }
                    return jobshare.get(_info)
                }).then(function(results){
                    for(var i=0;i<results.length;i++){
                        var permission
                        var _info={}
                        _info.jid=results[i].jid
                        if(!!results[i].permission){
                            permission=JSON.parse(results[i].permission)
                            _info.permission=permission.hasOwnProperty("job")?permission.job:null
                        }
                        
                        output.permission[results[i].jid]=permission
                        tasks.push(jobs.get(_info))
                    }
                    return Promise.all(tasks)
                }).then(function(results){
                    output.shared=results
                    resolve(output)
                }).catch(function(err){
                    reject(err)
                })
            })
        },
        
        one:function(info){
            return new Promise(function(resolve,reject){
                var tasks=[]
                            
                if(info.hasOwnProperty("permission")){
                    for(var prop in info.permission){
                        var _info=JSON.parse(JSON.stringify(info))
                        _info.permission=info.permission[prop]
                        switch(prop){
                            case "job":
                                tasks.push(jobs.get(_info))
                                break;
                            case "share":
                                tasks.push(jobshare.get(_info))
                                break;
                            case "submitted":
                                tasks.push(candsubmit.get(_info))
                                break;
                            case "interviewed":
                                tasks.push(candinterview.get(_info))
                                break;
                            case "offered":
                                tasks.push(candoffer.get(_info))
                                break;
                        }
                    }   
                }else{
                    info.uuid=self.uuid
                    tasks.push(jobs.get(info))
                    tasks.push(jobshare.get(info))
                    tasks.push(candsubmit.get(info))
                    tasks.push(candinterview.get(info))
                    tasks.push(candoffer.get(info))
                }

                Promise.all(tasks).then(function(results){
                    resolve(results)
                }).catch(function(err){
                    reject(err)
                })
            })  
        },
        
        interview:function(info){
            return candinterview.get(info)
        },
        
        offer:function(info){
            return candoffer.get(info)
        },
        
        share:function(info){
            return jobshare.get(info)
        }
    }
    
    this.add={
        candidate:function(info){
            return candsubmit.new(info)   
        },
        
        share:function(info){
            return jobshare.new(info)   
        },
        
    }
    
    this.remove={
        candidate:function(info){
            return candsubmit.remove(info)   
        },
        
        share:function(info){
            return jobshare.remove(info)   
        }
    }
    
    this.edit={
        candidate:function(info){
            return candsubmit.edit(info)   
        },
        
        job:function(info){
            return jobs.edit(indo)
        },
        
        share:function(info){
            return jobshare.edit(info)   
        }
        
    }
    
    this.validate={
        candidate:function(info){
            info.uuid=self.uuid
            return candsubmit.validate(info)   
        }
    }
}

job.prototype.new=function(info){
    info.uuid=self.uuid
    return jobs.new(info)
}

job.prototype.delete=function(info){
    info.uuid=self.uuid
    return jobs.remove(info)
}
