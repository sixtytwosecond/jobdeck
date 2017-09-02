var sql=require("./sql.js")

var settings={
    idFields:["uuid","gid"],
    allowedFields:["name","description"],
    filterFields:[],
    table:"workgroups", 
    orderBy:"created desc",
}

module.exports = new sql(settings)

    