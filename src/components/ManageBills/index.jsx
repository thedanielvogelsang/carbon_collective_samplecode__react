import React, { Component } from 'react';
import './ManageBills-styles.css';
import PastBills from './PastBillsPage';
import Checklist from './Checklist';
import ChecklistQuestionDone from './Checklist/checklists/done.jsx';
import { withRouter } from 'react-router-dom';
import { get, post } from '../../api_client';


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

class ManageBills extends Component {
  constructor() {
    super();
    let resource = localStorage.getItem('resource_type') || 'electricity';
    let color = localStorage.getItem('accent_color' || '#1fa245');
    let user_id = sessionStorage.getItem('user_id');
    let type = assignMetric(resource);
    let formResource = "total_" + type.toLowerCase()
    resource = capitalize(resource);
    this.state = {
      type: type,
      resource: resource,
      loading: true,
      message: "",
      messageStyle: {
        display: 'none',
      },
      start_date: "",
      end_date: "",
      no_residents: null,
      org_count: null,
      price: 0,
      [formResource]: 0,
      house_id: null,
      user_id: user_id,
      display: false,
      checklistDisplay: 'none',
      color: color,
      formHighlight: '#2A2C33',
      percentage: 0,
      review: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAddBillsForm = this.handleAddBillsForm.bind(this);
    this.disappear = this.disappear.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.billSuccess = this.billSuccess.bind(this);
    this.assignBillPath = this.assignBillPath.bind(this);
    this.catchError = this.catchError.bind(this);
    this.openCloseChecklist = this.openCloseChecklist.bind(this);
    this.highlightForm = this.highlightForm.bind(this);
    this.unhighlightForm = this.unhighlightForm.bind(this);
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount(){
    this.loadData()
    this.logLanding()
  }

  componentDidUpdate(prevProps, prevState){
    console.log(this.state.display, this.state.review, this.state.checklistDisplay)
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

  loadData(){
    let user_id = sessionStorage.getItem("user_id")
    let type = localStorage.getItem('resource_type')
    let user_path = `api/v1/users/${user_id}/resources?resource=${type}`
    get(user_path)
      .then(data => this.setState({house_id: data.household.id, no_residents: data.household.no_residents, org_count: data.household.no_residents, user_id: user_id, num_bills: data.num_bills, loading: false}))
      .catch(error => console.log(error))
  }

  updateState(name, value){
    this.setState({
      [name]: value,
    })
  }

  highlightForm(name, value){
    this.setState({
      [name]: value,
    })
    setTimeout(this.unhighlightForm, 2000)
  }

  unhighlightForm(){
    this.setState({
      formHighlight: '#2A2C33'
    })
  }

  assignBillPath(){
    if(this.state.resource === 'Electricity'){return 'electric_bills'}
    else if(this.state.resource === 'Water'){ return 'water_bills'}
    else if(this.state.resource === 'Gas'){ return 'gas_bills'};
  }

  billSuccess(data){
    this.resetForm();
    // this.goToPage('/dashboard');
  }

  goToPage(path) {
    this.props.history.push(path)
  }

  disappear(){
    this.setState({
      message: "",
      messageStyle: {
        display: 'none',
      }
    })
  }

  resetForm() {
    let formResource = "total_" + this.state.type.toLowerCase()
    this.setState({
      errors: "",
      start_date: "",
      end_date: "",
      price: 0,
      [formResource]: 0,
      house_id: null,
      message: "success!",
      messageStyle: {color: "#1fa245", fontSize: "1.3em", display: 'block'},
    }, this.loadData())
  }

  handleChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
    if(name === "no_residents" && value !== "" && Number(value) < this.state.org_count){
      return null
    }else{
      this.setState({
        [name]: value,
      });
    }
  }

  handleAddBillsForm(event){
    event.preventDefault();
    let householdData = this.state;
    let id = sessionStorage.getItem("user_id")
    const appg = this.assignBillPath()
    let path = `api/v1/users/${id}/${appg}`
    //make API call to post new address
    householdData = {[appg]: householdData}
      post(path, householdData)
        .then(data => this.billSuccess(data))
        .catch(error => this.catchError(error))
    // API call above
  };

  openCloseChecklist(){
    let display = !this.state.display
    if(display){
      this.setState({checklistDisplay: "flex", display: display})
    }else{
      this.setState({checklistDisplay: 'none', display: display})
    }
  }

  catchError(error){
    this.setState({message: error.errors, messageStyle: {color: "#ED3838", display: 'block'}})
  }

  render(){
    let color;
    this.state.resource === 'Water' ? color = 'white' : color = this.state.color;
    let { start_date, end_date, price, resource, no_residents} = this.state;
    let isFormValid = true;
    // (start_date !== "" && end_date !== "" && total_kwatts !== 0 && bill_cost !== 0);
    let formResource = "total_" + this.state.type.toLowerCase();
    let formResourceAmt = this.state[formResource];
    let loading = this.state.loading;
    let percent = this.state.percentage;
    let review = this.state.review;
    if(loading){
      return(
        <div></div>
      )
    }else if(!loading){
    return (
      <div className="bills-page-container">
        <div className='bills-page-overlay'>
          <h6 className="bill-type-header"  >{this.state.resource} Bills</h6>
          {percent === 100 && !review ? <ChecklistQuestionDone updateState={this.updateState} user_id={this.state.user_id} house_id={this.state.house_id}/> :
          <div className="expandable-checklist">
            <div className="header-checklist-outline">
              <div className="header-checklist-div" onClick={this.openCloseChecklist}>
                <h3 className="checklist-header">{resource} Checklist</h3>
                <p className="checklist-completion-pct">{percent}% complete</p>
              </div>
            </div>
            <div className="checklist-container" style={{display: this.state.checklistDisplay}}>
              <Checklist resource={resource} percentage={this.state.percentage} review={this.state.review} house={this.state.house_id} user={this.state.user_id} updateState={this.updateState}/>
            </div>
          </div>
          }
          <div className="manage-bills-page">
            <div className="manage-bills-container">
              <form
                className="form-container manage-bills"
                onSubmit={ this.handleAddBillsForm }
              >
              <h4 className="bills-errors" onClick={this.disappear} style={this.state.messageStyle}>{this.state.message}</h4>
              <h3 className="bills-title" style={{color: color, textShadow: "1px 1px black"}}>Add your latest {localStorage.getItem('resource_type') } bill below</h3>
              <div className="labels" style={{borderColor: this.state.formHighlight}}>
                <div className="bills-form-line1">
                  <label className='start-date-label'>
                    <h5>Start Date</h5>
                    <input
                      id="calendar-1"
                      required="true"
                      type="date"
                      name="start_date"
                      value={ start_date }
                      onChange={ this.handleChange }
                    />
                  </label>
                  <label>
                    <h5>Total {capitalize(this.state.type)}</h5>
                    <input
                      required="true"
                      type="number"
                      name={ formResource }
                      placeholder="Total Consumption"
                      min="0"
                      value={ formResourceAmt }
                      onChange={ this.handleChange }
                      />
                  </label>
                </div>
                <div className="bills-form-line2">
                  <label>
                    <h5>End Date</h5>
                    <input
                      id="calendar-2"
                      required="true"
                      type="date"
                      name="end_date"
                      value={ end_date }
                      onChange={ this.handleChange }
                      />
                  </label>
                  <label className="bill-cost">
                    <h5>Bill Cost</h5>
                    <input
                      // required="true"
                      type="number"
                      name="price"
                      placeholder="Total Bill Cost"
                      min="0"
                      value={ price }
                      onChange={ this.handleChange }
                    />
                  </label>
                </div>
                <div className="bills-form-line3">
                <label>
                  <h5>Number of People</h5>
                  <p className="no_people_ptag">(reflected on this bill)</p>
                  <input
                    id="no_residents"
                    required="true"
                    type="number"
                    name="no_residents"
                    min={this.state.no_residents}
                    value={ no_residents }
                    onChange={ this.handleChange }
                    />
                </label>
                <label className="bill-cost">
                  <div className="bills-button-container">
                  <button
                    className="bills-button"
                    disabled={ !isFormValid }
                    type="submit"
                  >Save {this.state.resource} Bill</button>
                  </div>
                </label>
                </div>
              </div>
              </form>
            </div>
            <PastBills num={this.state.num_bills} highlightForm={this.highlightForm} metric={this.state.type}/>
          </div>
        </div>
      </div>
    )
  }
  };
};

export default withRouter(ManageBills);
