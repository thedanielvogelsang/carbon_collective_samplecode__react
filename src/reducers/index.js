import {combineReducers} from 'redux';
import userReducer  from './usersReducer';

const rootReducer = combineReducers({
  userInfo: userReducer
})


export default rootReducer;
