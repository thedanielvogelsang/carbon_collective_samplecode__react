import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {get, put, destroy} from '../../../api_client';
import {scrollTop} from '../../../helper-scripts/screenHelpers.js'
import {connect} from 'react-redux';
import './PastBillsPage-styles.css';

function rowColor(num){
  return num % 2 === 0 ? "#f5f5f5" : "#FFFFFF"
}

function sortName(name, resType){
  if(name === "total_used"){
    switch(resType){
      case "electricity":
        return "total_kwhs"
      case "water":
        return "total_gallons"
      case "gas":
        return "total_therms"
      default:
        return name
    }
  }else{
    return name
  }
}
function sortType(resType){
  switch(resType){
    case "electricity":
      return "electric_bills"
    case "water":
      return "water_bills"
    case "gas":
      return "gas_bills"
    default:
      return resType
  }
}
function sortDate(date, year){
  var regExp = (/[0-9]{4}/)
  if(!regExp.test(date)){
    return date + " " + year
  }else{
    return date
  }
}

const Bill = function(props){
  let color = rowColor(props.n)
    return(
      <div className="bill-container" style={{backgroundColor: color}}>
            <div className="bill-delete-div">
              <button
                className="bill-delete-btn"
                name="bill"
                onClick={(e) => props.deleteBill(e, props.bill.id)}
                >X
              </button>
            </div>
            <div className="past-bill-stat who">
              <h3 name="who" className="values who">{props.bill.who}</h3>
            </div>
            <div className="past-bill-stat time">
              <h3 name="start_date" className="values larger time">{props.bill.start_date}</h3>
            </div>
            <div className="past-bill-stat time">
              <h3 name="end_date" className="values larger time">{props.bill.end_date}</h3>
            </div>
            <div className="past-bill-stat usage">
              <h3 name="total_used" className="values usage">{props.bill.total_used}</h3>
            </div>
            <div className="past-bill-stat no_residents">
              <h3 name="no_residents" className="values smaller no_residents">{props.bill.no_residents}</h3>
            </div>
            <div className="past-bill-stat avg_use">
              <h3 name="avg_daily" className="values usage larger avg_use">{props.bill.average_use}</h3>
            </div>
            <div className="past-bill-stat cost">
              <h3 name="price" className="values smaller cost">{`$${props.bill.price}`}</h3>
            </div>
      </div>
    )
  }

// <input name="start_date" className="values larger" onBlur={(e)=>props.updateBillAndChangeToInactive(e, props.bill.id, props.year)} placeholder={props.bill.start_date} onFocus={(e) => {e.target.placeholder = ''}}></input>
// <input name="end_date" className="values larger" onBlur={(e)=>props.updateBillAndChangeToInactive(e, props.bill.id, props.year)} placeholder={props.bill.end_date} onFocus={(e) => {e.target.placeholder = ''}}></input>
// <input name="price" className="values smaller cost" onBlur={(e)=>props.updateBillAndChangeToInactive(e, props.bill.id)} placeholder={`$${props.bill.price}`} onFocus={(e) => {e.target.placeholder = ''}}></input>


const renderBills = function(deleteBillFunc, billUpdateFunc, bills, billType, i, num, year){
  return bills.map((bill, n) => {
      return(
        <div key={n}>
          <Bill n={n+i} bill={bill} type={billType} deleteBill={deleteBillFunc} updateBillAndChangeToInactive={billUpdateFunc} year={year}/>
        </div>
      );
  });
}

const BillYear = function(props){
  let color = localStorage.getItem("accent_color")
  return(
    <div key={props.year} className="billyear-container">
      <div className="billyear">
        <h4>{props.year}</h4>
      </div>
      <div className="bills-titles">
        <div className="past-bill-title who" >
          <h3 className='who' style={{color: color, textShadow: "1px 1px black"}}>Who:  </h3>
        </div>
        <div className="past-bill-title time">
          <h3 className='time' style={{color: color, textShadow: "1px 1px black"}}>Start Date:  </h3>
        </div>
        <div className="past-bill-title time">
          <h3 className='time' style={{color: color, textShadow: "1px 1px black"}}>End Date:  </h3>
        </div>
        <div className="past-bill-title usage">
          <h3 className='usage' style={{color: color, textShadow: "1px 1px black"}}>Use ({props.metric}):  </h3>
        </div>
        <div className="past-bill-title no-residents">
          <h3 className='no-residents' style={{color: color, textShadow: "1px 1px black"}}>Residents :  </h3>
        </div>
        <div className="past-bill-title avg_use">
          <h3 className='avg_use' style={{color: color, textShadow: "1px 1px black"}}>Daily Average use per Person ({props.metric}):  </h3>
        </div>
        <div className="past-bill-title cost">
          <h3 className='cost' style={{color: color, textShadow: "1px 1px black"}}>Cost :  </h3>
        </div>
      </div>
      <div className="billyear-bills-container">
        {renderBills(props.deleteBillFunc, props.billUpdateFunc, props.bills, props.billType, props.n, props.num, props.year)}
      </div>
    </div>
  )
}

class PastBillsPage extends Component{
  constructor(props){
    super(props)
    this.state = {
      loaded: false,
      foot_url: './img/FOOT_blank.png',
      billArray: {},
    }
    this.loadBills = this.loadBills.bind(this);
    this.sortBills = this.sortBills.bind(this);
    this.deleteBill = this.deleteBill.bind(this);
    this.addAndLoadBills = this.addAndLoadBills.bind(this);
    this.updateBillAndChangeToInactive = this.updateBillAndChangeToInactive.bind(this);
  }

  componentDidMount(){
    this.loadBills()
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.num !== this.props.num && this._ismounted === true){
      this.setState({billArray: {}}, this.loadBills())
    }
    if(prevProps.resource_type !== this.props.resource_type && this._ismounted === true){
      this.loadBills()
    }
    if(this.props.reloadPosts){
      this.loadBills()
    }
  }

  loadBills(){
    let id = this.props.user_id
    const path = `api/v1/users/${id}/bills/${this.props.resource_type}`
    get(path)
      .then(data => this.sortBills(data))
      .catch(error => console.log(error))
  }

  sortBills(data){
    let billArray = {}
    data.forEach((bill) => {
      billArray[bill.year] = billArray[bill.year] || []
      billArray[bill.year].push(bill)
      return billArray
    })
    this.setState({billArray, loaded: true})
  }

  deleteBill(event, id){
    event.preventDefault();
    if(confirm("Are you sure you want to delete this bill record? Warning:: You can't undo this.")){
    event.target.parentNode.parentNode.classList.add("disappear")
    let uId = this.props.user_id
    let type = sortType(this.props.resource_type)
    let path = `api/v1/users/${uId}/${type}?id=${id}`
    destroy(path)
      .then(data => console.log())
      .catch(error => this.addAndLoadBills(error, true))
    }
  }

  updateBillAndChangeToInactive(e, id, year){
    if(e.target.value === ""){
      this.addAndLoadBills({errors: ""})
    }else{
      let user_id = this.props.user_id
      let resource = this.props.resource_type
      let name = sortName(e.target.name, resource)
      let type = sortType(resource)
      let value = (name === "start_date" || name === "end_date") ? sortDate(e.target.value, year) : e.target.value
      const path = `api/v1/users/${user_id}/bills/${resource}/${id}`
      const billData = {[type]: {[name]: value}}
      put(path, undefined, billData)
        .then(data => this.addAndLoadBills(data))
        .catch(error => this.addAndLoadBills(error, true))
    }
  }

  addAndLoadBills(data, scroll = false){
    this.setState({loaded: false})
    this.loadBills()
    scroll ? scrollTop() : console.log()
    this.props.addError(data)
  }

  returnBills(){
    if(Object.keys(this.state.billArray).length === 0){
      return(
        <div className="no-bills-container">
          <h4 className="no-bills-title">No Bills to Date</h4>
          <p className="no-bills-ptag">add new bill above
          </p>
        </div>
      );
    }else{
      return Object.keys(this.state.billArray).reverse().map((year, n) => {
        let bills = this.state.billArray[year]
        return (
          <BillYear key={n} year={year} n={n} bills={bills} billType={this.props.resource_type} num={this.props.num} metric={this.props.metric} deleteBillFunc={this.deleteBill} billUpdateFunc={this.updateBillAndChangeToInactive}/>
        )
      });
    }
  }

  render(){
    let loaded = this.state.loaded;
    return(
      <div className="bills-container">
        <div className='bills-container-2'>
          <div className="bills-page-div">
            {loaded ? this.returnBills() : null }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return({
    user_id: state.userInfo.user_id,
    house_id: state.userInfo.house_id,
    resource_type: state.userInfo.resource_type,
    color: state.userInfo.color,
  })
}

// <img
//     className="carbon-foot-print"
//     alt="carbon collective logo"
//     name="carbon"
//     style={{height: '50%', width: '50%'}}
//     src={require(`${props.foot_url}`)} />

export default withRouter(connect(mapStateToProps, null)(PastBillsPage));
