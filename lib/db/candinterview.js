var sql=require("./sql.js")

var settings={
    idFields:["fieldid","jid","cid"],
    allowedFields:["type","status","interviewdate","interviewerFirstname1","interviewer1Lastname","interviewer1position","interviewerFirstname2","interviewer2Lastname","interviewer2position","contactFirstname","contactLastname","address","description","lengthofmeeting","feedback","note"],
    filterFields:[],
    table:"candinterview", 
    orderBy:"lastmodified desc",
}

module.exports = new sql(settings)
    