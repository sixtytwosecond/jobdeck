var sql=require("./sql.js")

var settings={
    idFields:["uuid"],
    allowedFields:["action","value","value1"],
    filterFields:[],
    table:"logs",
    orderBy:"lastmodified desc",
}

module.exports = new sql(settings)
