export const handleSearchChange=function(value){
    return {
        type:"ITEM_RESULT_CHANGE",
        value:value.value,
        search:value.search,
        exclude:value.exclude,
        excludeReadOnly:value.excludeReadOnly
    }
}


export const addListing=function(value){
    return {
        type:"ADD_LISTING",
        id:value.id,
        listing:value.listing,
        toid:value.toid
    }
}

export const changeListing=function(value){
    return {
        type:"CHANGE_LISTING",
        itemid:value.itemid,
        id:value.id,
        listing:value.listing,
        tolisting:value.tolisting,
    }
}