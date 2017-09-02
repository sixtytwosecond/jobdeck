var React = require('react');
var ReactDOM = require('react-dom')
var Layout=require("./layout.component")

import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table, Dimmer, Loader} from 'semantic-ui-react'

const Listings=function(state){
    var listings=state.listings
    if(!!listings&&listings.length>0){
        return(
            <div>
                <p>{listings.length+" "+state.i18n.t("common.item."+state.view,{count:listings.length})}</p>
                {listings.map(function(item,i){
                    return (
                        <Segment.Group>
                            <Layout index={i} view={state.view} item={item} viewItem={state.viewItem} addListing={state.addListing} fetchOneListing={state.fetchOneListing} i18n={state.i18n} itemResults={state.itemResults} handleSearchChange={state.handleSearchChange} itemValues={state.itemValues} changeListing={state.changeListing}/>
                        </Segment.Group>
                    )
                })}
            </div>
        )
    }else{
        return null
    }
}

export default Listings
