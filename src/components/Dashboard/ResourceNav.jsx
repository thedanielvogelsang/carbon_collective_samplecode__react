import React, {Component} from 'react';
import {fetchDashData} from '../../actions/userActions'
import {connect} from 'react-redux';
import {post} from '../../api_client';

class ResourceNav extends Component {
  constructor(props){
    super(props);
    this.state = {
      water_url: "./img/AQUA_blank_2.png",
      elec_url: "./img/ELEC_blank_2.png",
      carbon_url: "./img/Leaf final_blank.png",
      flame_url: "./img/FLAME_blank_2.png",
    }
    this.postButtonPress = this.postButtonPress.bind(this);
    this.setDashboardData = this.setDashboardData.bind(this);
    this.updateUserData = this.updateUserData.bind(this);
    this.updateDashColors = this.updateDashColors.bind(this);
    this.preSetDash = this.preSetDash.bind(this);
  }

  componentDidMount(){
    this.updateDashColors()
  }

  updateUserData(type){
    this.props.fetchDashData(this.props.user_id, type)
  }

  updateDashColors(){
    let type = this.props.resource_type
    this.setDashboardData(type)
  }

  setDashboardData(type){
    switch(type){
      case "carbon":
        this.setState({
          resourceType: type,
          water_url: "./img/AQUA_blank_2.png",
          elec_url: "./img/ELEC_blank_2.png",
          carbon_url: "./img/Leaf final_fill.png",
          flame_url: "./img/FLAME_blank_2.png",
        }, this.props.updateLoader(true));
        break
      case "electricity":
        this.setState({
          water_url: "./img/AQUA_blank_2.png",
          elec_url: "./img/ELEC_fill_2.png",
          carbon_url: "./img/Leaf final_blank.png",
          flame_url: "./img/FLAME_blank_2.png",
        }, this.props.updateLoader(true));
        break
      case "water":
        this.setState({
          water_url: "./img/AQUA_fill_2.png",
          elec_url: "./img/ELEC_blank_2.png",
          carbon_url: "./img/Leaf final_blank.png",
          flame_url: "./img/FLAME_blank_2.png",
        }, this.props.updateLoader(true));
        break
      case "gas":
        this.setState({
        water_url: "./img/AQUA_blank_2.png",
        elec_url: "./img/ELEC_blank_2.png",
        carbon_url: "./img/Leaf final_blank.png",
        flame_url: "./img/FLAME_fill_2.png",
        }, this.props.updateLoader(true));
        break
      default:
        break;
    }
  }

  postButtonPress(type){
    let id = this.props.user_id
    let page = this.props.history.location.pathname
    let path = `${id}/presses-btn`
    let datum = {user_behavior: {
      buttonName: type,
      pageName: page,
    }
                 }
    post(path, datum)
     .then(data => {return data})
     .catch(error => console.log(error))
  }

  preSetDash(e){
    e.preventDefault();
    let type = e.target.getAttribute('name')
    this.updateUserData(type)
    this.postButtonPress(type)
    this.setDashboardData(type)
}

  render(){
    return(
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
    )
  }
}

const mapStateToProps = (state) => {
  return({
    user_id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
    data: state.userInfo.data,
    dash_data: state.userInfo.dash_data,
    resource_type: state.userInfo.resource_type
  })
}

export default connect(mapStateToProps, {fetchDashData})(ResourceNav);
