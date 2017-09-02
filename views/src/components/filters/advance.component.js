var React = require('react');
var ReactDOM = require('react-dom')
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader,Search} from 'semantic-ui-react'

module.exports = React.createClass({
    getInitialState: function(){
        return {
            selectedValues:[],
        }
    },
    
    componentWillReceiveProps:function(nextProps){
        this.setState({selectedValues:nextProps.selectedValues})
    },
    
    componentDidMount: function(){
        this.setState({selectedValues:this.props.selectedValues})
    },
    
    deSelectValues:function(v){
        this.props.deleteValue(v)
        this.setState({selectedValues:this.props.selectedValues})
    },
    
    clearValues:function(){
        this.props.clearAll()
    },
    
    render:function(){
        var isLoading=this.props.isLoading
        var searchIndex=this.props.searchIndex
        var handleResultSelect=this.props.handleResultSelect
        var handleSearchChange=this.props.handleSearchChange
        var results=this.props.results
        var value=this.props.value
        var deSelectValues=this.deSelectValues
        var clearValues=this.clearValues
        var Selected=this.state.selectedValues.map(function(v){
            var value=v.split(":")
            return(
                <span className={"filter-value"} onClick={deSelectValues.bind(this,v)}>
                    <strong>{value[0]}</strong>{":"+value[1]}
                    <Icon size="large" className="filter-remove" name="remove circle"/>
                </span>
            )
        })
        return(
            <Accordion>
                <Accordion.Title>
                  <Button basic>Advanced Search</Button>
                </Accordion.Title>
                <Accordion.Content>
                  <Segment.Group>
                        <Segment>
                            <Search 
                                className={"search-bar"}
                                selectFirstResult
                                loading={isLoading}
                                onResultSelect={handleResultSelect.bind(this)}
                                onSearchChange={handleSearchChange.bind(this)}
                                results={results}
                                value={value}
                                />
                        </Segment>
                        <Segment className="selectedValue-segment">
                            {Selected}
                        </Segment>
                    </Segment.Group>
                </Accordion.Content>
            </Accordion>
            )
    }
})
