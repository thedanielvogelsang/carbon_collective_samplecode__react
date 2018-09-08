import React, { Component } from 'react';
import './ManageBills-styles.css';
import ResourceNav from '../Dashboard/ResourceNav'
import {ResourceTitleDash} from '../Dashboard/ResourceTitle'
import PageSection from './PageSection';
import { withRouter } from 'react-router-dom';
import { get, post } from '../../api_client';
import { connect } from 'react-redux'
import Loader from '../Loader';

const NoCarbonBillsDiv = () => {
  return (
    <div className="carbon-no-bills">
        <h1>No bills to report</h1>
    </div>
  )
}

function assignMetric(res){
  if(res==='electricity'){
    return 'kWhs'
  }else if(res === 'water'){
    return 'gallons'
  }else if(res === 'gas'){
    return 'therms'
  }
}

function capitalize(name){
  return name.charAt(0).toUpperCase() + name.slice(1);
}

class ManageBillsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      navLoading: true,
    };
    this.loadData = this.loadData.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.updateLoader = this.updateLoader.bind(this);
    this.determineReload = this.determineReload.bind(this);
  }

  componentDidMount(){
    this.loadData()
    this.logLanding()
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.resource_type !== this.props.resource_type){
      this.setState({
        navLoading: true
      }, this.loadData("reload"))
    }
  }

  updateLoader(load){
    this.setState({
      navLoading: !load,
    })
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

  loadData(reload){
    let user_id = this.props.user_id
    let type = this.props.resource_type
    let user_path = `api/v1/users/${user_id}/resources?resource=${type}`
    get(user_path)
      .then(data => this.determineReload(data, reload))
      .catch(error => console.log(error))
  }

  goToPage(path) {
    this.props.history.push(path)
  }

  determineReload(data, reload){
    switch(reload){
      case "reload":
        return this.setState({
          no_residents: data.house.no_residents,
          org_count: data.house.no_residents,
          num_bills: data.num_bills,
          loading: false, navLoading: false})
      default:
        return this.setState({
            no_residents: data.house.no_residents,
            org_count: data.house.no_residents,
            num_bills: data.num_bills, loading: false})
    }
  }

  checkResourceType(){
    switch(this.props.resource_type){
      case "carbon":
        return false
      default:
        return true
    }
  }


  render(){
    // (start_date !== "" && end_date !== "" && total_kwatts !== 0 && bill_cost !== 0);
    let loading = this.state.loading;
    let navLoading = this.state.navLoading;
    let title = capitalize(this.props.resource_type)
    let color = this.props.color
    let notCarbon = this.checkResourceType();
    let resource = this.props.resource_type;
    if(resource === 'carbon'){
      resource = "electricity"
    }
    let type = assignMetric(resource);
    if(loading){
      return(
        <div></div>
      )
    }else if(!loading && notCarbon){
    return (
      <div className="bills-page-container">
        <div className='bills-page-overlay'>
          <div className="manage-bills-header-container">
            <div className="manage-bills-overlay">
              <ResourceTitleDash color={color} title={title} graph={false} resourceType={this.props.resource_type} changePage={this.goToPage} />
              <ResourceNav updateLoader={this.updateLoader} history={this.props.history} />
            </div>
          </div>
          {!navLoading ? <div>
            <PageSection title="Overview" capRes={title} noResidents={this.state.no_residents} orgCount={this.state.org_count} numBills={this.state.numBills} type={type}/>
            <PageSection title="Bill Entry" capRes={title} noResidents={this.state.no_residents} orgCount={this.state.org_count} numBills={this.state.numBills} type={type}/>
            <PageSection title="Past Bills" capRes={title} noResidents={this.state.no_residents} orgCount={this.state.org_count} numBills={this.state.numBills} type={type}/>
          </div> : <Loader /> }
        </div>
      </div>
    )
  }else{
    return(
      <div className="bills-page-container">
        <div className='bills-page-overlay'>
          <div className="manage-bills-header-container">
            <div className="manage-bills-overlay">
              <ResourceTitleDash color={color} title={title} graph={false} resourceType={this.props.resource_type} changePage={this.goToPage} />
              <ResourceNav updateLoader={this.updateLoader} history={this.props.history} />
            </div>
          </div>
        <NoCarbonBillsDiv />
        </div>
      </div>
    )
  }
  };
};

const mapStateToProps = (state) =>{
  return({
    user_id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
    resource_type: state.userInfo.resource_type,
    color: state.userInfo.color,
  })
}
export default withRouter(connect(mapStateToProps, null)(ManageBillsPage));
