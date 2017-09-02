export const setCompleted=function(id){
    return {
        type:"COMPLETE_REMINDER",
        id:id
    }
}

export const addReminder=function(){
    return {
        type:"ADD_REMINDER",
    }
}

export const editReminder=function(id,value){
    return {
        type:"EDIT_REMINDER",
        id:id,
        value:value
    }
}

export const removeReminder=function(id){
    return {
        type:"REMOVE_REMINDER",
        id:id,
    }
}

