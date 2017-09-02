var React = require('react');
var ReactDOM = require('react-dom')
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader,Search} from 'semantic-ui-react'

const menu=function(state){
    var view=state.view
    var toggleView=state.toggleView
    var results=state.results
    var value=state.value
    var handleSearchChange=state.handleSearchChange
    
    function toggleModal(e,result){
        state.viewItem({id:result.id})
    }
    
    return(
        <Menu borderless secondary>
            <Menu.Item name='Jobs' active={view === 'jobs'} onClick={toggleView.bind(this,"jobs")} />
            <Menu.Item name='Candidates' active={view === 'candidates'} onClick={toggleView.bind(this,"candidates")} />
            <Menu.Item name='Clients' active={view === 'clients'} onClick={toggleView.bind(this,"clients")} />
            <Menu.Item name='Workgroups' active={view === 'workgroups'} onClick={toggleView.bind(this,"workgroups")} />    
        
            <Menu.Item position='right'>
                 <Search 
                    category={true}
                    selectFirstResult={true}
                    onResultSelect={toggleModal.bind(this)}
                    onSearchChange={handleSearchChange.bind(this)}
                    results={results}
                    value={value}
                    />

                <Menu icon borderless secondary>
                    <Menu.Item name='inbox' active={view === 'inbox'} onClick={toggleView.bind(this,"inbox")}>
                      <Icon name='inbox' />
                    </Menu.Item>

                    <Menu.Item name='user' active={view === 'user'} onClick={toggleView.bind(this,"user")}>
                      <Icon name='user' />
                    </Menu.Item>
                </Menu>
            </Menu.Item>
        </Menu>
    )
}

export default menu
