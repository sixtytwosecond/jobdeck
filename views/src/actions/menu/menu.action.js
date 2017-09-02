export const toggleView=function(view){
    return {
        type:"TOGGLE_VIEW",
        view:view,
    }
}

export const handleSearchChange=function(e){
    return {
        type:"GLOBAL_RESULT_CHANGE",
        value:e.target.value
    }
}