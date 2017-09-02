var Promise=require("bluebird");
var sql=require("./sql.js")
var mysql = require('promise-mysql');
var dbconfig=require("../config/dbconfig.js")
var connection
var settings={
    idFields:["uuid","cid"],
    allowedFields:["firstname","lastname","othername","email","telephone","country","city","currency","expectedannualsalary",
                   "expectedindustry","expectedcompensation","seniority","requirevisa","summary","availability","score",
                   "note","tag"],
    filterFields:["firstname","lastname","othername","email","telephone","country","score","noticeperiod","available",
                   "note"],
    table:"candidates", 
}

mysql.createConnection(dbconfig.db).then(function(_conn){
    connection=_conn
});

var candidates=new sql(settings)

module.exports = candidates

candidates.getAll=function(info){
    return new Promise(function(resolve,reject){   
        var _querystring="candidates.uuid=? AND"
        var havingstring=" "
        var parameters=[info.uuid];
        var filterFields=settings.filterFields
        var havingFields=["share","submit","interview","offer"]
        var candexp_filterFields=["type","organization","position","currentposition","description","note"]
        var candnote_filterFields=["type","note"]

        for(var prop in info){
            if(filterFields.indexOf(prop)>-1){
                _querystring+="candidates."+prop+" LIKE ? AND"
                parameters.push(info[prop])
            }else if(havingFields.indexOf(prop)>-1){
                havingstring+=prop+">0 AND "
            }
        }
        _querystring=_querystring.slice(0, -4);

        //Include candexp
        if(info.hasOwnProperty("Experience")&&Object(info.Experience).keys.length>0){
            _querystring+="AND candidates.cid IN (SELECT cid FROM candexp WHERE "
            for(var prop in info.Experience){
                if(candexp_filterFields.indexOf(prop)>-1){
                    _querystring+=prop+" LIKE ? AND"
                    parameters.push(info.Experience[prop])
                }
            }            
            _querystring=_querystring.slice(0, -4);
            _querystring+=")"
        }

        //Include candnote
        if(info.hasOwnProperty("Note")&&Object(info.Note).keys.length>0){
            _querystring+="AND candidates.cid IN (SELECT cid FROM candnote WHERE "
            for(var prop in info.Experience){
                if(candnote_filterFields.indexOf(prop)>-1){
                    _querystring+=prop+" LIKE ? AND"
                    parameters.push(info.Experience[prop])
                }
            }            
            _querystring=_querystring.slice(0, -4);
            _querystring+=")"
        }

        havingstring=havingstring.length>1?havingstring.slice(0, -1):havingstring.slice(0, -5)

        var querystring="SELECT candidates.*,count(candshare.cid) AS share,count(candsubmit.cid) AS submit,count(candinterview.cid) AS interview,count(candoffer.cid) AS offer FROM candidates LEFT JOIN candshare ON candshare.cid=candidates.cid LEFT JOIN candsubmit ON candsubmit.cid=candidates.cid LEFT JOIN candinterview ON candinterview.cid=candidates.cid LEFT JOIN candoffer ON candoffer.cid=candidates.cid WHERE "+_querystring+" GROUP BY candidates.cid"+havingstring+" ORDER BY candidates.lastmodified;"

        connection.query(querystring,parameters).then(function(results){
            resolve(results)
        }).catch(function(err){
            console.error("candidates.getAll")
            reject(err)
        })
    })
}

