var Promise=require("bluebird");
var logs= require("../db/logs.js")

module.exports=log

function log(uuid){
    this.uuid=uuid;
}

log.prototype.get=function(){
    return logs.get({uuid:this.uuid})
}

log.prototype.new=function(info){
    info.uuid=this.uuid
    return logs.new(info)
}
