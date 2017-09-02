var Promise=require("bluebird");
var workgroups= require("../db/workgroups.js")
var workgroupshare= require("../db/workgroupshare.js")

module.exports=workgroup

function workgroup(uuid){
    var self=this
    this.uuid=uuid

    this.get={
        all:function(){
            return workgroups.get({uuid:self.uuid})
        },

        one:function(info){
            return new Promise(function(resolve,reject){
                var tasks=[]
                
                tasks.push(workgroups.get(info))
                tasks.push(workgroupshare.get(info))

                Promise.all(tasks).then(function(results){
                    resolve(results)
                }).catch(function(err){
                    reject(err)
                })
            })  
        },

    }
    
    this.add={
        member:function(info){
            info.uuid=self.uuid
            info.accepted=false
            return workgroupshare.add(info)
        },
    }
    
    this.remove={
        member:function(info){
            info.uuid=self.uuid
            return workgroupshare.delete(info)
        },
        
        admin:function(info){
            info.uuid=self.uuid
            return workgroupshare.deleteadmin(info)
        },
    }
    
    this.change={
        share:function(info){
            info.uuid=self.uuid
            return workgroupshare.edit(info)
        },
    }

}

workgroup.prototype.new=function(info){
    return new Promise(function(resolve,reject){
        info.uuid=self.uuid
        info.touuid=self.uuid
        return workgroups.new(info)
    }).then(function(){
        return workgroupshare.new(info)
    }).then(function(){
        resolve()
    }).catch(function(err){
        reject(err)
    })
}

workgroup.prototype.edit=function(info){
    info.uuid=self.uuid
    return workgroups.edit(info)
}

workgroup.prototype.delete=function(info){
    return new Promise(function(resolve,reject){
        return workgroups.delete(info)
    }).then(function(){
        return workgroupshare.delete(info)
    }).then(function(){
        resolve()
    }).catch(function(err){
        reject(err)
    })
}
