var React = require('react');
var ReactDOM = require('react-dom')
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader,TextArea,Item,Select,Checkbox} from 'semantic-ui-react'
import {icon} from '../common/common.js'
import {Editor, EditorState,RichUtils,Draft,convertToRaw,convertFromRaw,ContentState,convertFromHTML,CompositeDecorator} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {decorator} from './draftjs.component.js'
var RenderField=require('./renderField.component.js')
import {dataMapper} from './dataMapping.component.js'

module.exports = React.createClass({ 
    getInitialState: function(){
        return {
            id:"",
            view:"",
            data:{},
            isEdit:false,
            items:[],
            readonly:false
        }
    },
    
    componentWillReceiveProps:function(nextProps){
        this.setData({
            id:nextProps.id,
            view:nextProps.view,
            data:nextProps.data,
        })
    },
    
    componentDidMount: function(){
        this.setData()
    },
    
    setData:function(value){
        value=value||{
            id:this.props.id,
            view:this.props.view,
            data:this.props.data,
        }
        var mappedData=dataMapper(value)
        this.setState({items:mappedData.items})
        this.setState({data:mappedData.data})
        this.setState({id:value.id})
        this.setState({view:value.view})
        this.setState({readonly:value.data.readonly||false})
    },
    
    toggleEdit:function(){
        this.setState({isEdit:!this.state.isEdit})
    },
    
    editEntity:function(e){
        this.props.editEntity({id:this.props.id,target:e.target.name,value:e.target.value})
    },
    
    changeEntity:function(event,data){
        this.props.changeEntity({id:this.props.id,target:data.name,action:data.text.toLowerCase()})
        this.setData()
    },
    
    changeTag:function(e){
        this.props.changeTag(e)
    },
    
    render: function(){  
        var data=this.state.data
        var view=this.props.view
        var id=this.props.id
        var editEntity=this.editEntity
        var changeTag=this.changeTag
        var changeEntity=this.changeEntity
        var i18n=this.props.i18n
        var isEdit=this.state.isEdit
        var toggleEdit=this.toggleEdit
        var tagOptions=this.props.tagOptions
        var editEntity=this.editEntity
        var items=this.state.items
        var readonly=this.state.readonly
        var handleSearchChange=this.props.handleSearchChange
        var itemResults=this.props.itemResults
        
        if(Object.keys(data).length>0){
            return(
                <Segment className="" >
                    <Grid>
                        <RenderHeader data={data} view={view} editEntity={editEntity} i18n={i18n} isEdit={isEdit} 
                            toggleEdit={toggleEdit} readonly={readonly} tagOptions={tagOptions} changeTag={changeTag} handleSearchChange={handleSearchChange} itemResults={itemResults}/>
                        <RenderInfo data={data} view={view} editEntity={editEntity} i18n={i18n} isEdit={isEdit} tagOptions={tagOptions} changeTag={changeTag} handleSearchChange={handleSearchChange} itemResults={itemResults}/>
                        <RenderSections data={data} view={view} editEntity={editEntity} i18n={i18n} isEdit={isEdit} tagOptions={tagOptions} changeTag={changeTag} changeEntity={changeEntity} items={items} handleSearchChange={handleSearchChange} itemResults={itemResults}/>
                    </Grid>
                </Segment>
            )
        }else{
            return null
        }
    }
})
 
var RenderHeader=React.createClass({
    render:function(){
        var data=this.props.data
        var editEntity=this.props.editEntity
        var isEdit=this.props.isEdit
        var i18n=this.props.i18n
        var toggleEdit=this.props.toggleEdit
        var readonly=this.props.readonly
        var tagOptions=this.props.tagOptions
        var changeTag=this.props.changeTag
        var handleSearchChange=this.props.handleSearchChange
        var itemResults=this.props.itemResults
        
        return (
            <Grid.Row columns={1}>
                <Grid.Column width={9}>
                    <Table basic='very' compact selectable>
                        <Table.Body>
                            {Object.keys(data.header).map(function(v,i){
                                return (
                                    <Table.Row className="selectable">
                                        <Table.Cell width="4" className={"no-border secondary-font"}>
                                            {!!icon[v]?(<Icon name={icon[v]}/>):(<p>{i18n.t("modal."+v)}</p>)}
                                        </Table.Cell>
                                        <Table.Cell className={"no-border"}>
                                            <RenderField name={v} value={data.header[v]} editEntity={editEntity} isEdit={isEdit} index={"---"} i18n={i18n} tagOptions={tagOptions} changeTag={changeTag} handleSearchChange={handleSearchChange} itemResults={itemResults}/>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={7}>
                    <Checkbox toggle label={i18n.t("modal.edit")} onClick={toggleEdit.bind(this)} disabled={readonly}/>
                    {readonly?(<span className={"large-margin-left message-tag"}>{i18n.t("common.messagetag.readonly")}</span>):""}
                </Grid.Column>
            </Grid.Row>
        )
    }
})


var RenderInfo=React.createClass({
    render:function(){
        var data=this.props.data
        var editEntity=this.props.editEntity
        var isEdit=this.props.isEdit
        var i18n=this.props.i18n
        var tagOptions=this.props.tagOptions
        var changeTag=this.props.changeTag
        return(
            <Grid.Row columns={1}>
                <Grid.Column width={4}>
                    <Table basic='very' compact selectable>
                        <Table.Body>
                            {Object.keys(data.description_left).map(function(v,i){
                                return(
                                    <Table.Row className="selectable">
                                        <Table.Cell width="4" className={"no-border secondary-font"}>
                                            {!!icon[v]?(<Icon className={"min-padding-top"} name={icon[v]}/>):(<p>{i18n.t("modal."+v)}</p>)}
                                        </Table.Cell>
                                        <Table.Cell className="no-border">
                                            <RenderField name={v} value={data.description_left[v]} editEntity={editEntity} isEdit={isEdit} index={"---"} tagOptions={tagOptions} changeTag={changeTag} i18n={i18n}/>
                                        </Table.Cell>
                                    </Table.Row>
                                )    
                            })}
                        </Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={5}>
                    <Table basic='very' compact selectable>
                        <Table.Body>
                            {Object.keys(data.description_right).map(function(v,i){
                                return(
                                    <Table.Row className="selectable">
                                        <Table.Cell width="4" className={"no-border secondary-font"} verticalAlign="top">
                                            {!!icon[v]?(<Icon className={"min-padding-top"} name={icon[v]}/>):(<p>{v}</p>)}
                                        </Table.Cell>
                                        <Table.Cell className="no-border">
                                            <RenderField name={v} value={data.description_right[v]} editEntity={editEntity} isEdit={isEdit} index={"---"} tagOptions={tagOptions} changeTag={changeTag} i18n={i18n}/>
                                        </Table.Cell>
                                    </Table.Row>
                                )    
                            })}
                        </Table.Body>
                    </Table>
                </Grid.Column>
                <Grid.Column width={7} className={"left-border"}>
                    {Object.keys(data.comment).map(function(v,i){
                        return(
                            <Table basic='very' compact selectable>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell className={"no-border"}>
                                            <p className="secondary-font">{i18n.t("modal."+v)}</p>
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row className="selectable">
                                        <Table.Cell className="no-border">
                                            <RenderField name={"note"} value={data.comment[v]} editEntity={editEntity} isEdit={isEdit} index={"---"} tagOptions={tagOptions}  changeTag={changeTag} i18n={i18n}/>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        )
                    })}
                </Grid.Column>
            </Grid.Row>
        )
    }
})
   
var RenderSections=React.createClass({    
    render:function(){
        var data=this.props.data
        var editEntity=this.props.editEntity
        var isEdit=this.props.isEdit
        var i18n=this.props.i18n
        var tagOptions=this.props.tagOptions
        var changeTag=this.props.changeTag
        var changeEntity=this.props.changeEntity
        var items=this.props.items
        
        if(data.hasOwnProperty("section")){
            var content=data.section.map(function(v,i){
                return (<RenderSection section={v} editEntity={editEntity} isEdit={isEdit} i18n={i18n} tagOptions={tagOptions} changeTag={changeTag} changeEntity={changeEntity} items={items}/>)
            })
            
            return(
                <Grid.Row columns={1}>
                    <Grid.Column width={16}>
                        <Table basic='very' selectable compact>
                            <Table.Body>
                                {content}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid.Row>
            )
        }else{
            return null
        }
    }            
})

var RenderSection=React.createClass({   
    render:function(){
        var section=this.props.section
        var i18n=this.props.i18n
        var editEntity=this.props.editEntity
        var isEdit=this.props.isEdit
        var tagOptions=this.props.tagOptions
        var changeTag=this.props.changeTag
        var changeEntity=this.props.changeEntity
        var items=this.props.items

        var header=isEdit&&items.indexOf(section.header)>-1?
            (<Dropdown className={"secondary-font "} trigger={(
                    <span>
                        {!!i18n.t("modal."+section.header)?i18n.t("modal."+section.header):""}
                    </span>)}>
                <Dropdown.Menu>
                    <Dropdown.Item name={"-"+section.header} text={i18n.t("modal.add")} onClick={changeEntity.bind(this)}/>
                </Dropdown.Menu>
            </Dropdown>):i18n.t("modal."+section.header)
        
        
        var body=section.body.map(function(v,i){
            return(
                <Table.Row className="selectable-second-layer">
                    <Table.Cell width="8"  verticalAlign="top" className="no-border">
                        <List>
                            {isEdit&&items.indexOf(section.header)>-1?
                                (<Dropdown  className={"secondary-font float-right "+(isEdit?"":"isDisabled")} 
                                trigger={(<Icon name="setting"/>)}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item name={(!!v.fieldid?v.fieldid:"")+"-"+section.header+"-"+i} text={i18n.t("modal.remove")} onClick={changeEntity.bind(this)}/>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ):""}
                            <span className={"semi-secondary-font"}>{i18n.t("modal."+v.title)}</span>
                            {Object.keys(v.description).map(function(_v){
                                return(
                                    <RenderField name={_v} value={v.description[_v]} editEntity={editEntity} isEdit={isEdit} index={(!!v.fieldid?v.fieldid:"")+"-"+section.header+"-"+i+"-"} tagOptions={tagOptions} changeTag={changeTag} i18n={i18n}/>
                                )    
                            })}
                        </List>
                    </Table.Cell>

                    <Table.Cell width="8" verticalAlign="top" className="no-border left-border">
                        <Table basic='very' selectable compact>
                            <Table.Body>
                                {!!v.comment?(Object.keys(v.comment).map(function(_v){
                                    return(
                                        <Table.Row className="selectable-third-layer">
                                            <Table.Cell width="4" className="no-border secondary-font" verticalAlign="top">
                                                {!!icon[_v]?(<Icon className={"min-padding-top"} name={icon[_v]}/>):(<p>{i18n.t("modal."+_v)}</p>)}
                                            </Table.Cell>
                                            <Table.Cell width="13" className="no-border">
                                                <RenderField name={_v} value={v.comment[_v]} editEntity={editEntity} isEdit={isEdit} index={(!!v.fieldid?v.fieldid:"")+"-"+section.header+"-"+i+"-"} tagOptions={tagOptions} changeTag={changeTag} i18n={i18n}/>
                                            </Table.Cell>
                                        </Table.Row>
                                    )    
                                })):null}
                            </Table.Body>
                        </Table>
                    </Table.Cell>
                </Table.Row>
            )
        })
        
        return(
            <Table.Row className="selectable">
                <Table.Cell width="2" verticalAlign="top" className={"border secondary-font"}>
                    <p>{header}</p>
                </Table.Cell>

                <Table.Cell width="14" className={"border no-padding-left"}>
                    <Table basic='very' selectable>
                        <Table.Body>{body}</Table.Body>
                    </Table>
                </Table.Cell>
            </Table.Row>
        )
    }
})