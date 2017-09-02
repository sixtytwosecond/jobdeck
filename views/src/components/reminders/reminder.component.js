var React = require('react');
var ReactDOM = require('react-dom')
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader,Search,TextArea} from 'semantic-ui-react'
import InfiniteCalendar from 'react-infinite-calendar';

module.exports = React.createClass({
    getInitialState: function(){
        return {
            content:"",
            date:new Date(),
            isCompleted:false,
            calendar:false,
        }
    },
    
    componentWillReceiveProps:function(nextProps){
        var self=this
        var contentChanged=this.state.content!==nextProps.content
        var dateChanged=this.state.date!==nextProps.date
        var isCompletedChanged=this.state.isCompleted!==nextProps.isCompleted
        
        if(contentChanged||dateChanged||isCompletedChanged){
            self.setState({content:nextProps.content})
            self.setState({date:nextProps.date})
            self.setState({isCompleted:nextProps.isCompleted})
        }
    },
    
    
    componentDidMount: function(){
        this.setState({content:this.props.content})
        this.setState({date:this.props.date})
        this.setState({isCompleted:this.props.isCompleted})
    },

    handleInput:function(e){
        console.log(e.target.value)
        var content={}
        content[e.target.name]=e.target.value
        this.setState(content)
    },
    
    handleDate:function(value){
        var self=this
        if(new Date(self.state.date).valueOf()!==new Date(value).valueOf()){
            self.setState({date:value})
            self.submitInput()
        }
    },
    
    handleCompleted:function(){
        var self=this
        if(self.props.isRemove){
            self.props.removeReminder(self.props.id)
        }else{
            self.props.setCompleted(this.props.id)
            self.setState({isCompleted:!this.state.isCompleted}) 
        }
        
    },
    
    toggleCalendar:function(value){
        var self=this
        if(!!value){
            self.setState({calendar:value})
        }else{
            self.setState({calendar:!self.state.calendar})
        }
    },
    
    removeDate:function(value){
        this.setState({date:""})
        this.submitInput()
    },
    
    submitInput:function(){
        console.log("submit Input")
        var data={}
        data.date=this.state.date
        data.content=this.state.content
        this.props.editReminder(this.props.id,data)
    },
    
    render:function(){
        var id=this.props.id
        var isRemove=this.props.isRemove
        var content=this.state.content
        var selectedDate=(new Date(this.state.date))||(new Date())
        var formattedDate=!!this.state.date?(selectedDate.getDate()+"-"+(selectedDate.getMonth()+1)+"-"+selectedDate.getFullYear()):""
        var isCompleted=this.state.isCompleted
        var handleCompleted=this.handleCompleted
        var handleKeyDown=this.handleKeyDown
        var handleInput=this.handleInput
        var submitInput=this.submitInput 
        var toggleCalendar=this.toggleCalendar
        var handleDate=this.handleDate
        var removeDate=this.removeDate
        var calendar=this.state.calendar
        var isExpired=(new Date()).valueOf()-selectedDate.valueOf()>0
        
        return(
            <Segment>
                <Grid>
                    <Grid.Row columns={2} >
                        <Grid.Column width={12}>
                            <List>
                                <List.Item as='a'>
                                  <List.Content>
                                      <List.Header>
                                          <TextArea as='textarea' type="text" name="content" value={content} 
                                               className={"reminder-list"+
                                                            (isCompleted?" reminder-text-completed":(isExpired?" reminder-text-expired":""))} 
                                                onChange={handleInput.bind(this)}
                                                onBlur={submitInput.bind(this)}
                                                disabled={isExpired||isCompleted} autoHeight/>
                                      </List.Header>
                                    <List.Description className={(isCompleted?" reminder-text-completed":(isExpired?" reminder-text-expired":""))}>
                                        <span><Icon name="calendar" onClick={toggleCalendar.bind(this,null)}/></span>
                                        <span onClick={toggleCalendar.bind(this,null)}>{formattedDate}</span>
                                        <span><Icon name="remove" className={!!formattedDate&&!isCompleted?"reminder-icon-remove":"isDisabled"} onClick={removeDate.bind(this,null)}/></span>
                                        <span onBlur={toggleCalendar.bind(this,false)}>
                                            <InfiniteCalendar
                                                className={(calendar&&!isCompleted?"":" isDisabled")}
                                                width={360}
                                                height={230}
                                                selected={selectedDate}
                                                min={new Date()}
                                                minDate={new Date()}
                                                autoFocus={false}
                                                onSelect={function(selected){
                                                    handleDate(selected)
                                                }}
                                                displayOptions={{showHeader:false}}
                                                theme={{
                                                    accentColor: '#448AFF',
                                                    floatingNav: {
                                                        background: 'rgba(56, 87, 138, 0.94)',
                                                        chevron: '#FFA726',
                                                        color: '#FFF',
                                                    },
                                                    headerColor: '#448AFF',
                                                    selectionColor: '#559FFF',
                                                    textColor: {
                                                        active: '#FFF',
                                                        default: '#333',
                                                    },
                                                    todayColor: '#FFA726',
                                                    weekdayColor: '#559FFF',
                                                }}
                                              />
                                        </span>
                                    </List.Description>
                                  </List.Content>
                                </List.Item>
                            </List>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Button circular compact toggle active={""} size="mini" 
                                icon={isRemove?'remove':'checkmark'} 
                                className={isRemove?"reminder-icon-remove-reminder":("reminder-icon"+(isCompleted?" reminder-icon-completed":(isExpired?" reminder-icon-expired":"")))}
                                onClick={handleCompleted.bind(this)}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        )
    }
})
