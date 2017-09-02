var i18next=require('i18next');
var languagepack=require("../../data/languagepack")
var languagepack=JSON.parse(JSON.stringify(languagepack))

i18next.init({
    lng:'en',
    resources:languagepack,
    parseMissingKeyHandler: function(key) { return null }
})

var defaultState={
    i18n:i18next,
    languagepack:languagepack
}

function language(state,action){
    state=state||defaultState
    var nextState=Object.assign({},state)
    switch(action.type){
        case "CHANGE_LANGUAGE":
            nextState.i18n.init({
                lng: action.language,
                resources:nextState.languagepack
            })
            return nextState
            break;
        case "ADD_LANGUAGE_PACK":
            if(!nextState.languagepack.hasOwnProperty(action.language)){
                nextState.languagepack[action.language]=action.languagepack
            }
            return nextState
            break;
        default:
            return state
    }
}
    
export default language