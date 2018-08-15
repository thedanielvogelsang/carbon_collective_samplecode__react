import {LOGIN_USER, USER_INFO} from './types' ;
import {get, post} from '../api_client'


export const loginUser = (loginData) => dispatch => {
  const sessionsPath = `login`
  post(sessionsPath, loginData)
    .then(
      data => dispatch({
        type: LOGIN_USER,
        payload: data
      })
    )
    .then(
      data => {return data.payload}
    )
    .catch(
      error => { return error }
    )
}

export function fetchUserData(id) {
  return function(dispatch) {
    const path = 'api/v1/users/' + id
    get(path)
      .then(
        data => dispatch({
          type: USER_INFO,
          payload: data
        })
      )
      .catch(error => console.log())
  }
}
