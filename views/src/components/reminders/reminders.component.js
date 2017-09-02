var React = require('react');
var ReactDOM = require('react-dom')
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader,Search} from 'semantic-ui-react'
var Reminder=require("./reminder.component.js")

module.exports = React.createClass({
    getInitialState: function(){
        return {
            reminders:[],
            isRemove:false
        }
    },
    
    componentDidMount: function(){
        this.setState({reminders:this.props.reminders})
    },
    
    componentWillReceiveProps:function(nextProps){
        this.setState({reminders:nextProps.reminders})
    },
    
    onAddReminder:function(){
        this.props.addReminder()
        this.setState({reminders:this.props.reminders})
    },
    
    onRemoveReminder:function(id){
        this.props.removeReminder(id)
        this.setState({reminders:this.props.reminders})
        this.setState({isRemove:!this.state.isRemove})
    },
    
    toggleRemove:function(){
        this.setState({isRemove:!this.state.isRemove})
    },
    
    render:function(){
        var self=this
        var reminders=this.state.reminders
        var setCompleted=this.props.setCompleted
        var onAddReminder=this.onAddReminder
        var onRemoveReminder=this.onRemoveReminder
        var editReminder=this.props.editReminder
        var toggleRemove=this.toggleRemove
        var isRemove=this.state.isRemove
        var content=reminders.map(function(v,i){
            return <Reminder id={i} content={v.content} date={v.date} isCompleted={v.isCompleted} setCompleted={setCompleted} editReminder={editReminder} isRemove={isRemove} removeReminder={onRemoveReminder}/>
        })
        
        return(
            <div>
                <p>REMINDER</p>
                <Segment.Group className="reminder-segment">
                    <Segment className="reminder-menu">
                         <Grid>
                            <Grid.Row columns={1} >
                                <Grid.Column width={12}>
                                    <Button basic circular compact active={""} size="mini" icon='plus' onClick={onAddReminder}/>
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <Button basic circular compact active={""} size="mini" icon='minus' onClick={toggleRemove} />
                                </Grid.Column>
                             </Grid.Row>
                        </Grid>
                    </Segment>
                    {content}
                </Segment.Group>
            </div>
        )
    }
})
