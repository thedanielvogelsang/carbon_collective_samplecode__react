import React, {Component} from 'react';
import {get, put} from '../../api_client';
import 'font-awesome/css/font-awesome.min.css';

function updateUser(user) {
  var date = new Date()
  var last_updated = new Date(user.last_updated)
  if(date.getMonth() !== last_updated.getMonth()){
    return true
  }else if(date.getDate() - last_updated.getDate() > 1){
    return true
  }else{
    return false
  }
}

const userRanks = function(users, org_id, resType, hId){
  const userList = users.map((user, n) => {
    user = calculateRankNumber(user, n, resType, hId)
    const img = arrowDirection(user, n)
    if(user.id === Number(org_id)){
      return  (<li className="highlighted-user-row" key={user.id}>
                  <ul className='house-user-list'>
                    <li className="house-user-rank">#{n + 1}</li>
                    <li className="house-user-arrow">{img}</li>
                    <li id={user.id} className="house-user-name">{user.first} {user.last}</li>
                    <li className="house-user-score">{user.avg_monthly_consumption}</li>
                  </ul>
                </li>
              )
    }
    return (  <li id={user.id} className="ranked-user-row" key={user.id}>
                <ul className='house-user-list'>
                  <li className="house-user-rank">{n + 1}</li>
                  <li className="house-user-arrow">{img}</li>
                  <li id={user.id} className="house-user-name">{user.first} {user.last}</li>
                  <li className="house-user-score">{user.avg_monthly_consumption}</li>
                </ul>
             </li>
           )
  })
  return userList
}

function calculateRankNumber(user, n, resType, hId){
  n += 1;
  let update = updateUser(user);
  let region = "House";
  const path = 'api/v1/users/' + user.id + '/' + resType;
  if(user.rank === n && update){
    user.arrow = null;
    let userData = {
      user: user,
      region_type: region,
      region_id: hId
    }
    put(path, undefined, userData)
      .then(data => console.log('success'))
      .catch(error => console.log(error))
    return user;
  }
  else if(user.rank === null){
    user.rank = n;
    let userData = {
      user: user,
      region_type: region,
      region_id: hId
    }
    put(path, undefined, userData)
      .then(data => data)
      .catch(error => console.log(error))
    return user
  }
  else if(user.rank > n){
    user.rank = n;
    user.arrow = true;
    let userData = {
      user: user,
      region_type: region,
      region_id: hId
    }
    put(path, undefined, userData)
      .then(data => console.log(data))
      .catch(error => console.log(error))
    return user
  }else if(user.rank < n){
    user.rank = n;
    user.arrow = false
    let userData = {
      user: user,
      region_type: region,
      region_id: hId
    }
    put(path, undefined, userData)
      .then(data => console.log(data))
      .catch(error => console.log(error))
    return user
  }else{
    return user
  }
}

function arrowDirection(u, n){
  if(u.arrow === null){
    return(
      <p>--</p>
    )
  }else if(u.arrow === true){
    return(
      <i className="fa fa-angle-up"></i>
    )
  }else{
    return(
      <i className="fa fa-angle-down"></i>
    )
  }
}

class HouseUsersBoards extends Component{
  constructor(props){
    super(props);
    this.state ={
      loading: true,
      ids: props.users,
      user_id: props.user_id,
      house_id: props.house_id,
    }
  }
  componentDidMount(){
    console.log(this.props)
    this.loadUsers()
  }

  setUsers(data){
    this.setState({
      users: data,
      loading: false,
    })
  }

  loadUsers(){
    let resourceType = this.props.resType
    let id = this.state.house_id
    let path = `api/v1/houses/${id}/users?resource=${resourceType}`
    get(path)
      .then(data => this.setUsers(data))
      .catch(error => console.log(error))
  }

  render(){
    let loading = this.state.loading;
    return(
      <div>
          <h1>
          </h1>
          <div className="house-rankings-div">
          <h4>House Rankings<span className="metric-house-rankings">({this.props.metric}/day)</span></h4>
          {loading ? null : userRanks(this.state.users, this.state.user_id, this.props.resType, this.props.house_id )}
          </div>
      </div>
    )
  }
}

export default HouseUsersBoards;
