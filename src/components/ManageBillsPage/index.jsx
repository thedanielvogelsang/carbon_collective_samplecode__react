import React, { Component } from 'react';
import './ManageBills-styles.css';
import ResourceNav from '../Dashboard/ResourceNav'
import {ResourceTitleDash} from '../Dashboard/ResourceTitle'
import PageSection from './PageSection';
import { withRouter } from 'react-router-dom';
import {scrollTop} from '../../helper-scripts/screenHelpers';
import { get, post } from '../../api_client';
import { connect } from 'react-redux'
import Loader from '../Loader';

const NoCarbonBillsDiv = () => {
  return (
    <div className="carbon-no-bills">
        <h1>Click the electric or heat icon to enter your usage and calculate your Carbon score</h1>
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
      errors: "",
      reloadPosts: false,
    };
    this.loadData = this.loadData.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.stopReload = this.stopReload.bind(this);
    this.reloadPosts = this.reloadPosts.bind(this);
    this.addNewError = this.addNewError.bind(this);
    this.removeNewError = this.removeNewError.bind(this);
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
        loading: true,
        navLoading: true
      }, this.loadData("reload"))
    }
  }

  updateLoader(load){
    this.setState({
      navLoading: !load,
    })
  }

  addNewError(errors){
    if(errors.error !== ""){
      this.setState({
        errors: errors.error,
      })
      setTimeout(this.removeNewError, 3000)
    }
  }

  removeNewError(){
    this.setState({
      errors: ""
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
            num_bills: data.num_bills, loading: false,
            navLoading: false})
    }
  }

  reloadPosts(){
    this.setState({
      reloadPosts: true,
    }, this.stopReload)
  }

  stopReload(){
    this.setState({
      reloadPosts: false,
    })
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
    let errors = this.state.errors;
    let reload = this.state.reloadPosts;
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
          <div className="resource-directions">
              {resource === 'water' ?
              <h1>Enter your water usage to calculate your footprint and compare your results</h1> :
              <h1>Enter your {resource} usage to calculate your carbon footprint and compare your results</h1>
              }
          </div>
          {!navLoading ? <div>
            <div className="error-box">{errors}</div>
            <PageSection title="Overview" capRes={title} noResidents={this.state.no_residents} orgCount={this.state.org_count} numBills={this.state.numBills} type={type}/>
            <PageSection title="Bill Entry" capRes={title} noResidents={this.state.no_residents} orgCount={this.state.org_count} numBills={this.state.numBills} type={type} reloadPosts={this.reloadPosts}/>
            <PageSection title="Past Bills" capRes={title} noResidents={this.state.no_residents} orgCount={this.state.org_count} numBills={this.state.numBills} type={type} addError={this.addNewError} reload={reload}/>
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
