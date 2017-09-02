import { connect } from 'react-redux'
import {fetchOneListing} from '../../actions/data/data.action'
import {handleSearchChange,addListing,changeListing} from '../../actions/listings/listings.action'
import {viewItem} from '../../actions/toggleModal/toggleModal.action'
import Listings from '../../components/listings/listings.component'
import { bindActionCreators } from 'redux'

function mapStateToProps(state){
    var view=state.data.view
    var itemResults=state.filter.itemResults
    var itemValues=state.filter.itemValues
    var listings=state.data.listings[view]||[]
    var showListings=[]
    var i18n=state.language.i18n
    var selectedValues=state.filter.selectedValues||[]
    var filter=state.filter.filter||""
    
    var filteredListing=listings.filter(function(v){
        var filteredListings=selectedValues.map(function(_v){
            var value=_v.split(":")
            var filterValue=new RegExp(value[1],"i")
            return filterValue.test(JSON.stringify(v.item[value[0]]))
        })
        
        return filteredListings.every(function(_v){
            return _v==true
        })&&!v.item.inactive 
    })
    
    var sortedListing=filteredListing.sort(function(a,b){
        if(filter=="updated"){
            return new Date(b.item[filter]).valueOf()-new Date(a.item[filter]).valueOf()
        }else{
            return (!!filter?(b.item[filter]-a.item[filter]):true)
        }
    })
    
    return {
        listings:sortedListing,
        view:view,
        i18n:i18n,
        itemResults:itemResults,
        itemValues:itemValues
    }
}

function mapDispatchToProps(dispatch){
    return {
        viewItem:bindActionCreators(viewItem, dispatch),
        addListing:bindActionCreators(addListing, dispatch),
        changeListing:bindActionCreators(changeListing, dispatch),
        fetchOneListing:bindActionCreators(fetchOneListing, dispatch),
        handleSearchChange:bindActionCreators(handleSearchChange, dispatch),
    }
}

const ShowListings = connect(
  mapStateToProps,
  mapDispatchToProps
)(Listings)

export default ShowListings