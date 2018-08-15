import React, { Component } from 'react';
import DashboardData from '../DashboardData';
import {post} from '../../api_client';
import {connect} from 'react-redux';
import {fetchDashData} from '../../actions/userActions'
import './Dashboard-styles.css';

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
      user_id: props.user_id,
      first: props.data.first,
      avatar_url: props.data.avatar_url,
      water_url: "./img/AQUA_blank_2.png",
      elec_url: "./img/ELEC_blank_2.png",
      carbon_url: "./img/Leaf final_blank.png",
      flame_url: "./img/FLAME_blank_2.png",
      color: color,
      colorBack: "#D3D4D5",
      loading: true,
      resourceType: resource,
    };
    this.setDashboardData = this.setDashboardData.bind(this);
    this.preSetDash = this.preSetDash.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
};

  componentDidMount(){
    this.updateUserData()
    this.setDashboardData(this.state.resourceType)
  }

  componentDidUpdate(prevProps, prevState){
    if(prevState.color !== this.state.color){
      localStorage.setItem("accent_color", this.state.color)
    }
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
     .then(data => console.log())
     .catch(error => console.log(error))
    this.props.history.push(path)
  }

  preSetDash(e){
   e.preventDefault();
   let type = e.target.getAttribute('name')
   let id = this.props.user_id
   let page = this.props.history.location.pathname
   let path = `${id}/presses-btn`
   let datum = {user_behavior: {
     buttonName: type,
     pageName: page,
   }
                }
   post(path, datum)
    .then(data => console.log())
    .catch(error => console.log(error))
   this.setDashboardData(type)
  }

  setDashboardData(type){
    localStorage.setItem("resource_type", type)
    switch(type){
      case "carbon":
        this.setState({
          resourceType: type,
          water_url: "./img/AQUA_blank_2.png",
          elec_url: "./img/ELEC_blank_2.png",
          carbon_url: "./img/Leaf final_fill.png",
          flame_url: "./img/FLAME_blank_2.png",
          color: "rgb(121,194,120)",
          loading: true,
        }, this.updateUserData);
        break
      case "electricity":
        this.setState({
          resourceType: type,
          water_url: "./img/AQUA_blank_2.png",
          elec_url: "./img/ELEC_fill_2.png",
          carbon_url: "./img/Leaf final_blank.png",
          flame_url: "./img/FLAME_blank_2.png",
          color: "rgb(252,232,52)",
          loading: true,
        }, this.updateUserData);
        break
      case "water":
        this.setState({
          resourceType: type,
          water_url: "./img/AQUA_fill_2.png",
          elec_url: "./img/ELEC_blank_2.png",
          carbon_url: "./img/Leaf final_blank.png",
          flame_url: "./img/FLAME_blank_2.png",
          color: "rgb(70,138,199)",
          loading: true,
        }, this.updateUserData);
        break
      case "gas":
        this.setState({
        resourceType: type,
        water_url: "./img/AQUA_blank_2.png",
        elec_url: "./img/ELEC_blank_2.png",
        carbon_url: "./img/Leaf final_blank.png",
        flame_url: "./img/FLAME_fill_2.png",
        color: "rgb(239,98,93)",
        loading: true,
        }, this.updateUserData);
        break
      default:
        break;
    }
  }

  setUserState(data){
    localStorage.setItem("avg_monthly_consumption", data.avg_monthly_consumption)
    // this.setState({data, loading: false})
  }

  updateUserData(){
    let type = this.state.resourceType
    this.props.fetchDashData(this.props.user_id, type)
  }

  render() {
    let house = this.props.house_id
    let title = capitalizeFirstLetter(this.state.resourceType)
    let resource = this.state.resourceType
    let color = this.state.color
    if(title === "Gas"){
      title = "Heat"
    }
    if(house){
      return (
        <div className="dashboard-page">
          <div className="dashboard-header-container">
            <div className="dashboard-overlay">
              <GlobalSavings color={color} title={title} resourceType={resource} changePage={this.goToPage} />
            </div>
              <div className="dashboard-resource-nav">
                  <button
                    className="resource-btn carbon-btn"
                    onClick={this.preSetDash}
                    name="carbon"
                    ><img
                        className="carbon-img"
                        alt="carbon collective logo carbon"
                        name="carbon"
                        src={require(`${this.state.carbon_url}`)} />
                  </button>
                  <button
                  className="resource-btn electricity-btn"
                  onClick={this.preSetDash}
                  name="electricity"
                  ><img
                      className="elec-img"
                      alt="carbon collective logo electricity"
                      name="electricity"
                      src={require(`${this.state.elec_url}`)} />
                  </button>
                  <button
                  className="resource-btn water-btn"
                  onClick={this.preSetDash}
                  name="water"
                  ><img
                      className="water-img"
                      alt="carbon collective logo water"
                      name="water"
                      src={require(`${this.state.water_url}`)} />
                  </button>
                  <button
                  className="resource-btn gas-btn"
                  onClick={this.preSetDash}
                  name="gas"
                  ><img
                      className="gas-img"
                      alt="carbon collective logo gas"
                      name="gas"
                      src={require(`${this.state.flame_url}`)} />
                  </button>
              </div>
            <div>
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
          <DashboardData {...this.state} title={title} updateState={this.props.updateState}/>
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

const GlobalSavings = (props) => {
  if(props.resourceType === "gas"){
    return(
      <div className="data-title-container">
        <h6 className="data-title">Heat</h6>
          <button
          className="update-bill-button"
          style={{color: props.color}}
          onClick={(e) => props.changePage('/managebills')}
              >
            Manage {props.title}
         </button>
      </div>
    )
  }else if(props.resourceType === "carbon"){
    return(
      <div className="data-title-container">
        <h6 className="data-title">{capitalizeFirstLetter(props.resourceType)}</h6>
        <button
          className="update-bill-button"
          style={{color: props.color}}
          onClick={(e) => props.changePage('/carbon-calculations')}
              >
            How We Calculate
         </button>
      </div>
    )
  }else{
    return(
      <div className="data-title-container">
        <h6 className="data-title">{capitalizeFirstLetter(props.resourceType)}</h6>
        <button
          className="update-bill-button"
          style={{color: props.color}}
          onClick={(e) => props.changePage('/managebills')}
              >
            Manage {props.title}
         </button>
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
