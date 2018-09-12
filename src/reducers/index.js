import {combineReducers} from 'redux';
import userReducer  from './usersReducer';
import { routerReducer } from 'react-router-redux'
import {timerReducer} from './timerReducer';

const rootReducer = combineReducers({
  userInfo: userReducer,
  routing: routerReducer,
  timer: timerReducer,
})


export default rootReducer;
