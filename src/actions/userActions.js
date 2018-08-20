import {LOGIN_USER, USER_INFO, DASH_INFO, CATCH_ERROR} from './types' ;
import {BrowserRouter} from 'react-router-dom';
import {get, post} from '../api_client';


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
      data => sortLoginPageChange(data.payload)
    )
    .catch(
      error => dispatch({
        type: CATCH_ERROR,
        payload: error
      })
    )
}

export function fetchDashData(id, type) {
  return function(dispatch) {
    const path = `api/v1/users/${id}/resources?resource=${type}`
    get(path)
      .then(
        data => dispatch({
          type: DASH_INFO,
          payload: data
        })
      )
      .catch(error => console.log(error))
  }
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
      .catch(error => console.log(error))
  }
}

function sortLoginPageChange(data){
  if(!data.privacy_policy){
    setTimeout(BrowserRouter.push('/privacy-policy'), 1000)
  }else{
    // console.log(BrowserRouter)
    setTimeout(BrowserRouter.push('/dashboard'), 1000)
  }
}
