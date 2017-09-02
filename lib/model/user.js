var workgroup= require("./workgroup.js")
var candidate= require("./candidate.js")
var job= require("./job.js")
var account= require("./account.js")
var message= require("./message.js")
var log= require("./log.js")
var client= require("./client.js")

module.exports=user

function user(uuid){
    this.uuid=uuid;
    var mycandidate=new candidate(uuid)
    var myjob=new job(uuid)
    var myworkgroup=new workgroup(uuid)
    var myaccount=new account(uuid)
    var mymessage=new message(uuid)
    var mylog=new log(uuid)
    var myclient=new client(uuid)
    
    this.candidate=mycandidate
    this.job=myjob
    this.workgroup=myworkgroup
    this.account=myaccount
    this.message=mymessage
    this.log=mylog
    this.client=myclient
}
