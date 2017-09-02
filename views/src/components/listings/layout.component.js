var React = require('react');
var ReactDOM = require('react-dom')
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader,Item,Search,Sidebar} from 'semantic-ui-react'
import {icon,dateFormat} from '../common/common.js'
import {dataMapper} from './dataMapping.component.js'

module.exports = React.createClass({ 

    getInitialState: function(props){
       return{
           listingIndex:[],
           item:{},
           activePanel:false,
           view:'',
           searchValue:'',
           searching:false,
           listingsReady:false,
           readonly:false,
       }
    },

    componentWillReceiveProps:function(nextProps){
        this.setData(nextProps.view,nextProps.item)
        if(this.state.view!==nextProps.view){
            this.setState({view:nextProps.view})
            this.setState({activePanel:false})
        }
    },
    
    componentDidMount: function(){
        this.setData(this.props.view,this.props.item)
        this.setState({view:this.props.view})
    },
    
    togglePanel:function(view){
        var self=this
        if(view==self.state.activePanel){
            self.setState({activePanel:""})
        }else{
            self.setState({activePanel:view})
        }
    },
    
    setData:function(view,data){
        var action={
            viewItem:this.props.viewItem,
            changeListing:this.props.changeListing
        }
        var item=dataMapper(view,action,data)
        this.setState({item:item.data})
        this.setState({listingIndex:item.listingIndex})
        this.setState({listingsReady:data.item.listingsReady})
        this.setState({readonly:data.item.readonly||false}) 
    },
     
    handleSearchChange:function(e,value){
        this.setState({searchValue:value})
        var activePanel=this.state.activePanel
        var option=this.state.item.options.filter(function(v){
            return v.name==activePanel
        })
        var search=option[0].search
        var excludeReadOnly=(option[0].excludeReadOnly||false)||((option[0].excludeReadOnlyIfShared||false)&&this.state.readonly)
        this.props.handleSearchChange({value:value,search:search,exclude:this.state.listingIndex,
                                       excludeReadOnly:excludeReadOnly})
    },
    
    resetSearchValue:function(){
        this.setState({searchValue:""})
    },
    
    addListing:function(e,value){
        var toid=this.state.item.info.id
        this.props.addListing({id:value.id,listing:this.state.activePanel,toid:toid})
    },

    render: function(){  
        var self=this
        var activePanel=self.state.activePanel
        var togglePanel=self.togglePanel
        var viewItem=self.props.viewItem
        var addListing=self.props.addListing
        var fetchOneListing=self.props.fetchOneListing
        var item=self.state.item
        var i18n=self.props.i18n
        var handleSearchChange=self.handleSearchChange
        var resetSearchValue=self.resetSearchValue
        var itemResults=self.props.itemResults
        var view=self.state.view
        var addListing=self.addListing
        var searchValue=self.state.searchValue
        var listingsReady=self.state.listingsReady
        var readonly=self.state.readonly
        
        if(Object.keys(item).length>0){
            return(
                <Segment className="large-padding-bottom" >
                    <Grid>
                        <RenderInfo info={item.info} viewItem={viewItem} fetchOneListing={fetchOneListing} i18n={i18n} readonly={readonly}/>
                        <RenderOptions options={item.options} activePanel={activePanel} togglePanel={togglePanel} i18n={i18n} readonly={readonly}/>
                        <RenderSections view={view} info={item.info} options={item.options} listings={item.section} activePanel={activePanel} viewItem={viewItem} addListing={addListing} fetchOneListing={fetchOneListing} itemResults={itemResults} handleSearchChange={handleSearchChange}i18n={i18n} resetSearchValue={resetSearchValue} searchValue={searchValue} listingsReady={listingsReady}/>
                    </Grid>
                </Segment>
            )
        }else{
            return null
        }
    }
})


var RenderInfo=React.createClass({
    render:function(){
        var info=this.props.info
        var viewItem=this.props.viewItem
        var readonly=this.props.readonly
        var fetchOneListing=this.props.fetchOneListing
        var i18n=this.props.i18n

        return(
            <Grid.Row columns={1} className="small-padding">
                <Grid.Column width={16}>
                    <Accordion>
                        <Accordion.Title>
                            <List>
                                <List.Item>
                                    <List.Header as='h4'>
                                        {info.header.map(function(v){
                                            return (<RenderRow row={v} style={["thick-font-weight","large-padding-left secondary-font"]} i18n={i18n}/>)
                                        })}
                                        {readonly?(<span className={"large-margin-left message-tag"}>{i18n.t("common.messagetag.readonly")}</span>):""}
                                    </List.Header>
                                    
                                    <List.Description as='p'>
                                        {info.description.map(function(v){
                                            return (<RenderRow row={v} style={["","secondary-font large-padding-left"]} i18n={i18n}/>)
                                        })}
                                    </List.Description>
                 
                                </List.Item>
                                
                                {info.meta.map(function(v){
                                    return (
                                        <List.Item className="secondary-font">
                                            <RenderRow row={v} style={["","secondary-font large-padding-left"]} i18n={i18n}/>
                                        </List.Item>)
                                })}
                            </List>
                        </Accordion.Title>
                        <Accordion.Content>
                            <RenderMoreInfo info={info} viewItem={viewItem} fetchOneListing={fetchOneListing} i18n={i18n} readonly={readonly}/>
                        </Accordion.Content>
                    </Accordion>
                </Grid.Column>
            </Grid.Row>    
        )
    }
})

var RenderMoreInfo=React.createClass({ 
    render:function(){
        var info=this.props.info        
        var viewItem=this.props.viewItem
        var readonly=this.props.readonly
        var fetchOneListing=this.props.fetchOneListing
        var i18n=this.props.i18n
        var links=[]
        var content=[]
        
        if(info.hasOwnProperty("links")){
            links=info.links.map(function(v){
                return (<List.Item>
                            <RenderRow row={v} style={["","secondary-font small-padding-left"]} i18n={i18n}/>
                        </List.Item>)
            })
        }        
        
        if(info.hasOwnProperty("moreInfo")){
            for(var i=0;i<info.moreInfo.length;i++){
                var moreInfo=info.moreInfo[i]      
                var items=[]
                for(var j=0;j<moreInfo.description.length;j++){                    
                    var item=moreInfo.description[j].map(function(v,k){
                        return (<List.Item>
                                    <RenderRow row={v} style={[(k==0?"thick-font-weight":""),"secondary-font small-padding-left"]} i18n={i18n}/>
                                </List.Item>)
                    })
                    
                    items.push(<List>{item}</List>)   
                }
                
                
                content.push(
                    <Table.Row>
                        <Table.Cell width="4" verticalAlign={"top"}><p className={"secondary-font"}>{i18n.t("layout.listings."+moreInfo.header)}</p></Table.Cell>
                        <Table.Cell className="semi-secondary-font">
                            {items}
                        </Table.Cell>
                    </Table.Row>
                )
            }
        }   
        
        return (
            <Table basic='very' className={"large-padding-left"}>
                <Table.Body>
                    <Table.Row>
                        <List>
                            <List.Item>
                                <span onClick={viewItem.bind(this,{id:info.id})} className={"text-option"}>
                                    <Icon name={"file text outline"} />
                                    <span className={"small-padding-left"}>{i18n.t("layout.info.showDetail")}</span>
                                </span>
                            </List.Item>
                            {links}
                        </List>
                    </Table.Row>
                    {content}
                </Table.Body>
            </Table>
        )
    }
})

var RenderOptions=React.createClass({
    render:function(){
        var numOfColumn=4
        var options=this.props.options
        var activePanel=this.props.activePanel
        var togglePanel=this.props.togglePanel
        var i18n=this.props.i18n        
        var readonly=this.props.readonly
        var content=[]        
        
        options=options.filter(function(v){
            return (v.hasOwnProperty('isOwnerOption')&&v.isOwnerOption)?!readonly:true
        })
        
        for(var i=0;i<numOfColumn;i++){
            var column=[]
            for(var j=i;j<options.length;j+=numOfColumn){
                var option=options[j]
                column.push(
                    <List.Item className="secondary-font small-padding-left" onClick={(option.isOption?togglePanel.bind(this,option.name):"")}>
                        <List.Content className={option.isOption?("text-option"+(activePanel==option.name?" activePanel":"")):""}>
                            <Icon name={icon[option.name]} className={"large-padding-right "+(Number(option.content)>0?" step-icon-active":"")}/>

                            {!!i18n.t("layout.options.header."+option.name)?(<span className="mini-padding-right">{i18n.t("layout.options.header."+option.name)}</span>):null}

                            <strong >{option.content}</strong>

                            {!!i18n.t("layout.options.footer."+option.name,{count:option.content})?(<span className="small-padding-left">{i18n.t("layout.options.footer."+option.name,{count:option.content})}</span>):null}
                        </List.Content>
                    </List.Item>
                )
            }
            
            content.push(
                <Grid.Column width={numOfColumn}>
                    <List>
                        {column}
                    </List>
                </Grid.Column>            
            )            
        }
        
        return (
            <Grid.Row className="no-padding-top secondary-font">
                {content}
            </Grid.Row>
        )
    }
})

var RenderSections=React.createClass({
    render:function(){
        var self=this
        var view=this.props.view
        var activePanel=this.props.activePanel
        var listings=this.props.listings
        var optionsIndex=this.props.options.map(function(v){return v.name}).indexOf(activePanel)
        var showSearch=optionsIndex>-1&&this.props.options[optionsIndex].hasOwnProperty("search")
        var viewItem=this.props.viewItem
        var fetchOneListing=this.props.fetchOneListing
        var addListing=this.props.addListing
        var info=this.props.info
        var i18n=this.props.i18n
        var itemResults=this.props.itemResults
        var handleSearchChange=this.props.handleSearchChange
        var resetSearchValue=this.props.resetSearchValue
        var searchValue=this.props.searchValue
        var listingsReady=this.props.listingsReady        
        
        var searchBar=showSearch&&listingsReady?(<Search placeholder={i18n.t("layout.placeholder.addnew")} category value={searchValue} onBlur={resetSearchValue.bind(this)} icon={"plus"} onSearchChange={handleSearchChange.bind(this)} onResultSelect={addListing.bind(this)} results={itemResults} selectFirstResult/>):""

        var content;
        if(!!activePanel){
            if(listingsReady){
                content=[]
                listings=listings[activePanel]||[]
                for(var i=0;i<listings.length;i++){
                    var listing=listings[i]
                    var header=listing.header.map(function(v){
                        return(
                            <RenderRow row={v} style={["thick-font-weight","secondary-font small-padding-left"]} i18n={i18n}/>
                        )
                    })
                    
                    header.push(<Icon name="folder open outline" className="text-option large-padding-left" onClick={viewItem.bind(this,{id:listing.id})}/>)

                    if(listing.readonly){
                        header.push(<span className={"large-margin-left message-tag"}>{i18n.t("common.messagetag.readonly")}</span>)
                    }
                    
                    var description_left=listing.description_left.map(function(v){
                        return(<div>
                            <RenderRow row={v} style={["","large-padding-left secondary-font"]} i18n={i18n}/>
                        </div>)
                    })

                    var description_right=listing.description_right.map(function(v){
                        return(<div>
                            <RenderRow row={v} style={["","secondary-font"]} i18n={i18n}/>
                        </div>)
                    })
                    content.push(
                        <Table.Row>
                            <Table.Cell>
                                <Header>
                                    <Header.Content>
                                        <Header.Subheader>
                                            <h4>{header}</h4>
                                        </Header.Subheader>
                                        <Header.Subheader className="secondary-font">
                                            <List.Description as='p'>
                                                {description_left}
                                            </List.Description>
                                        </Header.Subheader>
                                    </Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell className="secondary-font">
                                {description_right}
                            </Table.Cell>
                            <Table.Cell>
                                {listing.action.length>0?(<Dropdown text={i18n.t("layout.listings.action")} floating labeled button className='icon color-red' options={listing.action} />):""}
                            </Table.Cell>
                        </Table.Row>
                    )
                }
            }else{
                fetchOneListing({id:info.id,panel:activePanel})
                content=(
                    <Table.Row>
                        <Segment className="loader-segment">
                            <Dimmer active inverted>
                                <Loader>{i18n.t("common.loading")}</Loader>
                            </Dimmer>
                            <img src="./images/placeholder.png"/>
                        </Segment>
                    </Table.Row>
                )       
            }
        }
        
        return(
            <Accordion fluid>
                <Accordion.Title active={false}></Accordion.Title>
                <Accordion.Content active={!!activePanel}>
                    <Grid.Row columns={1} className="large-padding">
                        <Grid>
                            <Grid.Row columns={1}>
                                <Grid.Column width={5} className={"ailgn-center"}>
                                    <p className="secondary-font">{i18n.t("layout.listings.header."+view+"."+activePanel,{count:listings.length})}</p>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {searchBar}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Table basic='very'>
                            <Table.Body>
                                {content}
                            </Table.Body>
                        </Table>
                    </Grid.Row>
                </Accordion.Content>
            </Accordion> 
        )    
    }
})

var RenderRow=React.createClass({
    render:function(){
        var row=this.props.row
        var style=this.props.style
        var i18n=this.props.i18n
        var item=[]
        
        for(var i=0;i<row.length;i++){
            var value=row[i]            
            
           if(typeof value=="object"){
                for(var prop in value){
                    switch(prop){
                        case "firstname":
                        case "currency":
                        case "position":
                            item.push(
                                <span className={!!style?style[i==0?0:1]:''}>{i18n.t("layout.listings."+prop,value[prop])}</span>
                            )
                            break; 
                        case "updated":
                            var today=new Date()
                            var lastupdate=new Date(value[prop])
                            var lastupdate_date=(today.valueOf()-lastupdate.valueOf())/24/60/60/1000
                            if(lastupdate_date<=10){
                                item.push(
                                    <span className={!!style?style[i==0?0:1]:''}>{i18n.t("layout.listings.updated",{count:Math.floor(lastupdate_date)})}</span>
                                )
                            }else{
                                item.push(
                                    <span className={!!style?style[i==0?0:1]:''}>{i18n.t("layout.listings.updatedat")+dateFormat(lastupdate)}</span>
                                )
                            }
                            break;
                        default:
                            var linkProp=new RegExp(/http|:\/\/|www\.|\.com/)
                            var isLink=linkProp.test(value[prop])                            
                            
                            if(isLink){
                                item.push(<span className={!!style?style[i==0?0:1]:''}><Icon name={!!icon[prop]?icon[prop]:icon["website"]}/><a className={"small-padding-left"} href={value[prop]}>{value[prop]}</a></span>)
                            }else{
                                item.push(<span className={!!style?style[i==0?0:1]:''}><Icon className={"small-padding-right"} name={!!icon[prop]?(!!value[prop]?icon[prop]:""):"file text outline"}/>{value[prop]}</span>)
                            }                            
                            break;
                    }
                }
            }else{
                item.push(<span className={!!style?style[i==0?0:1]:''}>{value}</span>)
            }
        }
        return (<span>{item}</span>)
    }
})
