var defaultState={
    view:'jobs',
}

function toggleView(state,action){
    state=state||defaultState
    var nextState=Object.assign({},state)
    switch(action.type){
        case "CHANGE_VIEW":
            nextState.view=action.view
            return nextState
        default:
            return state
    }
}
    
export default toggleView