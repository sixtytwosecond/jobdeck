var sql=require("./sql.js")

var settings={
    idFields:["uuid","mid","touuid"],
    allowedFields:["message","deliveredat","readat"],
    filterFields:[],
    table:"message",  
    orderBy:"created desc",
}

module.exports = new sql(settings)

