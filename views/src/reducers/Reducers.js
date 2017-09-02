import { combineReducers } from 'redux'
import data from './data/data.reducer'
import toggleModal from './toggleModal/toggleModal.reducer'
import filter from './filters/filter.reducer'
import language from './language/language.reducer'


export const Reducers = combineReducers({
    toggleModal,
    data,
    filter,
    language,
})

export default Reducers