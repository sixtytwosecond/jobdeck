var defaultState={
    activeModal:false,
    id:'',
    view:'',
    action:'',
    readOnly:false,
    newlisting:false
}

function toggleModal(state,action){
    state=state||defaultState
    var nextState=Object.assign({},state)
    nextState.activeModal=!state.activeModal
    nextState.id=action.id||''
    nextState.view=action.view||''
    nextState.newlisting=false
    
    switch(action.type){
        case "VIEW_ITEM":
            return nextState
        case "NEW_ITEM":
            nextState.id=action.view.slice(0,-1)+":"+Math.round((Math.random())*10000)
            nextState.newlisting=true
            return nextState
        case "CLOSE_ITEM":
            return nextState
        default:
            return state
    }
}
    
export default toggleModal