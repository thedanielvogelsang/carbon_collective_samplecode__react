import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import {get, post} from '../../api_client';
import './DashboardData-styles.css';
import {checkImageHeight} from '../../helper-scripts/screenHelpers.js'
import {connect} from 'react-redux'
// import {triggerAnimation} from './scripts/no-bills-animation.js'
import BarGraph from './scripts/ranking_d3_chart_basic.jsx';
import {RegionComponent} from './RegionComponent'
import {MeComponent} from './RegionComponent'

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
    props.dash_data.household_monthly_consumption === "0.0" ? noBills = true : noBills = false;
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
    let res = this.props.resource_type
    if(res !== 'carbon'){
      this.state.noBills && this.state.login ? console.log("need to notify bills are empty somehow") : console.log()
    }
  }

  componentDidUpdate(prevProps, prevState){
    console.log(this.props)
    this.props.color !== prevProps.color ? checkImageHeight() : console.log()
    localStorage.setItem('resource_unit', this.props.dash_data.metric_sym)
  }

  logLanding(){
    let id = this.props.user_id
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
    let id = this.props.user_id
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
    let resourceType = this.props.resource_type
    let name = event.target.textContent || event.target.className.baseVal;
    get(`api/v1/areas/${region_type}/${id}/${resourceType}`)
      .then(data => this.applyDataOnState(data, name, region_type))
      .catch(error => console.log(error))
  }

  applyDataOnState(region, name, region_type){
    // page change
    let path = '/regionPage/'
    let resType = this.props.resource_type
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
  }

  render() {
    var country = false;
    var color = this.props.color
    var metric = this.props.dash_data.metric_sym
    var notCarbon;
    this.props.resource_type === 'carbon' ? notCarbon = false : notCarbon = true;
    return (
      <div className="dashboard-data-container_main">
      <div className="regional-header">
        <h5>Community Comparisons</h5>
      </div>
      <div className="data-container">
          <div className="community-comps">
            <div className="community-comps-labels">
                <h6 className="label-rank">Rankings</h6>
                <h6 className="label-consumption">1 Year Average Per Person Use Per Month in {metric}</h6>
            </div>
              { notCarbon ?
              <div className="data-item-row">
                <div className="data-item-box">
                <MeComponent dashData={this.props.dash_data} color={color}/>
                </div></div>  : <div></div>
              }    [id, name, regional-avg, parent_avg, parent_max, regional-rank, out_of]
              <div className="data-item-row">
                <div className="data-item-box">
                  <RegionComponent id={this.props.dash_data.household[0]} regionType="Household" label={this.props.dash_data.household[1]} linkAction={this.goToHouseholdPage} monthlyAvg={ this.props.dash_data.household[2]} parentAvg={ this.props.dash_data.household[3] } color={color}/>
                  <div className="data-item-g">
                    <BarGraph id={"household"} a={this.props.dash_data.household[2]} b={this.props.dash_data.household[3]} c={this.props.dash_data.household[4]} chartName="chart1" color={color} goToRegionPage={this.goToRegionPage} name="neighborhoods" regionName={"Household"}/>
                  </div>
                  <h6 className="graph-Exp">other households in {this.props.dash_data.neighborhood[1]}</h6>
                </div>
              </div>
              <div className="data-item-row">
                <div className="data-item-box">
                  <RegionComponent id={this.props.dash_data.neighborhood[0]} regionType="Neighborhood" label={this.props.dash_data.neighborhood[1]} linkAction={this.goToRegionPage} monthlyAvg={ this.props.dash_data.neighborhood[2]}  parentAvg={ this.props.dash_data.neighborhood[3] }  color={color}/>
                  <div className="data-item-g">
                    <BarGraph id={this.props.dash_data.neighborhood[0]} a={this.props.dash_data.neighborhood[2]} b={this.props.dash_data.neighborhood[3]} c={this.props.dash_data.neighborhood[4]} chartName="chart2" color={color} goToRegionPage={this.goToRegionPage} name="neighborhoods" regionName={this.props.dash_data.neighborhood[1]}/>
                  </div>
                  <h6 className="graph-Exp">other {this.props.dash_data.city[1]} neighborhoods</h6>
                </div>
              </div>
              <div className="data-item-row">
                <div className="data-item-box">
                  <RegionComponent id={this.props.dash_data.city[0]} regionType="City" label={this.props.dash_data.city[1]} linkAction={this.goToRegionPage} monthlyAvg={ this.props.dash_data.city[2]}  parentAvg={ this.props.dash_data.city[3] } color={color}/>
                  <div className="data-item-g">
                    <BarGraph id={this.props.dash_data.city[0]} a={this.props.dash_data.city[2]} b={this.props.dash_data.city[3]} c={this.props.dash_data.city[4]} chartName="chart3" color={color} name="cities" regionName={this.props.dash_data.city[1]}/>
                  </div>
                  <h6 className="graph-Exp">other {this.props.dash_data.region[1]} cities</h6>
                </div>
              </div>
              {country ?
              <div>
              <RegionGraphIcon {...this.props} color={color} goToRegionPage={this.goToRegionPage}/>
              <CountryGraphIcon {...this.props} color={color} goToRegionPage={this.goToRegionPage}/></div> : <div></div> }
          </div>
        </div>
      </div>
    )
  };
};

const CountryGraphIcon = (props) => {
  // let country = throwEllipsis(props.data.country[1])
  let country = props.dash_data.country[1]
  if(props.resourceType === "gas"){
    return(
      <div className="data-item-row">
        <div className="data-item-box">
          <div className="data-item-t">
            <a id={props.dash_data.country[0]} name="countries" className="data-label-t">{country}</a>
            <h6 className="data-value" >{ props.dash_data.country_monthly_consumption }</h6>
          </div>
        </div>
      </div>
    )
  }else{
    return(
      <div className="data-item-row">
        <div className="data-item-box">
          <RegionComponent id={props.dash_data.country[0]} regionType="Country" label={country} linkAction={props.goToRegionPage} monthlyAvg={ this.props.dash_data.country[2]}  parentAvg={ this.props.dash_data.country[3] } color={color}/>
          <div className="data-item-g">
            <BarGraph id={this.props.dash_data.country[0]} a={this.props.dash_data.country[2]} b={this.props.dash_data.country[3]} c={this.props.dash_data.country[4]} chartName="chart5" color={color} name="countries" regionName={this.props.dash_data.country[1]}/>
          </div>
          <h6 className="graph-Exp">other countries</h6>
        </div>
      </div>
    )
  }
};

const RegionGraphIcon = (props) => {
  console.log(props)
  return(
    <div className="data-item-row">
      <div className="data-item-box">
        <RegionComponent id={props.dash_data.region[0]} regionType="Region" label={country} linkAction={props.goToRegionPage} monthlyAvg={ this.props.dash_data.country[2]}  parentAvg={ this.props.dash_data.country[3] } color={color}/>
        <div className="data-item-g">
          <BarGraph id={this.props.dash_data.country[0]} a={this.props.dash_data.country[2]} b={this.props.dash_data.country[3]} c={this.props.dash_data.country[4]} chartName="chart5" color={color} name="regions" regionName={this.props.dash_data.country[1]}/>
        </div>
        <h6 className="graph-Exp">other countries</h6>
      </div>
    </div>
    )

};


const mapStateToProps = (state) => {
  return({
    user_id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
    dash_data: state.userInfo.dash_data,
    resource_type: state.userInfo.resource_type,
    color: state.userInfo.color,
  })
}

export default withRouter(connect(mapStateToProps, null)(DashboardData));

// <div className="data-item-row">
//   <div className="data-item-t">
//     <a id={this.props.dash_data.county[0]} name="counties" className="data-label-t">{this.props.dash_data.county[1]}</a>
//     <h6 className="data-value" >{ this.props.dash_data.county_monthlyconsumption }</h6>
//   </div>
// </div>

// <div className="house-container_1">
//     <div className="ticket-left">
//     </div>
//     <div className="house-container_2" style={{borderColor:  this.props.color}} onClick={this.goToHouseholdPage}>
//       <div className="house-data">
//         <a id={this.props.dash_data.household.id} className="data-label-t" onClick={this.goToHouseholdPage}>Household</a>
//       </div>
//
//     </div>
//     <div className="ticket-right">
//     </div>
// </div>
