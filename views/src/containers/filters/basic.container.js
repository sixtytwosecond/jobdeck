import { connect } from 'react-redux'
import {selectFiltering} from '../../actions/filters/filter.action'
import BasicFilters from '../../components/filters/basic.component'
import { bindActionCreators } from 'redux'


function mapStateToProps(state){
    return {
        view:state.data.view,
        i18n:state.language.i18n
    }
}

function mapDispatchToProps(dispatch){
    return {
        selectFilter:bindActionCreators(selectFiltering, dispatch),
    }
}

const ShowBasicFilters = connect(
  mapStateToProps,
  mapDispatchToProps
)(BasicFilters)

export default ShowBasicFilters