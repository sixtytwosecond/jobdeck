export const selectFiltering=function(filter){
    return {
        type:"SELECT_FILTERING",
        filter:filter
    }
}

export const handleResultSelect=function(e,result){
    return {
        type:"RESULT_SELECT",
        value:result.title
    }
}

export const handleSearchChange=function(e){
    return {
        type:"RESULT_CHANGE",
        value:e.target.value
    }
}

export const deleteValue=function(value){
    return {
        type:"DELETE_VALUES",
        value:value
    }
}

export const clearAll=function(){
    return {
        type:"CLEAR_VALUES",
    }
}
