import { connect } from 'react-redux'
import {toggleView,handleSearchChange} from '../../actions/menu/menu.action'
import {viewItem} from '../../actions/toggleModal/toggleModal.action'
import menu from '../../components/menu/menu.component'
import { bindActionCreators } from 'redux'

function mapStateToProps(state){
    return {
        view:state.data.view,
        value:state.filter.globalValue,
        results:state.filter.globalResults
    }
}

function mapDispatchToProps(dispatch){
    return {
        toggleView:bindActionCreators(toggleView, dispatch),
        viewItem:bindActionCreators(viewItem, dispatch),
        handleSearchChange:bindActionCreators(handleSearchChange, dispatch),
    }
}

const ShowMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(menu)

export default ShowMenu