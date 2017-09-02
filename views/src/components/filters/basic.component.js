var React = require('react');
var ReactDOM = require('react-dom')
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader,Search} from 'semantic-ui-react'
import {template} from '../listings/template.component'

module.exports = React.createClass({
    getInitialState: function(){
        return {
            filter:"updated",
        }
    },
    
    selectFilter:function(value){
        this.setState({filter:value})
        this.props.selectFilter(value)
    },
    
    render:function(){
        var selectFilter=this.selectFilter
        var filter=this.state.filter
        var view=this.props.view
        var i18n=this.props.i18n
        var options=[]
        if(!!view){
            options=template[view].template.options.map(function(v){
                return (<Menu.Item name={i18n.t("common.item."+v.name)} active={filter==v.name} onClick={selectFilter.bind(this,v.name)}/>)
            })
        }
        return(
            <div>
                <p>{i18n.t("common.item.sortby")}</p>
                <Menu vertical>
                    {options}
                </Menu>
            </div>
            )
    }
})
//                    <Menu.Item name={i18n.t("common.item.none")} active={filter==""} onClick={selectFilter.bind(this,"")}/>
