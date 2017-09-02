var sql=require("./sql.js")

var settings={
    idFields:["fieldid","jid","cid"],
    allowedFields:["type","status","position","currency","annualsalary","bonus","compensation","description","note"],
    filterFields:[],
    table:"candoffer", 
    orderBy:"lastmodified desc",
}

module.exports = new sql(settings)

    