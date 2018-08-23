import React, {Component} from 'react';
import {connect} from 'react-redux';
import HouseUsersBoards from './users';
import './HouseholdData-styles.css';

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sortCarbon(type){
  if(type === 'carbon'){
    return "per CC user"
  }else{
    return "per resident"
  }
}

function getImgPath(type){
  if(type === 'carbon'){
    return './img/Leaf final_fill.png'
  }
  else if(type === 'electricity'){
    return './img/ELEC_fill_2.png'
  }
  else if(type === 'water'){
    return './img/AQUA_fill_2.png'
  }
  else if(type === 'gas'){
    return './img/FLAME_fill_2.png'
  }
}
function resourceStyler(type){
  if(type==="carbon"){
    return {width: '32px', height: '32px'}
  }else if(type==="electricity"){
    return {width: '10px', height: '42px'}
  }else if(type==="water"){
    return {width: '20px', height: '36px'}
  }else if(type==="gas"){
    return {width: '28px', height: '36px'}
  }else{
    return ""
  }
}
class HouseholdData extends Component{
  constructor(props){
    super(props);
    let resource  = capitalize(props.resource_type)
    let avg_monthly, avg_daily;
    if(resource === "Carbon"){
      avg_daily = props.data.avg_daily_consumption_per_user
      avg_monthly = props.data.avg_monthly_consumption_per_user
    }else{
      avg_daily = props.data.avg_daily_consumption_per_resident
      avg_monthly = props.data.avg_monthly_consumption_per_resident
    }
    this.state = {
      loading: true,
      id: props.data.id,
      no_residents: props.data.number_residents,
      total_sq_ft: props.data.total_sq_ft,
      avg_daily: avg_daily,
      avg_monthly: avg_monthly,
      no_bills: props.data.number_of_bills_entered,
      total_consumed: props.data.total_consumption_to_date,
      users_ids: props.data.users_ids,
      days: props.data.total_days_recorded,
      address: props.data.address.address_line1,
      city: props.data.address.city,
      state: props.data.address.state,
      country: props.data.address.country,
      neighborhood: props.data.address.neighborhood_name,
      total_spent: props.data.total_spent,
      resource_type: resource,
      resource_unit: props.data.metric_sym,
      r1d1d1: "data-pt_1",
      r1d1d2: "total_spendings-block hidden",
      r1d2d1: "little-circle right hidden",
      r1d2d2: "daily_use-block",
      r2d1d1: "little-circle left hidden",
      r2d1d2: "monthly_use-block",
      r2d2d1: "data-pt_2",
      r2d2d2: "total_consumption-block hidden",
    }
    this.updateState = this.updateState.bind(this);
    this.revealTotalDollarSavings = this.revealTotalDollarSavings.bind(this);
    this.hideTotalDollarSavings = this.hideTotalDollarSavings.bind(this);
    this.revealAvgMonthlyConsumption = this.revealAvgMonthlyConsumption.bind(this);
    this.hideAvgMonthlyConsumption = this.hideAvgMonthlyConsumption.bind(this);
    this.revealAvgDailyConsumption = this.revealAvgDailyConsumption.bind(this);
    this.hideAvgDailyConsumption = this.hideAvgDailyConsumption.bind(this);
    this.revealTotalConsumptionWords = this.revealTotalConsumptionWords.bind(this);
    this.hideTotalConsumptionWords = this.hideTotalConsumptionWords.bind(this);
  }

  componentDidMount(){
  }

  updateState(name, type){
    this.setState({
      [name]: type,
    })
  }

  revealTotalDollarSavings(){
    this.setState({
      r1d1d1: "data-pt_1 hidden",
      r1d1d2: "total_spendings-block"
    })
  }

  hideTotalDollarSavings(){
    this.setState({
      r1d1d1: "data-pt_1",
      r1d1d2: "total_spendings-block hidden"
    })
  }

  revealAvgDailyConsumption(){
    this.setState({
      r1d2d1: "little-circle right",
      r1d2d2: "daily_use-block hidden"
    })
  }

  hideAvgDailyConsumption(){
    this.setState({
      r1d2d1: "little-circle right hidden",
      r1d2d2: "daily_use-block"
    })
  }

  revealAvgMonthlyConsumption(){
    this.setState({
      r2d1d1: "little-circle left",
      r2d1d2: "monthly_use-block hidden"
    })
  }

  hideAvgMonthlyConsumption(){
    this.setState({
      r2d1d1: "little-circle left hidden",
      r2d1d2: "monthly_use-block"
    })
  }

  revealTotalConsumptionWords(){
    this.setState({
      r2d2d1: "data-pt_2 hidden",
      r2d2d2: "total_consumption-block"
    })
  }

  hideTotalConsumptionWords(){
    this.setState({
      r2d2d1: "data-pt_2",
      r2d2d2: "total_consumption-block hidden"
    })
  }

  render(){
    let low_case_res = this.props.resource_type
    let img_path = getImgPath(low_case_res)
    let style = resourceStyler(low_case_res)
    const color = this.props.color
    let per_what = sortCarbon(low_case_res)
    return(
      <div className="household-container">
        <div className="household-title-bar">
          <h1 style={{color: color, textShadow: '1px 1px 1px black'}}> Household Data </h1>
        </div>
        <div className="household-data-container">
          <table className="house-stats-table">
          <tbody>
            <tr className="house-stats_r1">
              <td>
                <div className="big-circle_1 left" onTouchStart={this.revealTotalDollarSavings} onMouseEnter={this.revealTotalDollarSavings} onMouseLeave={this.hideTotalDollarSavings} onTouchEnd={this.hideTotalDollarSavings}>
                  <div className={this.state.r1d1d2} ><h4 className="total-spendings-words">total spendings to date</h4></div>
                  <div className={this.state.r1d1d1}><h4 className="total-spendings" style={{color: color, textShadow: '1px 1px 1px black'}}>${this.state.total_spent}</h4></div>
                </div>
              </td>
              <td>
                <div className="avgDailyDiv" onTouchStart={this.revealAvgDailyConsumption} onMouseEnter={this.revealAvgDailyConsumption} onTouchEnd={this.hideAvgDailyConsumption} onMouseLeave={this.hideAvgDailyConsumption}>
                  <div className={this.state.r1d2d1}><h3 style={{color: color, textShadow: '1px 1px 1px black'}}>{this.state.avg_daily}</h3><h4 className="average-consumption-metric1" style={{color: color, textShadow: '1px 1px 1px black'}}>{this.state.resource_unit}</h4></div>
                  <div className={this.state.r1d2d2}>average daily {low_case_res} consumption {per_what}</div>
                </div>
              </td>
            </tr>
            <tr className="house-stats_r2">
              <td>
                <div className="avgMonthlyDiv" onTouchStart={this.revealAvgMonthlyConsumption} onMouseEnter={this.revealAvgMonthlyConsumption} onMouseLeave={this.hideAvgMonthlyConsumption} onTouchEnd={this.hideAvgMonthlyConsumption}>
                  <div className={this.state.r2d1d1}><h3 style={{color: color, textShadow: '1px 1px 1px black'}}>{this.state.avg_monthly}</h3><h4 className="average-consumption-metric2" style={{color: color, textShadow: '1px 1px 1px black'}}>{this.state.resource_unit}</h4></div>
                  <div className={this.state.r2d1d2}>average monthly {low_case_res} consumption {per_what}</div>
                </div>
              </td>
              <td>
                <div className="big-circle_2 right" onMouseEnter={this.revealTotalConsumptionWords} onTouchStart={this.revealTotalConsumptionWords} onMouseLeave={this.hideTotalConsumptionWords} onTouchEnd={this.hideTotalConsumptionWords}>
                  <div className={this.state.r2d2d1}><h4 className="ratio-top" style={{color: color, textShadow: '1px 1px 1px black'}}>{this.state.total_consumed}</h4><h4 className="ratio-bottom" style={{color: color, textShadow: '1px 1px 1px black'}}>{this.state.days} days</h4></div>
                  <div className={this.state.r2d2d2}>
                        <h3>total household {low_case_res} consumption to date</h3>
                    </div>
                </div>
              </td>
            </tr>
            </tbody>
           </table>
        </div>
        <div className="household-img-container">
          <img
            className="household-resource-img"
            name="img"
            alt="carbon collective resource logo"
            src={require(`${img_path}`)}
            style={style}
            />
        </div>
        <div className="household-users">
          <HouseUsersBoards users={this.state.users_ids} resType={this.props.resource_type} user_id={this.props.user_id} house_id={this.props.house_id} updateState={this.updateState} metric={this.state.resource_unit}/>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    user_id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
    dash_data: state.userInfo.dash_data,
    resource_type: state.userInfo.resource_type,
    color: state.userInfo.color,
  })
}

export default connect(mapStateToProps, null)(HouseholdData);
