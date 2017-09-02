var Promise=require("bluebird");
var mysql = require('promise-mysql');
var sql=require("./sql.js")
var dbconfig=require("../config/dbconfig.js")
var connection

var settings={
    idFields:["uuid","jid","clientid"],
    allowedFields:["status","position","currency","annualsalary","description","requirement","note","tag"],
    filterFields:["companyid","position","status","description","requirement","note"],
    table:"jobs", 
}

mysql.createConnection(dbconfig.db).then(function(_conn){
    connection=_conn
});

var jobs=new sql(settings)

module.exports = jobs

jobs.getAll=function(info){
    return new Promise(function(resolve,reject){       
        var _querystring="jobs.uuid=?,"
        var havingstring=" "
        var parameters=[info.uuid];
        var filterFields=settings.filterFields
        var havingFields=["submit","interview","offer"]

        for(var prop in info){
            if(filterFields.indexOf(prop)>-1){
                _querystring+="jobs."+prop+" LIKE ?,"
                parameters.push(info[prop])
            }else if(havingFields.indexOf(prop)>-1){
                havingstring+=prop+">0 AND "
            }
        }

        _querystring=_querystring.slice(0, -1);
        havingstring=havingstring.length>1?havingstring.slice(0, -1):havingstring.slice(0, -5)

        var querystring="SELECT jobs.*,count(candsubmit.cid) AS submit,count(candinterview.cid) AS interview,count(candoffer.cid) AS offer FROM jobs LEFT JOIN candsubmit ON candsubmit.jid=jobs.jid LEFT JOIN candinterview ON candinterview.jid=jobs.jid LEFT JOIN candoffer ON candoffer.jid=jobs.jid WHERE "+_querystring+" GROUP BY jobs.jid "+havingstring+" ORDER BY jobs.lastmodified;"

        connection.query(querystring,parameters).then(function(results){
            resolve(results)
        }).catch(function(err){
            console.error("jobs.getAll")
            reject(err)
        })
    })
}
