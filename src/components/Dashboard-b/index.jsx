import React, { Component } from 'react';
import DashboardData from '../DashboardData';
import {post} from '../../api_client';
import {connect} from 'react-redux';
import {fetchDashData} from '../../actions/userActions'
import './Dashboard-styles.css';
import Loader from '../Loader';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    let resource = localStorage.getItem('resource_type') || 'carbon'
    let color = localStorage.getItem('accent_color') || "rgb(191,130,54)"
    if(resource === 'null'){
      resource = 'carbon'
    }
    this.state = {
      loading: true,
      user_id: props.user_id,
      first: props.data.first,
      avatar_url: props.data.avatar_url,
      water_url: "./img/AQUA_blank_2.png",
      elec_url: "./img/ELEC_blank_2.png",
      carbon_url: "./img/Leaf final_blank.png",
      flame_url: "./img/FLAME_blank_2.png",
      color: color,
      colorBack: "#D3D4D5",
      resourceType: resource,
    };
    this.setDashboardData = this.setDashboardData.bind(this);
    this.preSetDash = this.preSetDash.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.changeDashboardData = this.changeDashboardData.bind(this);
    this.showDashboardData = this.showDashboardData.bind(this);
};

  componentDidMount(){
    console.log(this.props)
  }

  render(){
    return(
      <div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    user_id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
    data: state.userInfo.data,
    dash_data: state.userInfo.dash_data
  })
}

export default connect(mapStateToProps, {fetchDashData})(Dashboard);

// Avatar:

// <div className="avatar-container">
//   <img
//     className="avatar-img"
//     alt="carbon collective logo"
//     src={require(`${this.state.avatar_url}`)} />
// </div>

// No house dashboard
