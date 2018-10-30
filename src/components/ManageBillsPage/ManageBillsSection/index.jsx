import React, {Component} from 'react'
import { connect } from 'react-redux'
import { post } from '../../../api_client';
import {scrollTop} from '../../../helper-scripts/screenHelpers.js';
import {fetchDashData} from '../../../actions/userActions.js';
import $ from "jquery";



function capitalize(name){
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function checkDateFormat(date){
  var regExp = (/^\d{4}\-\d{2}\-\d{2}$/)
  return regExp.test(date)
}

class ManageBillsSection extends Component{
  constructor(props){
    super(props);
    let resource = capitalize(props.resource_type);
    let type = props.type
    let formResource = "total_" + type.toLowerCase()
    this.state = {
      resource: resource,
      [formResource]: "",
      type: type,
      message: "",
      messageStyle: {
        display: 'none',
      },
      house_id: props.house_id,
      start_date: "",
      end_date: "",
      no_residents: props.noResidents,
      org_count: props.orgCount,
      num_bills: props.numBills,
      force: false,
      price: "",
      loading: true,
    };
    this.disappear = this.disappear.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.turnOffButton = this.turnOffButton.bind(this);
    this.turnOnButton = this.turnOnButton.bind(this);
    this.assignBillPath = this.assignBillPath.bind(this);
    this.catchError = this.catchError.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddBillsForm = this.handleAddBillsForm.bind(this);
  }

  componentDidMount(){
  }

  catchError(error){
    if(error.errors === "resource usage is much higher than average, are you sure you want to proceed?"){
      if(confirm(error.errors)){
        this.setState({force: true})
        return setTimeout(this.handleAddBillsForm, 1000, {preventDefault: function(){}})
      }else{
        return this.resetForm(false)
      }
    }
    else{
      this.setState({message: error.errors, messageStyle: {color: "#ED3838", display: 'block'}})
      setTimeout(this.resetForm, 1300, false)
    }
  }

  componentDidUpdate(prevProps, prevState){
  }

  handleChange(event){
    const target = event.target;
    const name = target.name;
    const value = target.value;
      this.setState({
        [name]: value,
      });
  }

  handleAddBillsForm(event){
    event.preventDefault();
    this.turnOffButton();
    let householdData = this.state;
    let id = this.props.user_id
    const appg = this.assignBillPath()
    let path = `api/v1/users/${id}/${appg}`
    if(checkDateFormat(householdData['end_date']) && checkDateFormat(householdData['start_date'])){
      //make API call to post new bill
      householdData = {[appg]: householdData}
        post(path, householdData)
          .then(data => this.resetForm(true))
          .catch(error => this.catchError(error))
      // API call above
    }else{
      alert("One or more of your dates was not in the correct format: 'mm/dd/yyyy'")
      this.setState({
        start_date: "",
        end_date: "",
      })
    }

  };

  turnOffButton(){
    $('#billsButton').on('click', function() {
            $(this).prop('disabled', true);
          });
    setTimeout(this.turnOnButton, 2000)
  }
  turnOnButton(){
    $('#billsButton').prop('disabled', false);
  }

  disappear(){
    this.setState({
      message: "",
      messageStyle: {
        display: 'none',
      }
    })
  }

  resetForm(alertNotice=true) {
    alertNotice ? alert("Bill save was a success") : console.log()
    this.props.fetchDashData(this.props.user_id, this.props.resource_type)
    let formResource = "total_" + this.props.type.toLowerCase()
    let fireCloseDiv = this.props.closeDiv
    var myFunct = function(){
      if(alertNotice){
        fireCloseDiv('bills')
        scrollTop()
      }
    }
    this.setState({
      errors: "",
      house_id: this.props.house_id,
      start_date: "",
      end_date: "",
      no_residents: this.props.no_residents,
      org_count: this.props.orgCount,
      num_bills: this.props.numBills,
      [formResource]: "",
      force: false,
      price: "",
      loading: true,
    }, myFunct())
  }

  assignBillPath(){
    if(this.state.resource === 'Electricity'){return 'electric_bills'}
    else if(this.state.resource === 'Water'){ return 'water_bills'}
    else if(this.state.resource === 'Gas'){ return 'gas_bills'};
  }

  render(){
    let { start_date, end_date, price, no_residents} = this.state;
    let formResource = "total_" + this.state.type.toLowerCase();
    let formResourceAmt = this.state[formResource];
    let isFormValid = true;
    return(
      <div>
        <form
          className="form-container manage-bills"
          onSubmit={ this.handleAddBillsForm }
          >
          <div style={this.state.messageStyle}>
            <h4 className="bills-errors" onClick={this.disappear} style={this.state.messageStyle}>{this.state.message}</h4>
          </div>
          <div>
            <h5>Start Date</h5>
            <input
              id="calendar-1"
              required="true"
              type="date"
              name="start_date"
              placeholder="dd/mm/yyyy"
              value={ start_date }
              onChange={ this.handleChange }
            />
          </div>
          <div>
            <h5>End Date</h5>
            <input
              id="calendar-2"
              required="true"
              placeholder="dd/mm/yyyy"
              type="date"
              name="end_date"
              value={ end_date }
              onChange={ this.handleChange }
              />
          </div>
          <div>
            <h5>Total {capitalize(this.state.type)}</h5>
            <input
              id="total-amt"
              required="true"
              type="number"
              name={ formResource }
              placeholder="0"
              min="0"
              value={ formResourceAmt }
              onChange={ this.handleChange }
              />
          </div>
          <div className="bill-cost">
            <h5>Bill Cost</h5>
            <input
              id="bill-cost"
              required="true"
              type="number"
              name="price"
              placeholder="0"
              step="any"
              min="0"
              value={ price }
              onChange={ this.handleChange }
            />
          </div>
          <div>
            <div className='no-res-div'>
              <h5>Number of People</h5>
              <p className="no_people_ptag">(reflected on this bill)</p>
            </div>
            <input
              id="no_residents"
              required="true"
              type="number"
              name="no_residents"
              min="0"
              value={ no_residents }
              onChange={ this.handleChange }
              />
          </div>
          <div>
            <button
              id="billsButton"
              className="bills-button"
              disabled={ !isFormValid }
              type="submit"
              >Save {this.state.resource} Bill</button>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) =>{
  return({
    user_id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
    resource_type: state.userInfo.resource_type,
    color: state.userInfo.color,
  })
}
export default connect(mapStateToProps, {fetchDashData})(ManageBillsSection);
