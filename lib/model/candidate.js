var Promise=require("bluebird");
//var settings=require("../config/global_settings.js")
var candexperience=require("../db/candexperience.js")
var candnote=require("../db/candnote.js")
var candshare=require("../db/candshare.js")
var candidates=require("../db/candidates.js")
var candsubmit=require("../db/candsubmit.js")
var candinterview=require("../db/candinterview.js")
var candoffer=require("../db/candoffer.js")

module.exports=candidate

function candidate(uuid){
    var self=this
    self.uuid=uuid

    this.get={
        all:function(info){
            return new Promise(function(resolve,reject){
                var output={}
                output.permission={}
                var tasks=[]
                var info=info||{}
                info.uuid=self.uuid
                candidates.getAll(info).then(function(results){
                    output.candidates=results
                    var _info={
                        touuid:self.uuid
                    }
                    return candshare.get(_info)
                }).then(function(results){
                    for(var i=0;i<results.length;i++){
                        var permission
                        var _info={}
                        _info.cid=results[i].cid
                        if(!!results[i].permission){
                            permission=JSON.parse(results[i].permission)
                            _info.permission=permission.hasOwnProperty("candidate")?permission.candidate:null
                        }
                    
                        output.permission[results[i].cid]=permission
                        tasks.push(candidates.get(_info))
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
                            case "candidate":
                                tasks.push(candidates.get(_info))
                                break;
                            case "experience":
                                tasks.push(candexperience.get(_info))
                                break;
                            case "note":
                                tasks.push(candnote.get(_info))
                                break;
                            case "share":
                                tasks.push(candshare.get(_info))
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
                    tasks.push(candidates.get(info))
                    tasks.push(candexperience.get(info))
                    tasks.push(candnote.get(info))
                    tasks.push(candshare.get(info))
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
        
        share:function(info){
            return candshare.get(info)
        }
    }
    
    this.add={
        experience:function(info){
            return candexperience.new(info)   
        },
        
        note:function(info){
            return candnote.new(info)   
        },
        
        share:function(info){
            var self=this
            info.uuid=self.uuid
            return candshare.new(info)   
        },
                
        interview:function(info){
            return candinterview.new(info)   
        },
        
        offer:function(info){
            return candoffer.new(info)   
        },
        /*
        index:function(){
            return candidatecandinfo.add(self.uuid,info)   
        }
        */
    }
    
    this.remove={
        experience:function(info){
            return candexperience.remove(info)   
        },
        
        note:function(info){
            return candnote.remove(info)   
        },
        
        share:function(info){
            return candshare.remove(info)   
        },
        
        interview:function(info){
            return candinterview.new(info)   
        },
        
        offer:function(info){
            return candoffer.new(info)   
        },
    }
    
    this.edit={
        experience:function(info){
            return candexperience.edit(info)   
        },
        
        note:function(info){
            return candnote.edit(info)   
        },
        
        interview:function(info){
            return candinterview.new(info)   
        },
        
        offer:function(info){
            return candoffer.new(info)   
        },
    } 
    
    this.validate={
        experience:function(info){
            info.uuid=self.uuid
            return candexperience.validate(info)   
        },
        
        note:function(info){
            info.uuid=self.uuid
            return candnote.validate(info)   
        },
        
        interview:function(info){
            info.uuid=self.uuid
            return candinterview.validate(info)   
        },
        
        offer:function(info){
            info.uuid=self.uuid
            return candoffer.validate(info)   
        },
    } 
    
}

candidate.prototype.new=function(info){
    info.uuid=self.uuid
    return candidates.new(info)
}

candidate.prototype.delete=function(info){
    info.uuid=self.uuid
    return candidates.remove(info)
}

