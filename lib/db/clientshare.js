var sql=require("./sql.js")

var settings={
    idFields:["uuid","clientid","touuid"],
    allowedFields:["premission","note"],
    filterFields:[],
    table:"clientshare", 
    orderBy:"lastmodified desc",
}

module.exports = new sql(settings)
