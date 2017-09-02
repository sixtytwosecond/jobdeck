var Promise=require("bluebird");
var messages= require("../db/messages.js")

module.exports=message

function message(uuid){
    this.uuid=uuid;
}

message.prototype.get=function(info){
    info.uuid=this.uuid
    return messages.new(info)
}

message.prototype.new=function(info){
    info.uuid=this.uuid
    return messages.new(info)
}
