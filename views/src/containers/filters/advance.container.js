import { connect } from 'react-redux'
import {handleResultSelect,handleSearchChange,deleteValue,clearAll} from '../../actions/filters/filter.action'
import AdvancedFilters from '../../components/filters/advance.component'
import { bindActionCreators } from 'redux'

function mapStateToProps(state){
    var filter=state.filter
    return {
        isLoading:filter.isLoading,
        results:filter.results,
        value:filter.value,
        selectedValues:filter.selectedValues,
    }
}

function mapDispatchToProps(dispatch){
    return {
        handleResultSelect:bindActionCreators(handleResultSelect, dispatch),
        handleSearchChange:bindActionCreators(handleSearchChange, dispatch),
        deleteValue:bindActionCreators(deleteValue, dispatch),
        clearAll:bindActionCreators(clearAll, dispatch),
    }
}

const ShowAdvancedFilters = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedFilters)

export default ShowAdvancedFilters