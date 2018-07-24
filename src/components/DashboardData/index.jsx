import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {get, post} from '../../api_client';
import './DashboardData-styles.css';
import {triggerAnimation} from './scripts/no-bills-animation.js'
import BarGraph from './scripts/ranking_d3_chart_basic.jsx';

// function throwEllipsis(string){
//   if(string.length >= 17){
//     let str = string.slice(0, 18)
//     return `${str}...`
//   }else{
//     return string
//   }
// }

class DashboardData extends Component {
  constructor(props){
    super(props);
    let noBills;
    this.props.data.household_monthly_consumption === "0.0" ? noBills = true : noBills = false;
    this.state = {
      noBills: noBills,
      login: true,
    }
    this.goToRegionPage = this.goToRegionPage.bind(this)
    this.goToHouseholdPage = this.goToHouseholdPage.bind(this)
    this.applyDataOnState = this.applyDataOnState.bind(this)
  };

  componentDidMount(){
    this.logDashboardDataRender()
    let res = this.props.resourceType
    if(res !== 'carbon'){
      this.state.noBills && this.state.login ? triggerAnimation(res) : console.log()
    }
  }

  componentDidUpdate(){
    localStorage.setItem('resource_unit', this.props.data.metric_sym)
  }

  logLanding(){
    let id = sessionStorage.getItem('user_id')
    let page = this.props.history.location.pathname
    let path = `${id}/page-land`
    let datum = {user_behavior: {
      pageName: page,
        }
      }
    post(path, datum)
     .then(data => console.log())
     .catch(error => console.log(error))
  }

  logDashboardDataRender(){
    this.logLanding();
    let id = sessionStorage.getItem('user_id')
    let name = '/dashboard-data renders'
    let path = `${id}/page-land`
    let datum = {
      user_behavior: {
        pageName: name
      }
    }
    post(path, datum)
      .then(data => console.log())
      .catch(error => console.log(error))
  }

  goToHouseholdPage(event){
    // button and page change
    let path = '/household'
    this.logPageChange(path)
    this.props.history.push(path)
  }

  goToRegionPage(event){
    // button
    event.preventDefault()
    let region_type = event.target.getAttribute("name");
    let id = event.target.id;
    let resourceType = this.props.resourceType
    let name = event.target.textContent || event.target.className.baseVal;
    get(`api/v1/areas/${region_type}/${id}/${resourceType}`)
      .then(data => this.applyDataOnState(data, name, region_type))
      .catch(error => console.log(error))
  }

  applyDataOnState(region, name, region_type){
    // page change
    let path = '/regionPage/'
    let resType = this.props.resourceType
    let newPath = path + region_type + '/resource?' + resType
    this.logPageChange(newPath)
    localStorage.setItem('region_type', region_type)
    localStorage.setItem('region_id', region.id)
    localStorage.setItem('region_name', name)
    localStorage.setItem('region_parent', region.parent)
    this.props.updateState('region_type', region_type)
    this.props.updateState('region_id', region.id)
    this.props.updateState('region_name', name)
    this.props.updateState('region_parent', region.parent)
    this.props.updateState('resource_type', resType)
    this.props.history.push(path)
  }

  logPageChange(path){
    let id = sessionStorage.getItem('user_id')
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
  }

  render() {
    var country = false;
    var color = this.props.color
    var colorN = 'white';
    var colorC = "white";
    var metric = this.props.data.metric_sym
    var notCarbon;
    this.props.resourceType === 'carbon' ? notCarbon = false : notCarbon = true;
    return (
      <div className="data-container">
          <div className="community-comps">
              <div className="regional-header">
                <h5 style={{color: color}}>Community Comparisons</h5>
              </div>
              <div className="community-comps-labels">
                <h6 className="label-rank">Rankings</h6>
                <h6 className="label-consumption">Average Per Person Use Per Month (in {metric})</h6>
              </div>
              { notCarbon ?
              <div className="data-item-row">
                <div id="my-avg-use-div" className="data-item-t">
                  <a id="my-avg-use-link" name="personal" className="data-label-t" >Me</a>
                  <h6 id="my-avg-use-score" style={{color: color}} className="data-value">{ this.props.data.avg_monthly_consumption }</h6>
                </div>
                </div> : <div></div>
              }
              <div className="data-item-row">
                <div className="data-item-t">
                  <a id={this.props.data.household.id} name="households" className="data-label-t clickable" onClick={this.goToHouseholdPage}>Household</a>
                  <p className="data-item-rank" style={{visibility: 'hidden'}}>#{this.props.data.neighborhood[2]} / {this.props.data.neighborhood[3]}</p>
                  <h6 className="data-value" style={{color: color}}  onClick={this.goToHouseholdPage}>{  this.props.data.household_monthly_consumption  }</h6>
                  <div className="wrap-div">
                    <div className="wrap">
                     <div id="household-use" className="circle">
                       <span className="text"></span>
                     </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="data-item-row">
                <div className="data-item-t">
                  <a id={this.props.data.neighborhood[0]} name="neighborhoods" className="data-label-t clickable" onClick={this.goToRegionPage}>{this.props.data.neighborhood[1]}</a>
                  <p className="data-item-rank" style={{color: colorN}}>#{this.props.data.neighborhood[2]} / {this.props.data.neighborhood[3]}</p>
                  <h6 className="data-value" style={{color: color}} >{ this.props.data.neighborhood_monthly_consumption }</h6>
                </div>
                <div className="data-item-g">
                  <BarGraph id={this.props.data.neighborhood[0]} a={this.props.data.neighborhood[2]} b={this.props.data.neighborhood[3]} chartName="chart2" color={color} goToRegionPage={this.goToRegionPage} name="neighborhoods" regionName={this.props.data.neighborhood[1]}/>
                </div>
              </div>
              <div className="data-item-row">
                <div className="data-item-t">
                  <a id={this.props.data.city[0]} name="cities" className="data-label-t" >{this.props.data.city[1]}</a>
                  <p className="data-item-rank"  style={{color: colorC}}>#1 / 1</p>
                  <h6 className="data-value" style={{color: color}} >{ this.props.data.city_monthly_consumption }</h6>
                </div>
                <div className="data-item-g">
                  <BarGraph id={this.props.data.city[0]} a={1} b={1} chartName="chart3" color={color} name="cities" regionName={this.props.data.city[1]}/>
                </div>
              </div>
              {country ?
              <div><RegionGraphIcon {...this.props} color={color} goToRegionPage={this.goToRegionPage}/>
              <CountryGraphIcon {...this.props} color={color} goToRegionPage={this.goToRegionPage}/></div> : <div></div> }
          </div>
      </div>
    )
  };
};

const CountryGraphIcon = (props) => {
  // let country = throwEllipsis(props.data.country[1])
  let country = props.data.country[1]
  let colorC = 'white';
  if(props.resourceType === "gas"){
    return(
      <div className="data-item-row">
        <div className="data-item-t">
          <a id={props.data.country[0]} name="countries" className="data-label-t">{country}</a>
          <h6 className="data-value"  style={{color: props.color}} >{ props.data.country_monthly_consumption }</h6>
        </div>
      </div>
    )
  }else{
    return(
      <div className="data-item-row">
        <div className="data-item-t">
          <a id={props.data.country[0]} name="countries" className="data-label-t clickable" onClick={props.goToRegionPage}>{country}</a>
          <p className="data-item-rank" style={{color: colorC}}>#{props.data.country[2]} / {props.data.country[3]}</p>
          <h6 className="data-value"  style={{color: props.color}} >{ props.data.country_monthly_consumption }</h6>
        </div>
        <div className="data-item-g">
        <BarGraph id={props.data.country[0]} a={props.data.country[2]} b={props.data.country[3]} chartName="chart6" color={props.color} goToRegionPage={props.goToRegionPage} name="countries" regionName={props.data.country[1]}/>
        </div>
      </div>
    )
  }
};

const RegionGraphIcon = (props) => {
  let colorR = 'white';
  return(
      <div className="data-item-row">
        <div className="data-item-t">
          <a id={props.data.region[0]} name="regions" className="data-label-t clickable" onClick={props.goToRegionPage}>{props.data.region[1]}</a>
          <p className="data-item-rank" style={{color: colorR}}>#{props.data.region[2]} / {props.data.region[3]}</p>
          <h6  className="data-value" style={{color: props.color}}>{ props.data.region_monthly_consumption }</h6>
        </div>
        <div className="data-item-g">
          <BarGraph id={props.data.region[0]} a={props.data.region[2]} b={props.data.region[3]} chartName="chart5" color={props.color} goToRegionPage={props.goToRegionPage} name="regions" regionName={props.data.region[1]}/>
        </div>
      </div>
    )

};



export default withRouter(DashboardData);

// <div className="data-item-row">
//   <div className="data-item-t">
//     <a id={this.props.data.county[0]} name="counties" className="data-label-t">{this.props.data.county[1]}</a>
//     <h6 className="data-value" >{ this.props.data.county_monthlyconsumption }</h6>
//   </div>
// </div>

// <div className="house-container_1">
//     <div className="ticket-left">
//     </div>
//     <div className="house-container_2" style={{borderColor:  this.props.color}} onClick={this.goToHouseholdPage}>
//       <div className="house-data">
//         <a id={this.props.data.household.id} className="data-label-t" onClick={this.goToHouseholdPage}>Household</a>
//       </div>
//
//     </div>
//     <div className="ticket-right">
//     </div>
// </div>
