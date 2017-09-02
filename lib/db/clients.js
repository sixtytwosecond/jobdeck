var sql=require("./sql.js")

var settings={
    idFields:["uuid","clientid"],
    allowedFields:["name","parentcompany","industry","description","headquarter","companysize","website","founded","note"],
    filterFields:[],
    table:"clients",  
    //orderBy:"lastmodified desc",
}

var clients=new sql(settings)

module.exports = clients
