var React = require('react');
var ReactDOM = require('react-dom')
var ModalView=require("./modalView.component")
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader} from 'semantic-ui-react'

const modalView=function(state){
    if(!state.dataReady&&!!state.id){
        state.fetchOne(state.id)
    }
    
    function toggleModal(){
        state.toggleModal()
        state.reindex()
    }
    
    return(
        <Modal size="fullscreen" dimmer open={state.activeModal} onClose={toggleModal}>
            <Dimmer active={!state.dataReady}>
                <Loader>Loading</Loader>
                <img src="./images/placeholder.png"/>
            </Dimmer>
            
            {state.dataReady?(<ModalView newlisting={state.newlisting} data={state.data} view={state.view} id={state.id} i18n={state.i18n} changeEntity={state.changeEntity} editEntity={state.editEntity} changeTag={state.changeTag} tagOptions={state.tagOptions} handleSearchChange={state.handleSearchChange} itemResults={state.itemResults}/>):null}
            
        </Modal>    
    )
}

export default modalView
