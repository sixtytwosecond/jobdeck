var React = require('react');
var ReactDOM = require('react-dom')
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader,TextArea,Item,Select,Radio,Search} from 'semantic-ui-react'
import {icon} from '../common/common.js'
import {Editor, EditorState,RichUtils,Draft,convertToRaw,convertFromRaw,ContentState,convertFromHTML,CompositeDecorator} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {decorator} from './draftjs.component.js'

module.exports =React.createClass({
    getInitialState: function(){
        return {
            editorState:EditorState.createEmpty(),
            options:[],
            optionName:'',
            currentposition:false,
            name:'',
            value:'',
        }
    },
    
    setCurrentPosition:function(){
        this.setState({currentposition:!this.state.currentposition})
    },
    
    componentWillReceiveProps:function(nextProps){
        if(this.props.isEdit==nextProps.isEdit){
            this.setOptions(nextProps.tagOptions)
            this.setContent(nextProps.name,nextProps.value)
            this.setState({name:nextProps.name})
            this.setState({value:nextProps.value})
        }
    },
    
    componentDidMount: function(){
        this.setOptions(this.props.tagOptions)
        this.setContent(this.props.name,this.props.value)
        this.setState({currentposition:!(typeof this.props.value=="object"&&this.props.value.hasOwnProperty("enddate"))})
        this.setState({name:this.props.name})
        this.setState({value:this.props.value})
    },
    
    setContent:function(name,value){
        var self=this
        if(["note","description","jobdescription","summary","reasonofleaving","requirement","jobrequirement",
            "feedback","benefit"].indexOf(name)>-1){
            value=value||""
            const blocksFromHTML = convertFromHTML(value);
            const state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
            self.setState({editorState:EditorState.createWithContent(state,decorator)})   
        }
    },
    
    setOptions:function(tagOptions){
        var self=this
        var name=this.props.name
        if(['salary','bonus','expectedannualsalary','expectedindustry','industry','tag'].indexOf(name)>-1){
            var optionName=self.state.optionName
            var options=this.state.options
            if(!optionName){
                optionName='tag'
                if(['salary','bonus','expectedannualsalary'].indexOf(name)>-1){
                    optionName='currency'
                }else if(['expectedindustry','industry'].indexOf(name)>-1){
                    optionName='industry'
                }
                self.setState({optionName:optionName})
            }
            
            if(options.length!==tagOptions[optionName].length){
                self.setState({options:tagOptions[optionName].map(function(v){
                    return ({key:v,text:v,value:v})
                })})
            }
        }
    },

    editorOnChange:function(newState){
        var self=this
        const currentContentState = this.state.editorState.getCurrentContent()
        const newContentState = newState.getCurrentContent()
        if(currentContentState!==newContentState){
            self.setState({editorState:newState})
            var e={}
            e.target={}
            e.target.name=(self.props.index||"")+self.props.name
            e.target.value=stateToHTML(newState.getCurrentContent())
            self.props.editEntity(e)
        }
    },
    
    handleKeyCommand:function(command) {
        if(command=="spilt-block"){
            const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
            if (newState) {
              this.editorOnChange(newState);
            }
        }
      },
    
    _onListClick:function(){
        this.editorOnChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
    },
    
    handleDropDown:function(event,data){
        var e={}
        e.target=data
        this.props.editEntity(e)
        this.setValue(data.name,data.value)
    },
    
    handleFocus:function(index){
        this.refs[index].focus()
    },
    
    changeTag:function(event,data){
        var v=data.value
        this.props.changeTag({target:this.state.optionName,value:v})
        this.state.options.push({key:v,text:v,value:v})
    },
    
    editEntity:function(e){
        this.props.editEntity(e)
        this.setValue(e.target.name,e.target.value)
    },
    
    setValue:function(name,value){
        var v=this.state.value
        if(typeof v=="object"&&!Array.isArray(v)){
            var name=name.split("-")
            v[name[name.length-1]]=value
        }else{
            v=value
        }
        this.setState({value:v})
    },

    onSearchChange:function(e,input){
        var currentValue=this.state.value
        currentValue.value=input
        this.props.handleSearchChange({value:input,search:currentValue.search,exclude:[currentValue.itemid]})
        this.setState({value:currentValue})
    },
    
    onResultSelect:function(e,value){
        var currentValue=this.state.value
        this.setValue("itemid",value.id)
        currentValue.value=value.title
        currentValue.itemid=value.id
        this.setState({value:currentValue})
    },
    
    render:function(){
        var self=this
        var value=this.state.value
        var name=this.state.name
        var editEntity=this.editEntity
        var isEdit=this.props.isEdit
        var editorState=this.state.editorState
        var handleKeyCommand=this.handleKeyCommand
        var editorState=this.state.editorState
        var _onListClick=this._onListClick
        var handleFocus=this.handleFocus
        var editorOnChange=this.editorOnChange
        var handleDropDown=this.handleDropDown
        var index=this.props.index||""
        var options=this.state.options
        var changeTag=this.changeTag
        var currentposition=this.state.currentposition
        var setCurrentPosition=this.setCurrentPosition
        var i18n=this.props.i18n
        var itemResults=this.props.itemResults
        var onSearchChange=this.onSearchChange
        var onResultSelect=this.onResultSelect
        var item=[]
        
        var style={
            position:"thick-font-weight",
            description:"semi-secondary-font small-padding-top",
        }

        if(typeof value!=="object"){
            switch(name){
                case "note":
                case "description":
                case "jobdescription":
                case "summary":
                case "reasonofleaving":
                case "requirement":
                case "jobrequirement":
                case "feedback":
                case "benefit":
                    item.push(<div><Icon name='unordered list' className={"no-padding "+(isEdit?"text-option":"text-option-disabled")} onClick={function(){if(isEdit){_onListClick()}}}/></div>)
                    item.push(<div className={"semi-secondary-font editor-editor "+(isEdit?"editor-edit ":"")+(!!style[name]?style[name]:"")} onClick={handleFocus.bind(this,index+name)}><Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={editorOnChange} spellCheck={isEdit} placeholder={i18n.t("modal.placeholder."+name)} stripPastedStyles={true} readOnly={!isEdit} ref={index+name}/></div>)
                    return (<div>{item}</div>)
                    
                case "email":
                    item.push(<input type="email" name={index+name} value={value} 
                             className={"full-width modal-list "+(isEdit?"modal-list-edit ":"")+(!!style[name]?style[name]:"")} onChange={editEntity.bind(this)} disabled={!isEdit}/>)
                    return (<div>{item}</div>)
                default:
                    item.push(<input type="text" name={index+name} value={value} placeholder={i18n.t("modal.placeholder."+name)} 
                             className={"full-width modal-list "+(isEdit?"modal-list-edit ":"")+(!!style[name]?style[name]:"")} onChange={editEntity.bind(this)} disabled={!isEdit}/>)
                    return (<div>{item}</div>)
            }
        }
        
        switch(name){
            case "salary":
            case "bonus":
            case "expectedannualsalary":
                item.push(<Dropdown inline compact floating className={"double-item thin-width"} name={index+name+"-currency"} options={options} onChange={handleDropDown.bind(this)} onAddItem={changeTag.bind(this)} disabled={!isEdit} trigger={(<span className={"align-baseline-middle"}>{value.currency||''}</span>)}/>)
                
                item.push(<input type="number" name={index+name+"-"+name} value={value[name]||0} className={"modal-list"+(isEdit?" modal-list-edit":"")} onChange={editEntity.bind(this)} disabled={!isEdit}/>)
                return (<div>{item}</div>)
            case "tag":
                item.push(<Dropdown search text="" name={index+name} additionLabel={<strong>Add: </strong>} allowAdditions multiple fluid icon='plus' value={value} options={options} disabled={!isEdit} onChange={handleDropDown.bind(this)} onAddItem={changeTag.bind(this)}/>)
                return (<div>{item}</div>)
                
            case "expectedindustry":
            case "industry":
                item.push(<Dropdown search text="" name={index+name} additionLabel={<strong>Add: </strong>} allowAdditions multiple fluid icon='plus' value={value} options={options} disabled={!isEdit} onChange={handleDropDown.bind(this)} onAddItem={changeTag.bind(this)}/>)
                return (<div>{item}</div>)
                
            case "period":
                item.push(<input type="date" name={index+name+"-startdate"} value={value.startdate} className={"double-item modal-list"+(isEdit?" modal-list-edit":"")} onChange={editEntity.bind(this)} disabled={!isEdit}/>)
                
                item.push(<span className={"align-super small-padding-right"}> - </span>)
                if(currentposition){
                    item.push(<span className={"double-item"}>{i18n.t("modal.present")}</span>)
                }else{
                    item.push(<input type="date" name={index+name+"-enddate"} value={value.enddate} className={"double-item modal-list"+(isEdit?" modal-list-edit":"")} onChange={editEntity.bind(this)} disabled={!isEdit}/>)
                }
                
                item.push(<Radio toggle checked={currentposition} className={(isEdit?"":"isDisabled ")+"align-bottom"} label={i18n.t("modal.currentposition")} onClick={setCurrentPosition.bind(this)}/>)
                    
                return (<div className={"semi-secondary-font"}>{item}</div>)
            case "itemid":
                if(isEdit){
                    item.push(<Search 
                        category={true}
                        selectFirstResult={true}
                        onResultSelect={onResultSelect.bind(this)}
                        onSearchChange={onSearchChange.bind(this)}
                        results={itemResults}
                        icon=""
                        className={"searchItem"}
                        value={value.value}
                        />)
                }else{
                    item.push(<span>{value.value}</span>)
                }
                return (<div>{item}</div>)
            default:
                item=Object.keys(value).map(function(v){
                    <input type="text" name={index+name+v} value={value[v]} placeholder={i18n.t("modal.placeholder"+v)} className={"modal-list mini-padding-right"+(isEdit?" modal-list-edit":"")} onChange={editEntity.bind(this)} disabled={!isEdit}/>
                })
                return (<div>{item}</div>)
        }
    }
})