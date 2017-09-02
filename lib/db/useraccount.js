var sql=require("./sql.js")

var settings={
    idFields:["uuid"],
    allowedFields:["firstname","lastname","email","replytoemail","telephone","country","city","feetier"],
    filterFields:[],
    table:"useraccount", 
}

module.exports = new sql(settings)