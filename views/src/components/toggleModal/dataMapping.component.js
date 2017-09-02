import {template} from './template.component.js'

export const dataMapper=function(value){
    var type=(value.id).split(":")[0]
    var data=value.data
    var dataTemplate=JSON.parse(JSON.stringify(template[type].template))
    var dataItems=template[type].items
    
    for(var rows in dataTemplate){
        if(rows=="section"){
            for(var i=0;i<dataTemplate[rows].length;i++){
                var header=dataTemplate[rows][i].header
                if(dataItems.hasOwnProperty(header)){
                    var items=data[header]||[]
                    var array=[]
                    for(var j=0;j<items.length;j++){
                        var itemTemplate=JSON.parse(JSON.stringify(dataItems[header]))
                        itemTemplate.fieldid=items[j].fieldid
                        for(var props in itemTemplate.description){
                            if(typeof itemTemplate.description[props]=="object"&&
                               itemTemplate.description[props].hasOwnProperty("default")){
                               itemTemplate.description[props]=!!items[j][props]?items[j][props]:(!!data[itemTemplate.description[props].default]?data[itemTemplate.description[props].default]:"")
                            }else{
                                itemTemplate.description[props]=(!!items[j][props]?items[j][props]:itemTemplate.description[props])
                            }
                        }
                        for(var props in itemTemplate.comment){
                            itemTemplate.comment[props]=(!!items[j][props]?items[j][props]:itemTemplate.comment[props])
                        }
                        array.push(itemTemplate)
                    }
                    dataTemplate[rows][i].body=array
                }else{
                    for(var j=0;j<dataTemplate[rows][i].body.length;j++){
                        for(var props in dataTemplate[rows][i].body[j].description){
                           dataTemplate[rows][i].body[j].description[props]=(!!data[props]?data[props]:dataTemplate[rows][i].body[j].description[props])
                        }
                    }
                }
            }
        }else{
            for(var props in dataTemplate[rows]){
                if(typeof dataTemplate[rows][props]=="object"&&dataTemplate[rows][props].hasOwnProperty("default")){
                    dataTemplate[rows][props]=!!data[props]?data[props]:(!!data[dataTemplate[rows][props].default]?data[dataTemplate[rows][props].default]:"")
                }else if(props=="itemid"){
                    dataTemplate[rows][props].itemid=data[props]
                    dataTemplate[rows][props].value=data[dataTemplate[rows][props].value]
                }else{
                    dataTemplate[rows][props]=(!!data[props]?data[props]:dataTemplate[rows][props])
                }
            }
        }
    }
    return {data:dataTemplate,items:Object.keys(dataItems)}
}