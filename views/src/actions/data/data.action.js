export const fetchListing=function(){
    return {
        type:"FETCH_LISTINGS",
    }
}

export const fetchOne=function(id){
    return {
        type:"FETCH_ONE",
        id:id
    }
}

export const fetchOneListing=function(value){
    return {
        type:"FETCH_ONE_LISTING",
        id:value.id,
        index:value.index,
        panel:value.panel
    }
}

export const reindex=function(id){
    return {
        type:"REINDEX",
        id:id
    }
}
