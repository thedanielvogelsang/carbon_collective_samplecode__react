import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {get} from '../../../api_client';
import {connect} from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';
import './PastBillsPage-styles.css';

const Bill = function(props){
  // let color = localStorage.getItem("accent_color")
    return(
      <div className="bill-container">
            <div className="past-bill-stat">
              <h3 className="values"><span className="bill-time italic" onClick={props.handleBillChange}>{props.bill.who}</span></h3>
            </div>
            <div className="past-bill-stat">
              <h3 className="values"><span className="bill-time" onClick={props.handleBillChange}>{props.bill.start_date}</span></h3>
            </div>
            <div className="past-bill-stat">
              <h3 className="values"><span className="bill-time" onClick={props.handleBillChange}>{props.bill.end_date}</span></h3>
            </div>
            <div className="past-bill-stat">
              <h3 className="values"><span className="bill-time" onClick={props.handleBillChange}>{props.bill.total_used}</span></h3>
            </div>
            <div className="past-bill-stat">
              <h3 className="values"><span className="bill-time" onClick={props.handleBillChange}>{props.bill.no_residents}</span></h3>
            </div>
            <div className="past-bill-stat usage">
              <h3 className="values"><span className="bill-time" onClick={props.handleBillChange}>{props.bill.average_daily}</span></h3>
            </div>
            <div className="past-bill-stat cost">
              <h3 className="values"><span className="bill-time" onClick={props.handleBillChange}> ${props.bill.price}</span></h3>
            </div>
      </div>
    )
  }

const renderBills = function(bills, billType, i, num){
  return bills.map((bill, n) => {
      return(
        <div key={n}>
          <Bill n={n+i} bill={bill} type={billType}/>
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
        <div className="past-bill-title">
          <h3 className='xtra' style={{color: color, textShadow: "1px 1px black"}}>who :  </h3>
        </div>
        <div className="past-bill-title time">
        <h3 className='xtra' style={{color: color, textShadow: "1px 1px black"}}>start :  </h3>
        </div>
        <div className="past-bill-title time">
        <h3 className='xtra end' style={{color: color, textShadow: "1px 1px black"}}>end :  </h3>
        </div>
        <div className="past-bill-title usage">
        <h3 className='xtra wide' style={{color: color, textShadow: "1px 1px black"}}>total use ({props.metric}):  </h3>
        </div>
        <div className="past-bill-title no-residents">
        <h3 className='xtra wide' style={{color: color, textShadow: "1px 1px black"}}>no. residents :  </h3>
        </div>
        <div className="past-bill-title daily-avg">
        <h3 className='xtra wide avg' style={{color: color, textShadow: "1px 1px black"}}>daily average use per person ({props.metric}):  </h3>
        </div>
        <div className="past-bill-title">
        <h3 className='xtra' style={{color: color, textShadow: "1px 1px black"}}>cost :  </h3>
        </div>
      </div>
      <div className="billyear-bills-container">
        {renderBills(props.bills, props.billType, props.n, props.num)}
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
    this.highlightForm = this.highlightForm.bind(this);
    this.sortBills = this.sortBills.bind(this);
  }

  componentDidMount(){
    this.loadBills()
  }

  componentDidUpdate(prevProps, prevState){
    if(prevProps.num !== this.props.num && this._ismounted == true){
      this.setState({billArray: {}}, this.loadBills())
    }
    if(prevProps.resource_type !== this.props.resource_type && this._ismounted == true){
      this.loadBills()
    }
  }

  highlightForm(e){
    e.preventDefault();
    this.props.highlightForm('formHighlight', '#29d967')
    return document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  loadBills(){
    let id = this.props.user_id
    const path = `api/v1/users/${id}/bills/${this.props.resource_type}`
    get(path)
      .then(data => this.sortBills(data))
      .catch(error => error)
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

  returnBills(){
    if(Object.keys(this.state.billArray).length === 0){
      return(
        <div className="no-bills-container">
          <h3 className="no-bills-title">No Bills to Date</h3>
          <p className="no-bills-ptag">add new bill
            <a className="no-bills-link" href="" onClick={this.highlightForm}>
            HERE
            <MuiThemeProvider>
                <FontIcon className="material-icons add_new_arrow">keyboard_arrow_right</FontIcon>
            </MuiThemeProvider>
            </a>
          </p>
        </div>
      );
    }else{
      return Object.keys(this.state.billArray).reverse().map((year, n) => {
        let bills = this.state.billArray[year]
        return (
          <BillYear key={n} year={year} n={n} bills={bills} billType={this.props.resource_type} num={this.props.num} metric={this.props.metric}/>
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
