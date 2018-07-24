import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {get, post} from '../../api_client';
import './HouseExists-styles.css';

const spaceTimer = function(data){
    let promise = new Promise(function(resolve, reject){
      setTimeout(function(){
        localStorage.setItem('temp_house', null)
        resolve('success');
    }, 2000);
    })
    return promise;
  }

class HouseExists extends Component{
  constructor(){
    super();
    this.state = {
      house_id: localStorage.getItem('temp_house'),
      loading: true
    }
    this.residentsList = this.residentsList.bind(this);
    this.joinUserToHouse = this.joinUserToHouse.bind(this);
    this.rejectHouse = this.rejectHouse.bind(this);
    this.confirmData = this.confirmData.bind(this);
    this.goToPage = this.goToPage.bind(this);
  }

  componentDidMount(){
    this.loadHouse()
  }

  componentDidUpdate(){
  }

  residentsList(){
    const users = this.state.house.users_names.map((u, i) => {
      return(
        <li key={i} className="resident">{u}</li>
      )
    });
    return users
  }

  loadHouse(){
    get(`api/v1/houses/${this.state.house_id}`)
      .then(data => this.setState({house: data, loading: false}))
      .catch(error => console.log(error))
  }

  goToPage(path){
    return this.props.history.push(path)
  }

  joinUserToHouse(){
    let uid = sessionStorage.getItem("user_id")
    let hid = this.state.house_id
    sessionStorage.setItem("house_id", hid)
    const body = {house_id: hid}
    const path = `users/${uid}/old_houses/${hid}`
    if(confirm(`Are you sure you want to join the other residents at ${this.state.house.address}?`)){
      post(path, body)
        .then(data => this.confirmData(data))
        .catch(error => console.log(error))
    }
  }

  rejectHouse(){
    this.goToPage('/add_address')
  }

  confirmData(data){
    this.props.addUserData()
    sessionStorage.setItem('house_id', this.state.house_id)
    spaceTimer(data)
      .then(data => this.goToPage('/dashboard'))
  }

  render(){
    if(this.state.loading){
      return(
        <div>
          <h1></h1>
        </div>

      )
    }else{
      return(<div className="house-exists">
          <h1> Hello {this.props.data.first} </h1>
          <h3> The address you entered already exists in our database. Did you mean: </h3>
          <h4>{this.state.house.address}</h4>
          <h3> with the following residents? </h3>
          <ul className="resident-list">{this.residentsList()}</ul>
          <h3>If this is your home, click "JOIN!".</h3>
          <h3> Otherwise click "NO"</h3>
          <div className="join-house-btns">
            <button
              className="join-house-btn"
              name='join-house-btn'
              onClick={this.joinUserToHouse}
              >JOIN!</button>
            <button
              className="join-house-btn"
              name='DIDNOT-join-house-btn'
              onClick={this.rejectHouse}
              >NO</button>
          </div>
        </div>
      )
    }
  }
}




export default withRouter(HouseExists);
