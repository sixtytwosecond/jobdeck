var sql=require("./sql.js")

var settings={
    idFields:["clientid","fieldid"],
    allowedFields:["name","title","phonenumber","email","department","note","address1","postalcode1","city1","country1","address2",
                   "postalcode2","city2","country2",],
    filterFields:[],
    table:"clientcontact",  
    orderBy:"lastmodified desc",
}

module.exports = new sql(settings)
