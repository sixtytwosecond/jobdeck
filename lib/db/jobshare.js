var sql=require("./sql.js")

var settings={
    idFields:["uuid","jid","touuid"],
    allowedFields:["premission","note"],
    filterFields:[],
    table:"jobshare", 
    orderBy:"lastmodified desc",
}

module.exports = new sql(settings)
