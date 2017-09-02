import {template} from './template.component.js'
import {dateFormat} from '../common/common.js'

export const dataMapper=function(view,action,itemData){
    var itemTemplate=JSON.parse(JSON.stringify(template[view].template))
    var listingIndex=[]
    var data=itemData.item
    var listings=itemData.listings
    var listingStats={}
    for(var prop in itemTemplate.info){
        if(prop=="id"){
            itemTemplate.info[prop]=data[prop]
        }else if(prop=="links"){
            var links=[]
            for(var dataprop in data){
                if(["facebook","twitter","website","instagram","linkedin"].indexOf(dataprop)>-1){
                    var parameters={}
                    parameters[dataprop]=data[dataprop]
                    links.push([parameters])
                }
            }
            itemTemplate.info[prop]=links
        }else if(prop=="moreInfo"){
            var moreInfo=[]
            for(var j=0;j<itemTemplate.info[prop].length;j++){
                var items=[]
                var name=itemTemplate.info[prop][j]
                if(data.hasOwnProperty(name)){
                    for(var k=0;k<data[name].length;k++){
                        var moreInfoItem=JSON.parse(JSON.stringify(template[view].items[prop][name]))
                        moreInfoItem=convertRow(moreInfoItem,data[name][k])
                        items.push(moreInfoItem)
                    }
                }
                if(items.length>0){
                    moreInfo.push({
                        header:name,
                        description:items
                    })
                }
            }
            itemTemplate.info[prop]=moreInfo
        }else{
            itemTemplate.info[prop]=convertRow(itemTemplate.info[prop],data)
        }
    } 

    if(data.hasOwnProperty("listings")){
        for(var prop in data.listings){
            var section=[]
            listingStats[prop]=0
            for(var j=0;j<data.listings[prop].length;j++){
                var sectionItem=template[view].items.hasOwnProperty(prop)?JSON.parse(JSON.stringify(template[view].items[prop])):JSON.parse(JSON.stringify(template[view].items.section))
                var index=data.listings[prop][j].id
                var values=data.listings[prop][j].values
                if(listings.hasOwnProperty(index)&&(["inactivejobs"].indexOf(prop)>-1||!listings[index].inactive)){
                    listingStats[prop]+=1;
                    for(var _prop in values){
                        listings[index][_prop]=values[_prop]  
                    }
                    for(var _prop in sectionItem){
                        if(_prop=="id"||_prop=="readonly"){
                            sectionItem[_prop]=listings[index][_prop]
                        }else if(_prop=="action"){
                            if(template[view].items[_prop].hasOwnProperty(prop)){
                                sectionItem[_prop]=template[view].items[_prop][prop](action,{itemid:data.id,id:index,readonly:data.readonly,itemreadonly:listings[index].readonly})
                            }
                        }else{
                            sectionItem[_prop]=convertRow(sectionItem[_prop],listings[index])
                        }
                    }
                    listingIndex.push(listings[index].id)
                    section.push(sectionItem)
                }
            }
            itemTemplate.section[prop]=section  
        }
    }
    
    for(var j=0;j<itemTemplate.options.length;j++){
        if(itemTemplate.options[j].name=="updated"){
            var today=new Date() 
            var lastupdate=new Date(data[itemTemplate.options[j].name])
            var lastupdate_date=(today.valueOf()-lastupdate.valueOf())/24/60/60/1000
            
            if(!data[itemTemplate.options[j].name]){                
                itemTemplate.options[j].content=0
            }else if(lastupdate_date<=10){
                itemTemplate.options[j].content=Math.floor(lastupdate_date)
            }else{
                itemTemplate.options[j].content=dateFormat(lastupdate)
                itemTemplate.options[j].name="updatedat"
            }
        }else{
            itemTemplate.options[j].content=listingStats.hasOwnProperty(itemTemplate.options[j].name)?listingStats[itemTemplate.options[j].name]:(!!data[itemTemplate.options[j].name]?data[itemTemplate.options[j].name]:0)                
        } 
    }
    
    return {data:itemTemplate,listingIndex:listingIndex}
}

function convertRow(row,dataSet){
    for(var x=0;x<row.length;x++){
        for(var y=0;y<row[x].length;y++){
            var value=row[x][y]
            var parameters={}
            var _parameter={}
            if(Array.isArray(value)){
                if(value[0]=="workexperience"){
                    if(dataSet.hasOwnProperty("workexperience")&&dataSet["workexperience"].length>0){
                        parameters['position']={}
                        _parameter=parameters['position']
                        if(!!dataSet[value[0]][0].position){
                            parameters['position'].position=dataSet[value[0]][0].position
                        }
                        if(!!dataSet[value[0]][0].organization){
                            parameters['position'].organization=dataSet[value[0]][0].organization
                        }
                    }
                }else{
                    parameters[value[0]]={}
                    _parameter=parameters[value[0]]
                    for(var z=0;z<value.length;z++){
                        if(Number(dataSet[value[z]])>1000){
                            Number(dataSet[value[z]])/1000
                            parameters[value[0]][value[z]]=String(Number(dataSet[value[z]])/1000)+"K"
                        }else if(!!dataSet[value[z]]){
                            parameters[value[0]][value[z]]=dataSet[value[z]]
                        }
                    }
                }
                if(Object.keys(_parameter).length>1){
                    row[x][y]=parameters
                }else if(Object.keys(_parameter).length>0){
                    row[x][y]=_parameter[Object.keys(_parameter)[0]]
                }else{
                    row[x][y]=""
                }
            }else{
                switch(value){
                    case "tag":
                    case "email":
                    case "phone":
                    case "updated":
                        var parameter={}
                        parameter[value]=dataSet[value]
                        if(value=="tag"&&!!parameter[value]){
                            parameter[value]=parameter[value].join(", ")
                        }
                        row[x][y]=parameter
                        break;
                    default:
                        row[x][y]=(!!dataSet[value]?dataSet[value]:"")
                        break;
                }
            }
        }
        row[x]=row[x].filter(function(v){
            return !!v
        })
    }
    
    return row
}