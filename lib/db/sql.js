var Promise=require("bluebird");
var mysql = require('promise-mysql');
var dbconfig=require("../config/dbconfig.js")
var connection
mysql.createConnection(dbconfig.db).then(function(_conn){
    connection=_conn
});

module.exports = sql

function sql(settings){
    this.settings=settings
}

sql.prototype.get=function(info){
    var self=this
    return new Promise(function(resolve,reject){
        var settings=self.settings
        var filterFields=settings.filterFields
        var idFields=settings.idFields
        var allowedFields=settings.allowedFields
        var getfields=info.permission||settings.getFields
        var getFields=""
        var querystring="";
        var parameters=[];

        if(!!getfields){
            for(var i=0;i<getfields.length;i++){
                if(allowedFields.indexOf(getfields[i])>-1){
                    getFields=getFields+getfields[i]+","
                }
            }
            if(getFields.length>1){
                getFields=getFields.slice(0, -1);
                getFields=settings.idFields.join(",")+","+getFields
            }
        }
        
        getFields=!!getFields?getFields:"*"
        
        querystring="SELECT "+getFields+" FROM "+settings.table+" WHERE "
        for(var prop in info){
            if(idFields.indexOf(prop)>-1){
                querystring+=prop+"= ? AND "
                parameters.push(info[prop])
            }else if(filterFields.indexOf(prop)>-1){
                querystring+=prop+" LIKE ? AND "
                parameters.push(info[prop])
            }
        }

        querystring=querystring.slice(0, -4);

        if(settings.hasOwnProperty("orderBy")){
            querystring+=" ORDER BY "+settings.orderBy
        }

        if(settings.limit>0){
            querystring+=" LIMIT "+settings.limit
        }

        querystring+=";"  
        //console.log(querystring,parameters)
        connection.query(querystring,parameters).then(function(results){
            resolve(results)
        }).catch(function(err){
            console.error(settings.table+".get")
            reject(err)
        })
    })
}
    
sql.prototype.new=function(info){
    var self=this
    return new Promise(function(resolve,reject){
        var settings=self.settings
        var allowedFields=settings.allowedFields.concat(settings.idFields)
        var querystring="";
        var _querystring="";
        var parameters=[];

        for(var prop in info){
            if(allowedFields.indexOf(prop)>-1){
                querystring+=prop+",";
                _querystring+="?,"
                if(info[prop]==true||info[prop]=="true"){
                    parameters.push("Y")
                }else if(info[prop]==false||info[prop]=="false"){
                    parameters.push("N")
                }else{
                    parameters.push(info[prop])
                }
            }
        } 

        querystring=querystring.slice(0, -1);
        _querystring=_querystring.slice(0, -1);

        querystring="INSERT INTO "+settings.table+" ("+querystring+") VALUES ("+_querystring+");"

        connection.query(querystring,parameters).then(function(){
            resolve()
        }).catch(function(err){
            console.error(settings.table+".add")
            reject(err)
        })
    })
}
    
sql.prototype.edit=function(info){
    var self=this
    return new Promise(function(resolve,reject){
        var settings=self.settings
        var allowedFields=settings.allowedFields
        var idFields=settings.idFields
        var querystring=""
        var parameters=[];

        for(var prop in info){
            if(allowedFields.indexOf(prop)>-1){
                querystring+=prop+"=?,";
                if(info[prop]==true||info[prop]=="true"){
                    parameters.push("Y")
                }else if(info[prop]==false||info[prop]=="false"){
                    parameters.push("N")
                }else{
                    parameters.push(info[prop])
                }
            }
        } 

        querystring="UPDATE "+settings.table+" SET "+querystring+" WHERE "
        parameters.push(info.uuid)

        for(var prop in info){
            if(idFields.indexOf(prop)>-1){
                querystring+=prop+"=? AND ";
                parameters.push(info[prop])
            }
        }

        querystring=querystring.slice(0, -4);
        querystring+=";"                        
        connection.query(querystring,parameters).then(function(){
            resolve()
        }).catch(function(err){
            console.error(err)
            reject(settings.table+".edit")
        })
    })
}
    
sql.prototype.remove=function(info){
    var self=this
    return new Promise(function(resolve,reject){
        var settings=self.settings
        var idFields=settings.idFields
        var querystring=""
        var parameters=[];

        querystring="DELETE FROM "+settings.table+" WHERE "
        parameters.push(info.uuid)

        for(var prop in info){
            if(idFields.indexOf(prop)>-1){
                querystring+=prop+"=? AND ";
                parameters.push(info[prop])
            }
        }

        querystring=querystring.slice(0, -4);
        querystring+=";"  

        connection.query(querystring,parameters).then(function(results){
            resolve()
        }).catch(function(err){
            console.error(err)
            reject(settings.table+".remove")
        })
    })
} 

sql.prototype.validate=function(info){
    var self=this
    return new Promise(function(resolve,reject){
        var settings=self.settings
        var filterFields=settings.filterFields
        var idFields=settings.idFields
        var querystring="";
        var parameters=[];

        querystring="SELECT count(1) FROM "+settings.table+" WHERE "
        for(var prop in info){
            if(idFields.indexOf(prop)>-1){
                querystring+=prop+"= ? AND "
                parameters.push(info[prop])
            }else if(filterFields.indexOf(prop)>-1){
                querystring+=prop+" LIKE ? AND "
                parameters.push(info[prop])
            }
        }

        querystring=querystring.slice(0, -4);

        querystring+=" LIMIT 1;"

        connection.query(querystring,parameters).then(function(results){
            resolve(results)
        }).catch(function(err){
            console.error(settings.table+".validate")
            reject(err)
        })
    })
} 
