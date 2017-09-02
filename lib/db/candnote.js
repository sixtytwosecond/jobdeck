var sql=require("./sql.js")

var settings={
    idFields:["cid","fieldid"],
    allowedFields:["type","note","tag"],
    filterFields:[],
    table:"candnote",  
    orderBy:"lastmodified desc",
}

module.exports = new sql(settings)