import { connect } from 'react-redux'
import {newItem} from '../../actions/toggleModal/toggleModal.action'
import mainAction from '../../components/mainAction/mainAction.component'
import { bindActionCreators } from 'redux'

function mapStateToProps(state){
    return {
        view:state.data.view,
        i18n:state.language.i18n,
    }
}

function mapDispatchToProps(dispatch){
    return {
        newItem:bindActionCreators(newItem, dispatch),
    }
}

const ShowMainAction = connect(
  mapStateToProps,
  mapDispatchToProps
)(mainAction)

export default ShowMainAction