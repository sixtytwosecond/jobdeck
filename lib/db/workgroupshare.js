var Promise=require("bluebird");
var mysql = require('promise-mysql');
var sql=require("./sql.js")
var dbconfig=require("../config/dbconfig.js")
var connection

var settings={
    idFields:["uuid","gid","touuid"],
    allowedFields:["permission","role","accepted"],
    filterFields:[],
    table:"workgroupshare", 
    orderBy:"created desc",
}

mysql.createConnection(dbconfig.db).then(function(_conn){
    connection=_conn
});

var workgroupshare=new sql(settings)

module.exports = workgroupshare

workgroupshare.deleteadmin=function(info){
    return new Promise(function(resolve,reject){   
        var querystring="SELECT count(touuid)>1 as admin FROM "+settings.table+" WHERE gid=? AND role='admin';"
        var parameters=[info.gid,info.uuid,info.gid]
        
        connection.query(querystring,parameters).then(function(results){
            if(results[0].admin==1){
                querystring="DELETE FROM "+settings.table+" WHERE gid=? AND touuid=?;"
                parameters=[info.gid,info.uuid]
                return connection.query(querystring,parameters)
            }
        }).then(function(results){
            resolve()
        }).catch(function(err){
            console.error("workgroupshare.removeadmin")
            reject(err)
        })
    })
}

    