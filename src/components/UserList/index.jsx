import React, {Component} from 'react';
import {put} from '../../api_client';
import 'font-awesome/css/font-awesome.min.css';

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function singularRegion(region_name){
  switch(region_name){
    case "countries":
      return "Country";
    case "regions":
      return "Region";
    case "counties":
      return "County";
    case "neighborhoods":
      return "Neighborhood";
    case "cities":
      return "City";
    default:
      return false;
  }
}

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

class UserList extends Component{
  userList(){
    const user_id = sessionStorage.getItem('user_id')
    const userList = this.props.users.map((user, n) => {
      user = this.calculateRankNumber(user, n)
      const img = this.arrowDirection(user, n)
      if(user.id === Number(user_id)){
        return  <li className="highlighted-user-row" key={user.id}>
                    <ul className='user-row-list'>
                      <li className="user-row-rank">#{n + 1}</li>
                      <li className="user-arrow">{img}</li>
                      <li id={user.id} className="user-row-name">{user.first} {user.last}</li>
                      <li className="user-row-score">{user.personal_savings_to_date}</li>
                    </ul>
                  </li>
      }
      return   <li id={user.id} className="ranked-user-row" key={user.id}>
                  <ul className='user-row-list'>
                    <li className="user-row-rank">{n + 1}</li>
                    <li className="user-arrow">{img}</li>
                    <li id={user.id} className="user-row-name">{user.first} {user.last}</li>
                    <li className="user-row-score">{user.personal_savings_to_date}</li>
                  </ul>
               </li>
    })
    return userList
  }

  calculateRankNumber(user, n){
    n += 1;
    let type = localStorage.getItem("resource_type")
    let update = updateUser(user);
    let region = singularRegion(localStorage.getItem('region_type-users'));
    const path = 'api/v1/users/' + user.id + '/' + type
    if(user.rank === n && update){
      user.arrow = null;
      let userData = {
        user: user,
        region_type: region,
        region_id: localStorage.getItem("region_id-users")
      }
      put(path, undefined, userData)
        .then(data => data)
        .catch(error => console.log(error))
      return user;
    }
    else if(user.rank === null){
      user.rank = n;
      let userData = {
        user: user,
        region_type: region,
        region_id: localStorage.getItem("region_id-users")
      }
      put(path, undefined, userData)
        .then(data => console.log('success'))
        .catch(error => console.log(error))
      return user
    }
    else if(user.rank > n){
      user.rank = n;
      user.arrow = true;
      let userData = {
        user: user,
        region_type: region,
        region_id: localStorage.getItem("region_id-users")
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
        region_id: localStorage.getItem("region_id-users")
      }
      put(path, undefined, userData)
        .then(data => console.log(data))
        .catch(error => console.log(error))
      return user
    }else{
      return user
    }
  }

  arrowDirection(u, n){
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

  render(){
    let low_type = this.props.type
    let type = capitalize(low_type)
    return(
      <div className="user_box">
        <table className="user-list-headers">
          <thead>
          <tr className="user-list-header-row">
            <th className="header-rank">Rank</th><th className="header-user"></th><th className='header-score'>{type} Savings</th>
          </tr>
          </thead>
        </table>
        <ul className='user-list'>
          {this.userList()}
        </ul>
      </div>
    )
  }
}

export default UserList;
