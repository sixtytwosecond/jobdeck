import { connect } from 'react-redux'
import {setCompleted,addReminder,editReminder,removeReminder} from '../../actions/reminders/reminders.action'
import { bindActionCreators } from 'redux'
import Reminders from '../../components/reminders/reminders.component'

function mapStateToProps(state){
    var reminders=state.data.reminders
    return {
        reminders:reminders,
    }
}

function mapDispatchToProps(dispatch){
    return {
        setCompleted:bindActionCreators(setCompleted, dispatch),
        addReminder:bindActionCreators(addReminder, dispatch),
        removeReminder:bindActionCreators(removeReminder, dispatch),
        editReminder:bindActionCreators(editReminder, dispatch),
    }
}

const ShowReminders = connect(
  mapStateToProps,
  mapDispatchToProps
)(Reminders)

export default ShowReminders