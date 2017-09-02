var sql=require("./sql.js")

var settings={
    idFields:["uuid","fieldid"],
    allowedFields:["status","note","remindme","referencetype","referenceid"],
    filterFields:[],
    table:"reminders", 
    orderBy:"remindme desc",
}

module.exports = new sql(settings)

    