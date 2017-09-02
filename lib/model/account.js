var Promise=require("bluebird");
var sql=require("../db/sql.js")
var useraccount=require("../db/useraccount.js")
var reminders=require("../db/reminders.js")

module.exports=account

function account(uuid){
    var self=this
    this.uuid=uuid
    
    this.reminder={
        new:function(info){
            info.uuid=self.uuid
            return reminders.new(info)
        },

        edit:function(info){
            info.uuid=self.uuid
            return reminders.edit(info)
        },

        delete:function(info){
            return reminders.new(info)
        }   
    }
}

account.prototype.get=function(){
    var self=this
    return new Promise(function(resolve,reject){
        var info={}
        var output={}
        info.uuid=self.uuid

        useraccount.get(info).then(function(results){
            output.account=results[0]
            return reminders.get(info)
        }).then(function(results){
            output.reminder=results
            resolve(output)
        }).catch(function(err){
            reject(err)
        })
    })
}

account.prototype.edit=function(info){
    info.uuid=self.uuid
    return useraccount.edit(info)
}

account.prototype.validate=function(info){
    info.uuid=self.uuid
    return useraccount.validate(info)
}

