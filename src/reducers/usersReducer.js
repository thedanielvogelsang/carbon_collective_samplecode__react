import {LOGIN_USER, LOGOUT_USER, USER_INFO, DASH_INFO, CATCH_ERROR, CLEAR_ERROR, CLEAR_HOUSE} from '../actions/types' ;

const initialState = {
  user_id: null,
  house_id: null,
  data: [],
  dash_data: [],
  resource_type: 'carbon',
  color: 'rgb(121,194,120)',
}

const usersReducer = (state = initialState, action) => {
  switch(action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user_id: action.payload.slug,
        data: action.payload
      }
    case LOGOUT_USER:
      return state = initialState;
    case USER_INFO:
      let house;
      action.payload.household ? house = action.payload.household.id : house = null
      return {
        ...state,
        house_id: house,
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
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }
    case CLEAR_HOUSE:
      return {
        ...state,
        house_id: null
      }
    default:
      return state;
  }
}

export default usersReducer;
