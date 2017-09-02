export const viewItem=function(value){
    return {
        type:"VIEW_ITEM",
        id:value.id,
    }
}

export const newItem=function(value){
    return {
        type:"NEW_ITEM",
        id:value.id,
        view:value.view,
    }
}

export const toggleModal=function(){
    return {
        type:"CLOSE_ITEM",
    }
}

export const changeEntity=function(value){
    var type="REMOVE_ENTITY"
    if(value.action=="add"){
        type="ADD_ENTITY"
    }
    return {
        type:type,
        id:value.id,
        target:value.target
    }
}

export const editEntity=function(value){
    return {
        type:"EDIT_ENTITY",
        target:value.target,
        id:value.id,
        value:value.value,
    }
}

export const changeTag=function(value){
    return {
        type:"CHANGE_TAG",
        target:value.target,
        value:value.value
    }
}

export const handleSearchChange=function(value){
    return {
        type:"ITEM_RESULT_CHANGE",
        value:value.value,
        search:value.search,
        exclude:value.exclude,
        excludeReadOnly:value.excludeReadOnly
    }
}