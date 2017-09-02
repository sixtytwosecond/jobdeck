var sql=require("./sql.js")

var settings={
    idFields:["cid","fieldid"],
    allowedFields:["type","organization","position","currentposition","startdate","enddate","currency","annualsalary","bonus","compensation","industry","description","reasonofleaving","note","tag"],
    filterFields:[],
    table:"candexperience", 
    orderBy:"currentposition desc, enddate",
}

module.exports = new sql(settings)