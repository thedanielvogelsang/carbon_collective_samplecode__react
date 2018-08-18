import {combineReducers} from 'redux';
import userReducer  from './usersReducer';
import { routerReducer } from 'react-router-redux'


const rootReducer = combineReducers({
  userInfo: userReducer,
  routing: routerReducer
})


export default rootReducer;
