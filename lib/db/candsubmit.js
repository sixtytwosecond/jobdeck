var sql=require("./sql.js")

var settings={
    idFields:["jid","cid"],
    allowedFields:["status","feedback","note"],
    filterFields:[],
    table:"candsubmit",  
    orderBy:"lastmodified desc",
}

module.exports = new sql(settings)

    