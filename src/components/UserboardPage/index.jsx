import React, {Component} from 'react';
import {get} from '../../api_client';
import UserList from '../UserList';
import './UserboardPage-styles.css';

class UserboardPage extends Component{
  constructor(){
    super();
    this.state = {
      region_type: localStorage.getItem('region_type'),
      region_id: localStorage.getItem('region_id-users'),
      region_name: localStorage.getItem('region_name-users'),
      resource_type: localStorage.getItem('resource_type'),
      loading: false
    }
    this.lookupUsers = this.lookupUsers.bind(this)
    this.setUsers = this.setUsers.bind(this)
  }

  componentDidMount(){
    this.lookupUsers()
  }

  lookupUsers(){
    let region = this.state.region_type
    let id = this.state.region_id
    let type = this.state.resource_type
    const path = '/api/v1/areas/' + region + '/' + id + '/' + type + '/users'
    get(path)
      .then(data => this.setUsers(data))
      .catch(error => console.log(error))
  }

  setUsers(users){
    this.setState({
      loading: true,
      users: users
    })
  }

  render(){
    let load = this.state.loading
    return(
    <div className="user-list-page">
      <h1 className="user-list-title"> {this.state.region_name}'s Top Savers</h1>
      <div className="user-list-container">
        {load ? <UserList users={this.state.users} type={this.state.resource_type}/> : null }
      </div>
    </div>
    )
  }
}

export default UserboardPage;
