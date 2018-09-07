import React, {Component} from 'react'
import { connect } from 'react-redux'
import { post } from '../../api_client';

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

class ManageBillsSection extends Component{
  constructor(props){
    super(props);
    let resource = capitalize(props.resource_type);
    let type = props.type
    let formResource = "total_" + type.toLowerCase()
    this.state = {
      resource: resource,
      [formResource]: 0,
      type: type,
      message: "",
      messageStyle: {
        display: 'none',
      },
      start_date: "",
      end_date: "",
      no_residents: props.noResidents,
      org_count: props.orgCount,
      num_bills: props.numBills,
      price: 0,
      loading: true,
    };
    this.disappear = this.disappear.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.assignBillPath = this.assignBillPath.bind(this);
    this.catchError = this.catchError.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAddBillsForm = this.handleAddBillsForm.bind(this);
  }

  catchError(error){
    this.setState({message: error.errors, messageStyle: {color: "#ED3838", display: 'block'}})
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
    let id = this.props.user_id
    const appg = this.assignBillPath()
    let path = `api/v1/users/${id}/${appg}`
    //make API call to post new address
    householdData = {[appg]: householdData}
      post(path, householdData)
        .then(data => this.resetForm())
        .catch(error => this.catchError(error))
    // API call above
  };

  disappear(){
    this.setState({
      message: "",
      messageStyle: {
        display: 'none',
      }
    })
  }

  resetForm() {
    let formResource = "total_" + this.props.type.toLowerCase()
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

  assignBillPath(){
    if(this.state.resource === 'Electricity'){return 'electric_bills'}
    else if(this.state.resource === 'Water'){ return 'water_bills'}
    else if(this.state.resource === 'Gas'){ return 'gas_bills'};
  }

  render(){
    let { start_date, end_date, price, resource, no_residents} = this.state;
    let formResource = "total_" + this.state.type.toLowerCase();
    let formResourceAmt = this.state[formResource];
    let isFormValid = true;
    let color = this.props.color
    return(
      <div className="manage-bills-container">
        <form
          className="form-container manage-bills"
          onSubmit={ this.handleAddBillsForm }
          >
          <h4 className="bills-errors" onClick={this.disappear} style={this.state.messageStyle}>{this.state.message}</h4>
          <h3 className="bills-title" style={{color: color}}>Add your latest { this.props.resource_type } bill below</h3>
          <div className="labels">
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
export default connect(mapStateToProps, null)(ManageBillsSection);
