import React, {Component} from 'react';
import {fetchDashData} from '../../actions/userActions'
import {connect} from 'react-redux';
import {post} from '../../api_client';

class ResourceNav extends Component {
  constructor(props){
    super(props);
    this.state = {
      carbon_url: "./img/Leaf final_fill.png",
      elec_url: "./img/ELEC_blank_2.png",
      water_url: "./img/AQUA_blank_2.png",
      flame_url: "./img/FLAME_blank_2.png",
      carbon_highlighted: true,
      elec_highlighted: false,
      water_highlighted: false,
      flame_highlighted: false,
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
    this.updateUserData(type)
    setTimeout(this.setDashboardData, 1500, type)
  }

  setDashboardData(type){
    switch(type){
      case "carbon":
        this.setState({
          water_url: "./img/AQUA_blank_2.png",
          elec_url: "./img/ELEC_blank_2.png",
          carbon_url: "./img/Leaf final_fill.png",
          flame_url: "./img/FLAME_blank_2.png",
          carbon_highlighted: true,
          elec_highlighted: false,
          flame_highlighted: false,
          water_highlighted: false,
        });
        break
      case "electricity":
        this.setState({
          water_url: "./img/AQUA_blank_2.png",
          elec_url: "./img/ELEC_fill_2.png",
          carbon_url: "./img/Leaf final_blank.png",
          flame_url: "./img/FLAME_blank_2.png",
          carbon_highlighted: false,
          elec_highlighted: true,
          flame_highlighted: false,
          water_highlighted: false,
        });
        break
      case "water":
        this.setState({
          water_url: "./img/AQUA_fill_2.png",
          elec_url: "./img/ELEC_blank_2.png",
          carbon_url: "./img/Leaf final_blank.png",
          flame_url: "./img/FLAME_blank_2.png",
          carbon_highlighted: false,
          elec_highlighted: false,
          flame_highlighted: false,
          water_highlighted: true,
        });
        break
      case "gas":
        this.setState({
        water_url: "./img/AQUA_blank_2.png",
        elec_url: "./img/ELEC_blank_2.png",
        carbon_url: "./img/Leaf final_blank.png",
        flame_url: "./img/FLAME_fill_2.png",
        carbon_highlighted: false,
        elec_highlighted: false,
        flame_highlighted: true,
        water_highlighted: false,
        });
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
    let carbon_class, water_class, elec_class, heat_class;
    this.state.carbon_highlighted ? carbon_class = 'carbon-img highlighted' : carbon_class = 'carbon-img';
    this.state.elec_highlighted ? elec_class = 'elec-img highlighted' : elec_class = 'elec-img';
    this.state.water_highlighted ? water_class = 'water-img highlighted' : water_class = 'water-img';
    this.state.flame_highlighted ? heat_class = 'gas-img highlighted' : heat_class = 'gas-img';
    return(
        <div className="dashboard-resource-nav">
        <div className="dashboard-resource-relative">
          <button
            className="resource-btn carbon-btn"
            onClick={this.preSetDash}
            name="carbon"
            ><img
                className={carbon_class}
                alt="carbon collective logo carbon"
                name="carbon"
                src={require(`${this.state.carbon_url}`)} />
          </button>
          <span className="resource-btn-tooltip"><p>carbon</p></span>
        </div>
        <div className="dashboard-resource-relative">
          <button
          className="resource-btn electricity-btn"
          onClick={this.preSetDash}
          name="electricity"
          ><img
              className={elec_class}
              alt="carbon collective logo electricity"
              name="electricity"
              src={require(`${this.state.elec_url}`)} />
          </button>
          <span className="resource-btn-tooltip"><p>electricity</p></span>
        </div>
        <div className="dashboard-resource-relative">
          <button
          className="resource-btn water-btn"
          onClick={this.preSetDash}
          name="water"
          ><img
              className={water_class}
              alt="carbon collective logo water"
              name="water"
              src={require(`${this.state.water_url}`)} />
          </button>
          <span className="resource-btn-tooltip"><p>water</p></span>
        </div>
        <div className="dashboard-resource-relative">
            <button
            className="resource-btn gas-btn"
            onClick={this.preSetDash}
            name="gas"
            ><img
                className={heat_class}
                alt="carbon collective logo gas"
                name="gas"
                src={require(`${this.state.flame_url}`)} />
            </button>
            <span className="resource-btn-tooltip"><p>heat</p></span>
        </div>
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
