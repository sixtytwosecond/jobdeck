import { connect } from 'react-redux'
import {toggleModal,changeEntity,editEntity,changeTag,handleSearchChange} from '../../actions/toggleModal/toggleModal.action'
import {fetchOne,reindex} from '../../actions/data/data.action'
import modalView from '../../components/toggleModal/toggleModal.component'
import { bindActionCreators } from 'redux'

function mapStateToProps(state){
    var modal=state.toggleModal
    var items=state.data.items
    var dataReady=modal.newlisting?true:(items.hasOwnProperty(modal.id)&&(items[modal.id].dataReady||items[modal.id].newitem))
    var data=items[modal.id]||{}
    var tagOptions=state.data.tagOptions
    var itemResults=state.filter.itemResults

    return {
        activeModal:modal.activeModal,
        dataReady:dataReady,
        newlisting:modal.newlisting,
        data:data,
        view:modal.view,
        id:modal.id,
        i18n:state.language.i18n,
        tagOptions:tagOptions,
        itemResults:itemResults
    }
}

function mapDispatchToProps(dispatch){
    return {
        toggleModal:bindActionCreators(toggleModal, dispatch),
        fetchOne:bindActionCreators(fetchOne, dispatch),
        changeEntity:bindActionCreators(changeEntity, dispatch),
        editEntity:bindActionCreators(editEntity, dispatch),
        changeTag:bindActionCreators(changeTag, dispatch),
        reindex:bindActionCreators(reindex, dispatch),
        handleSearchChange:bindActionCreators(handleSearchChange, dispatch),
    }
}

const ShowModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(modalView)

export default ShowModal