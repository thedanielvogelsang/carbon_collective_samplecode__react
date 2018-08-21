import {LOGIN_USER, USER_INFO, DASH_INFO, CATCH_ERROR} from '../actions/types' ;

const initialState = {
  user_id: null,
  house_id: null,
  data: null,
  dash_data: false,
  resource_type: 'carbon',
}

const usersReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user_id: action.payload.id,
        data: action.payload
      }
    case USER_INFO:
      return {
        ...state,
        house_id: action.payload.household.id,
        data: action.payload
      }
    case DASH_INFO:
      return {
        ...state,
        dash_data: action.payload[0],
        resource_type: action.payload[1],
        color: action.payload[2]
      }
    case CATCH_ERROR:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state;
  }
}

export default usersReducer;
