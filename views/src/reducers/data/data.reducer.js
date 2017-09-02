import {indexData,changeView} from '../../reducers/filters/filter.reducer'
var defaultState={
    view:'',
    reminders:[],
    items:{},
    _items:{},
    tagOptions:{},
    changeId:0,
    newChange:{},
    listings:{}
}

function indexing(data){
    indexData(data.items)
    changeView(data.view)
    var viewType={
        job:"jobs",
        candidate:"candidates",
        client:"clients",
        workgroup:"workgroups"
    }
    
    var listings={}
    for(var prop in data.items){
        var type=prop.split(":")[0]
        if(Object.keys(viewType).indexOf(type)>-1){
            if(!listings.hasOwnProperty(viewType[type])){
                listings[viewType[type]]=[]
            }
            var item=data.items[prop]
            var itemListing={}
            
            if(item.hasOwnProperty("itemid")&&data.items.hasOwnProperty(item.itemid)){
                for(var _prop in data.items[item.itemid]){
                    if(!item.hasOwnProperty(_prop)&&["listings","inactive","dataReady","listingsReady","activejobs","inactivejobs"].indexOf(_prop)==-1){
                        item[_prop]=data.items[item.itemid][_prop]
                    }
                }
            }
            
            if(item.hasOwnProperty("listings")){
                for(var props in item.listings){
                    for(var j=0;j<item.listings[props].length;j++){
                        var id=item.listings[props][j].id
                        itemListing[id]=data.items[id]
                    }
                }
            } 
            listings[viewType[type]].push({item:item,listings:itemListing})
        }
    }
    return listings
}

function setChange(obj,access,data,options){
    options=options||{}
    if(access.length>1){
        var currentAccess=access.shift()
        if(!obj.hasOwnProperty(currentAccess)){
            if(options.nonewlayer){
                return
            }else{
                obj[currentAccess]={}
            }
        }
        setChange(obj[currentAccess],access,data,options)
    }else{
        if(options.remove){
            if(Array.isArray(obj[access[0]])){
                var index=obj[access[0]].indexOf(data)
                obj[access[0]].splice(index,1) 
            }
        }else if(options.changevalue){
            obj[access[0]]=data
        }else{
            if(!obj.hasOwnProperty(access[0])){
                obj[access[0]]=[]
            }
            obj[access[0]].unshift(data)
        }
    }
}

function setListingsItem(obj,id,listings,toid,options){
    options=options||{}
    if(!obj[id]["listings"].hasOwnProperty(listings)){
        obj[id]["listings"][listings]=[]
    }
    var item=obj[id]["listings"][listings]
    var list=item.map(function(v){
        return v.id
    })
    var index=list.indexOf(toid)
    if(options.remove){
        if(index>-1){
            item.splice(index,1)
        }
    }else if(options.changevalue){
        if(index>-1){
            item[index].values=options.values
        }
    }else{
        item.unshift({
            id:toid,
            values:{}
        })   
    }
}

function data(state,action){
    state=state||defaultState
    var nextState=Object.assign({},state)
    switch(action.type){
        //=========== FETCH DATA ===========// 
        case "FETCH_LISTINGS":
            var listings_data=require("../../data/listings_layout.js")
            nextState.reminders=listings_data.reminders
            nextState.items=listings_data.items
            nextState.tagOptions=listings_data.tagOptions
            nextState.view='jobs'
            nextState.changeId+=1
            nextState.listings=indexing(nextState)
            return nextState
            
        case "FETCH_ONE":
            console.log("FETCH_ONE",action.id)
            return state
           
        case "FETCH_ONE_LISTING":
            console.log("FETCH_ONE_LISTING",action.id,action.index,action.panel)
            return state
            
        //=========== FETCH DATA ===========// 
            
        //=========== DATA ===========// 
        case "ADD_LISTING":
            if(nextState.items[action.toid].hasOwnProperty("listingsReady")&&nextState.items[action.toid].listingsReady){
                setListingsItem(nextState.items,action.toid,action.listing,action.id)
                setListingsItem(nextState.items,action.toid,action.listing,action.id,{changevalue:true,values:{updated:new Date()}})
            }
            
            if(nextState.items[action.id].hasOwnProperty("listingsReady")&&nextState.items[action.id].listingsReady){
                setListingsItem(nextState.items,action.id,action.listing,action.toid)
                setListingsItem(nextState.items,action.id,action.listing,action.toid,{changevalue:true,values:{updated:new Date()}})
            }
            setChange(nextState.newChange,[action.toid,action.listing,"add"],action.id)
            
            nextState.listings=indexing(nextState)
            console.log(nextState.newChange)
            nextState.changeId+=1
            return nextState
        case "CHANGE_LISTING":    
            if(!!action.id){
                if(nextState.items[action.id].hasOwnProperty("listingsReady")&&nextState.items[action.id].listingsReady){
                    setListingsItem(nextState.items,action.id,action.listing,action.itemid,{remove:true})
                    if(!!action.tolisting){
                        setListingsItem(nextState.items,action.id,action.tolisting,action.itemid)
                        setListingsItem(nextState.items,action.id,action.tolisting,action.itemid,{changevalue:true,values:{updated:new Date()}})
                    }
                }
                if(action.tolisting=="inactivejobs"){
                    nextState.items[action.id].inactive=true
                }else if(action.tolisting=="activejobs"){
                    nextState.items[action.id].inactive=false
                }
            }
            
            if(nextState.items[action.itemid].hasOwnProperty("listingsReady")&&nextState.items[action.itemid].listingsReady){
                setListingsItem(nextState.items,action.itemid,action.listing,action.id,{remove:true})
                if(!!action.tolisting){
                    setListingsItem(nextState.items,action.itemid,action.tolisting,action.id)
                    setListingsItem(nextState.items,action.itemid,action.tolisting,action.id,{changevalue:true,values:{updated:new Date()}})
                }
            }

            setChange(nextState.newChange,[action.itemid,action.listing,"remove"],action.id)
            if(!!action.tolisting){
                setChange(nextState.newChange,[action.itemid,action.tolisting,"add"],action.id)
            }
            console.log(nextState.items)
            nextState.listings=indexing(nextState)
            console.log(nextState.newChange)
            nextState.changeId+=1
            return nextState
        case "ADD_ENTITY":
            var target=action.target.split("-")
            var section=target[1]
            var itemTemplate={}
            itemTemplate.fieldid="field:"+Math.round((Math.random())*10000)
            
            if(!nextState.items.hasOwnProperty(action.id)){
                nextState.newChange[action.id]={
                    newlisting:true
                }
                nextState.items[action.id]={
                    newitem:true,
                    id:action.id
                }
            }
            
            setChange(nextState.items,[action.id,section],itemTemplate)
            setChange(nextState.items,[action.id,"updated"],new Date(),{changevalue:true})
            setChange(nextState.newChange,[action.id,"add"],itemTemplate.fieldid)
            
            console.log(nextState.newChange)
            nextState.changeId+=1
            return nextState
        case "REMOVE_ENTITY":
            var target=action.target.split("-")
            var fieldID=target[0]
            var section=target[1]
            var index=target[2]
            
            setChange(nextState.items,[action.id,section],fieldID,{remove:true})
            setChange(nextState.items,[action.id,"updated"],new Date(),{changevalue:true})

            if(nextState.newChange[action.id].hasOwnProperty("add")&&nextState.newChange[action.id]["add"].indexOf(fieldID)>-1){
                setChange(nextState.newChange,[action.id,"add"],fieldID,{remove:true,nonewlayer:true})
            }else{
                setChange(nextState.newChange,[action.id,"remove"],fieldID)
            }
            
            console.log(nextState.newChange)
            nextState.changeId+=1
            return nextState
        case "EDIT_ENTITY":
            var target=action.target.split("-")
            var fieldID=target[0]
            var section=target[1]
            var index=target[2]
            var fieldName=target[3]
            var _fieldName=target[4]
            var value=action.value
            
            var path=[action.id,fieldName]
            var newChangePath=[action.id,fieldName]
            if(!!fieldID){
                path=[action.id,section,index,fieldName]
                newChangePath=[action.id,fieldID,fieldName]
            }
            
            if(!!_fieldName){
                path.push(_fieldName)
                newChangePath.push(_fieldName)
            }
            
            if(!nextState.items.hasOwnProperty(action.id)){
                nextState.newChange[action.id]={
                    newlisting:true
                }
                nextState.items[action.id]={
                    newitem:true,
                    id:action.id
                }
            }
            
            setChange(nextState.items,path,value,{changevalue:true})
            setChange(nextState.items,[action.id,"updated"],new Date(),{changevalue:true})
            setChange(nextState.newChange,newChangePath,value,{changevalue:true})
            
            console.log(nextState.newChange,nextState.items[action.id])
            nextState.changeId+=1
            return nextState
        case "CHANGE_TAG":
            var target=action.target
            var value=action.value
            
            nextState.tagOptions[target].push(value)
            
            if(!nextState.newChange.hasOwnProperty("tagOptions")){
                nextState.newChange.tagOptions={}
            }

            if(!nextState.newChange.tagOptions.hasOwnProperty(target)){
                nextState.newChange.tagOptions[target]=[]
            }
            
            nextState.newChange.tagOptions[target].push(value)
           
            nextState.changeId+=1
            return nextState
        //=========== DATA ===========// 
            
        //=========== REMINDER ===========// 
        case "COMPLETE_REMINDER":
            if(!!nextState.reminders[action.id]){
                nextState.reminders[action.id].isCompleted=!nextState.reminders[action.id].isCompleted
            }
            return nextState
        case "ADD_REMINDER":
            nextState.reminders.unshift(
                {
                    id:Math.round(Math.random()*100000),
                    content:"",
                    date:"",
                    isCompleted:false
                }
            )
            nextState.changeId+=1
            return nextState
        case "REMOVE_REMINDER":
            if(!!nextState.reminders[action.id]){
                nextState.reminders.splice(action.id,1)
            }
            nextState.changeId+=1
            return nextState
        case "EDIT_REMINDER":
            if(!!nextState.reminders[action.id]){
                for(var props in action.value){
                    if(["content","date"].indexOf(props)>-1){
                        nextState.reminders[action.id][props]=action.value[props]
                    }
                }
            }
            nextState.changeId+=1
            return nextState
        //=========== REMINDER ===========// 
            
        //=========== VIEW ===========// 
        case "TOGGLE_VIEW":
            changeView(action.view)
            nextState.view=action.view
            return nextState
        //=========== VIEW ===========// 
            
        //=========== INDEX ===========// 
        case "REINDEX":
            if(Object.keys(nextState.newChange).length>0){
                if(!!action.id){
                    
                }else{
                    nextState.listings=indexing(nextState)
                }
            }
            return nextState    
        //=========== INDEX ===========// 
            
        default:
            return state
            
    }
}
    
export default data