var sql=require("./sql.js")

var settings={
    idFields:["uuid","cid","touuid"],
    allowedFields:["permission","note"],
    filterFields:[],
    table:"candshare",  
    orderBy:"lastmodified desc",
}

module.exports = new sql(settings)
