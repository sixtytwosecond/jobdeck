var dataIndex={}
var propIndex={}
var currentIndex={}

export const changeView = function(view){
    currentIndex=propIndex[view.slice(0,-1)]
}

export const indexData = function(data){
    propIndex={}
    dataIndex={}
    var view=["job","candidate","client","workgroup"]
    var indexProp=["position","company","organization","tag","website","contact","firstname","lastname","othername","name",
                   "description"]
    for(var props in data){
        var type=props.split(":")[0]
        if(view.indexOf(type)>-1&&!data[props].inactive){
            if(!dataIndex.hasOwnProperty(type)){
                dataIndex[type]=[]
            }
            
            if(!propIndex.hasOwnProperty(type)){
                propIndex[type]={}
            }
            var itemIndex=[]
            for(var _props in data[props]){
                if(indexProp.indexOf(_props)>-1){                    
                    var title=''
                     switch(type){
                        case "job":
                            title=data[props].position
                            break;
                        case "candidate":
                            title=data[props].firstname+" "+data[props].lastname
                            break;
                        case "client":
                            title=data[props].organization
                            break;
                        case "workgroup":
                            title=data[props].name
                            break;
                    }
                    
                    var index=JSON.stringify(data[props][_props])
                    index=index.replace(/\"\w+\":/g,"")
                    index=index.replace(/\[|\{|\"|\}|\]/g,"")
                    itemIndex=itemIndex.concat(index.split(","))

                    if(["position","company","organization","tag","website","firstname",
                        "lastname","othername"].indexOf(_props)>-1){
                        if(!propIndex[type].hasOwnProperty(_props)){
                            propIndex[type][_props]=[]
                        }
                        propIndex[type][_props]=propIndex[type][_props].concat(index.replace(/\s/g,",").split(","))
                    }
                }
            } 
            dataIndex[type].push({
                id:data[props].id,
                title:title,
                index:itemIndex,
                readonly:data[props].readonly
            })
        }
    }
}

var defaultState={
    isLoading:false,
    results:[],
    value:'',
    selectedValues:[],
    filter:'',
    globalValue:'',
    globalResults:{},
    itemValues:'',
    itemResults:{}
}

function filter(state,action){
    state=state||defaultState
    var nextState=Object.assign({},state)
    switch(action.type){
        case "SELECT_FILTERING":
            nextState.filter=action.filter
            return nextState
            break;
        case "RESULT_SELECT":
            nextState.value=""
            nextState.selectedValues.push(action.value)
            return nextState
            break;
        case "RESULT_CHANGE":
            nextState.results=[]
            nextState.value=action.value
            var value=action.value.replace(/\W/g,"")
            var v=new RegExp(value,"i");
            for(var props in currentIndex){
                for(var i=0;i<currentIndex[props].length;i++){
                    if(v.test(currentIndex[props][i])){
                        nextState.results.push({title:props+":"+currentIndex[props][i]})
                    }
                }
            }
            return nextState
            break;
        case "DELETE_VALUES":
            var index=nextState.selectedValues.indexOf(action.value)
            if(index>-1){
                nextState.selectedValues.splice(index,1)
            }
            return Object.assign({},nextState,{selectedValues:nextState.selectedValues})
            break;
        case "CLEAR_VALUES":
            return Object.assign({},nextState,{selectedValues:[],value:''})
            break;
        case "GLOBAL_RESULT_CHANGE":
            nextState.globalResults={}
            nextState.globalValue=action.value
            var value=action.value.replace(/(?!\,|\s)\W/g,"")
            var searchValue=value.split(",")
            var regValue=value.replace(/\,(?=\w)|\,\s(?=\w)/,"|")

            for(var props in dataIndex){
                var results=[]
                for(var j=0;j<dataIndex[props].length;j++){
                    var t=searchValue.every(function(v){
                        var r=new RegExp(v,"i");
                        return r.test(dataIndex[props][j].index)
                    })
                    
                    if(t){
                        var description=dataIndex[props][j].index.filter(function(v){
                            var r=new RegExp(regValue,"i");
                            return r.test(v)
                        }).join(", ")
                        
                        results.push({
                            id:dataIndex[props][j].id,
                            title:dataIndex[props][j].title,
                            description:description
                        })
                    }
                }
                if(results.length>0){
                    nextState.globalResults[props]={
                        name:props,
                        results:results
                    }
                }
            }
            return nextState
            break;    
        case "ITEM_RESULT_CHANGE":
            nextState.itemResults={}
            nextState.itemValues=action.value||""
            if(!!nextState.itemValues){
                var excludeItems=action.exclude||[]
                var excludeReadOnly=action.excludeReadOnly||false
                var value=action.value.replace(/(?!\,|\s)\W/g,"")
                var searchValue=value.split(",")
                var regValue=value.replace(/\,(?=\w)|\,\s(?=\w)/,"|")
                for(var props in dataIndex){
                    if(action.search.indexOf(props)>-1){
                        var results=[]
                        for(var j=0;j<dataIndex[props].length;j++){
                            var t=searchValue.every(function(v){
                                var r=new RegExp(v,"i");
                                return r.test(dataIndex[props][j].index)&&excludeItems.indexOf(dataIndex[props][j].id)==-1&&
                                    (excludeReadOnly?!dataIndex[props][j].readonly:true)
                            })

                            if(t){
                                var description=dataIndex[props][j].index.filter(function(v){
                                    var r=new RegExp(regValue,"i");
                                    return r.test(v)
                                }).join(", ")

                                results.push({
                                    id:dataIndex[props][j].id,
                                    title:dataIndex[props][j].title,
                                    description:description
                                })
                            }
                            if(results.length>0){
                                nextState.itemResults[props]={
                                    name:props,
                                    results:results
                                }
                            }
                        }
                    }
                }
            }
            return nextState
            break;   
        default:
            return state
    }
}
    
export default filter