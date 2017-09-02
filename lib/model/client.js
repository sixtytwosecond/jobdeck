var Promise=require("bluebird");
var clients= require("../db/clients.js")
var clientcontact= require("../db/clientcontact.js")
var clientshare= require("../db/clientshare.js")

module.exports=client

function client(uuid){
    var self=this
    self.uuid=uuid;
    
    this.get={
        all:function(info){
            return new Promise(function(resolve,reject){
                info=info||{}
                var output={}
                output.permission={}
                var tasks=[]
                info.uuid=self.uuid
                clients.get(info).then(function(results){
                    output.clients=results
                    var _info={
                        touuid:self.uuid
                    }
                    return clientshare.get(_info)
                }).then(function(results){
                    for(var i=0;i<results.length;i++){
                        var permission
                        var _info={}
                        _info.clientid=results[i].clientid
                        if(!!results[i].permission){
                            permission=JSON.parse(results[i].permission)
                            _info.permission=permission.hasOwnProperty("client")?permission.client:null
                        }
                        
                        output.permission[results[i].clientid]=permission
                        tasks.push(clients.get(_info))
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
                            case "client":
                                tasks.push(clients.get(_info))
                                break;
                            case "share":
                                tasks.push(clientshare.get(_info))
                                break;
                            case "contact":
                                tasks.push(clientcontact.get(_info))
                                break;
                        }
                    }   
                }else{
                    info.uuid=self.uuid
                    tasks.push(clients.get(info))
                    tasks.push(clientshare.get(info))
                    tasks.push(clientcontact.get(info))
                }
                
                Promise.all(tasks).then(function(results){
                    resolve(results)
                }).catch(function(err){
                    reject(err)
                })
            })  
        } 
    }
    
    this.add={
        
        contact:function(info){
            info.uuid=uuid
            return clientcontact.new(info)
        },
        
        share:function(info){
            info.uuid=uuid
            return clientshare.new(info)
        }
    }  
    
    this.edit={
        client:function(){
            return clients.new({uuid:self.uuid})
        },
        
        contact:function(info){
            info.uuid=uuid
            return clientcontact.new(info)
        }
    }
    
    this.remove={

        contact:function(info){
            info.uuid=uuid
            return clientcontact.new(info)
        }
    }
    
}

client.prototype.new=function(info){
    info.uuid=self.uuid
    return clients.new({uuid:self.uuid})
}

client.prototype.delete=function(info){
    info.uuid=self.uuid
    return clients.remove(info)
}
