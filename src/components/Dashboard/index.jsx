import React, { Component } from 'react';
import DashboardData from '../DashboardData';
import {post} from '../../api_client';
import {connect} from 'react-redux';
import {fetchDashData} from '../../actions/userActions'
import './Dashboard-styles.css';
import Loader from '../Loader';
import ResourceNav from './ResourceNav'
import {ResourceTitleDash} from './ResourceTitle'

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
      color: color,
      colorBack: "#D3D4D5",
      resourceType: resource,
    };
    this.goToPage = this.goToPage.bind(this);
    this.changeDashboardData = this.changeDashboardData.bind(this);
    this.showDashboardData = this.showDashboardData.bind(this);
    this.updateLoader = this.updateLoader.bind(this);
};

  componentDidMount(){
    this.props.dash_data ? this.showDashboardData() : console.log()
  }

  componentDidUpdate(prevProps, prevState){
    prevProps.dash_data !== this.props.dash_data ? this.changeDashboardData(this.props.dash_data) : console.log()
  }

  updateLoader(load){
    this.setState({
      loading: !load,
    })
  }

  changeDashboardData(dash_data){
    this.setState({
      loading: false,
      dash_data: dash_data,
    })
  }

  showDashboardData(){
    this.setState({
      loading: false
    })
  }

  goToPage(path){
    let id = this.props.user_id
    let page = this.props.history.location.pathname
    let url = `${id}/page-leave`
    let datum = {user_behavior: {
      prevPage: page,
      nextPage: path,
        }
      }
    post(url, datum)
     .then(data => {return data})
     .catch(error => console.log(error))
    this.props.history.push(path)
  }


  render() {
    let loading = this.state.loading
    let house = this.props.house_id
    let resource = this.props.resource_type
    let title = capitalizeFirstLetter(resource)
    let color = this.props.color
    // console.log(loading, house, color)
    if(title === "Gas"){
      title = "Heat"
    }
    if(house){
      return (
        <div className="dashboard-page">
          <div className="dashboard-header-container">
            <div className="dashboard-overlay">
              <ResourceTitleDash color={color} title={title} resourceType={resource} changePage={this.goToPage} />
              <ResourceNav updateLoader={this.updateLoader} history={this.props.history} />
            </div>
          </div>
          <div className="arrow-holder">
            <div id="start-here-div">
              <button
                className="start-here-btn"
                onClick=""
              >Start Here</button>
            </div>
            <div id="line1">
            </div>
            <div id="line2">
            </div>
            <div id="bills-arrow">
            </div>
          </div>
          <div className="dashboard-data-container">
          {!loading ? <DashboardData {...this.state} title={title} updateState={this.props.updateState}/> : <Loader /> }
          </div>
        </div>
      )}else{
        return(
          <div>
            <div className="no-house-container">
              <h1> You dont have a house registered! </h1>
              <p> add your house</p><br/>
              <a href="" onClick={this.goToPage('/search_address')}>
                __here__
              </a>
            </div>
          </div>
        )
      }
  };
};



const mapStateToProps = (state) => {
  return({
    user_id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
    data: state.userInfo.data,
    dash_data: state.userInfo.dash_data,
    resource_type: state.userInfo.resource_type,
    color: state.userInfo.color,
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
