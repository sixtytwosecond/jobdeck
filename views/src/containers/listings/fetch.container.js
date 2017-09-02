import React from 'react'
import { connect } from 'react-redux'
import {fetchListing} from '../../actions/data/data.action'
import { bindActionCreators } from 'redux'

function mapDispatchToProps(dispatch){
    return {
        fetchListing:bindActionCreators(fetchListing, dispatch)
    }
}

const Fetching=connect(null,mapDispatchToProps)(fetching)

function fetching(state){
    console.log(state)
    return(
        <div className={"testing-block"} onClick={state.fetchListing}>
        </div>
    )
}



export default Fetching