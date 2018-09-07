import React, { Component } from 'react';
import './ManageBills-styles.css';
import Checklist from './Checklist';
import ResourceNav from '../Dashboard/ResourceNav'
import {ResourceTitleDash} from '../Dashboard/ResourceTitle'
import ChecklistQuestionDone from './Checklist/checklists/done.jsx';
import PageSection from './PageSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { get, post } from '../../api_client';
import { connect } from 'react-redux'
import Loader from '../Loader';



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
    let resource = props.resource_type;
    if(resource === 'carbon'){
      resource = "electricity"
    }
    let type = assignMetric(resource);
    resource = capitalize(resource);
    this.state = {
      type: type,
      resource: resource,
      loading: true,
      navLoading: true,
    };
    this.loadData = this.loadData.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.updateLoader = this.updateLoader.bind(this);

  }

  componentDidMount(){
    this.loadData()
    this.logLanding()
  }

  componentDidUpdate(prevProps, prevState){
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

  loadData(){
    let user_id = this.props.user_id
    let type = this.props.resource_type
    let user_path = `api/v1/users/${user_id}/resources?resource=${type}`
    get(user_path)
      .then(data => this.setState({no_residents: data.house.no_residents, org_count: data.house.no_residents, num_bills: data.num_bills, loading: false}))
      .catch(error => console.log(error))
  }

  goToPage(path) {
    this.props.history.push(path)
  }


  render(){
    // (start_date !== "" && end_date !== "" && total_kwatts !== 0 && bill_cost !== 0);
    let loading = this.state.loading;
    let navLoading = this.state.navLoading;
    let title = capitalize(this.props.resource_type)
    let color = this.props.color
    if(loading){
      return(
        <div></div>
      )
    }else if(!loading){
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
            <PageSection title="Overview" capRes={this.state.resource} noResidents={this.state.no_residents} orgCount={this.state.org_count} numBills={this.state.numBills} type={this.state.type}/>
            <PageSection title="Bill Entry" capRes={this.state.resource} noResidents={this.state.no_residents} orgCount={this.state.org_count} numBills={this.state.numBills} type={this.state.type}/>
            <PageSection title="Past Bills" capRes={this.state.resource} noResidents={this.state.no_residents} orgCount={this.state.org_count} numBills={this.state.numBills} type={this.state.type}/>
          </div> : <Loader /> }
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
