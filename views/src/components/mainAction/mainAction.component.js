var React = require('react');
var ReactDOM = require('react-dom')
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader} from 'semantic-ui-react'

const mainAction=function(state){
    var view=state.view
    var newItem=state.newItem
    var i18n=state.i18n
    var action={
        jobs:i18n.t("mainaction.newjob"),
        candidates:i18n.t("mainaction.newcandidate"),
        clients:i18n.t("mainaction.newclient"),
        workgroups:i18n.t("mainaction.newworkgroup") 
    }
    
    return(
        <Menu vertical header inverted color={"red"}>
            <Menu.Item name={action[view]} onClick={newItem.bind(this,{view:view})}/>
        </Menu>    
    )
}

export default mainAction
