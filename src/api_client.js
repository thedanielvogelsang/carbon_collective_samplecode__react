const host = 'https://carboncollective.herokuapp.com'
// const host = 'http://localhost:3000'

const token = process.env.REACT_APP_XCRF_TOKEN

function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }
  return response.text().then(text => {
    const error = JSON.parse(text)
    return Promise.reject({ ...error, status: response.status })
  })
}

export function get(path) {
  return fetch(`${host}/${path}`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': `${host}`,
      'X-CC-TOKEN': `${token}`
    },
  }).then(handleResponse)
}

export function post(path, data) {
  return fetch(`${host}/${path}`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': `${host}`,
      'X-CC-TOKEN': `${token}`
    },
  }).then(handleResponse)
}

export function put(path, id, data) {
  if(id === undefined){
    return fetch(`${host}/${path}`, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `${host}`,
        'X-CC-TOKEN': `${token}`
      },
    }).then(handleResponse)
  }else{
    return fetch(`${host}/${path}/${id}`, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `${host}`,
        'X-CC-TOKEN': `${token}`
      },
    }).then(handleResponse)
  }
}

export function destroy(path) {
  return fetch(`${host}/${path}`, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': `${host}`,
      'X-CC-TOKEN': `${token}`
    }
  }).then(handleResponse)
}
