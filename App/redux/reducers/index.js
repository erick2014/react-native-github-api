
import { combineReducers } from 'redux'

//import custom reducers
import navReducer from './navigation'

const appReducer = combineReducers({
	nav: navReducer,//navigation reducer
});

export default appReducer
