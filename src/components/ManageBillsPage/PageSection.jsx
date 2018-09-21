import React, {Component} from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Checklist from './ChecklistSection';
import ManageBillsSection from './ManageBillsSection';
import PastBillsPage from './PastBillsSection';

class PageSection extends Component{
  constructor(props){
    super(props);
    this.state = {
      open: false,
      arrow: 'caret-right',
      sectionName: 'section-content-div',
      sectionContent: 'section-content',
      reloadPosts: false,
    };
    this.changeArrow = this.changeArrow.bind(this);
    this.closeDiv = this.closeDiv.bind(this);
  }

  componentDidMount(){
  }

  componentDidUpdate(){
  }

  closeDiv(name){
    if(name==="checklist"){
      return this.setState({
        open: false,
        arrow: 'caret-right',
        sectionName: "section-content-div disappear",
        sectionContent: 'section-content disappear'
      })
    }else{
      return this.setState({
        open: false,
        arrow: 'caret-right',
        sectionName: "section-content-div disappear",
        sectionContent: 'section-content disappear'
      }, this.reloadPosts())
    }

  }

  changeArrow(e){
    let a, name, s_name;
    let open = this.state.open
    !open ? a = 'caret-down' : a = 'caret-right'
    !open ? name = "section-content-div appear" : name = "section-content-div disappear"
    !open ? s_name = "section-content appear" : s_name = "section-content disappear"
    this.setState({
      open: !open,
      arrow: a,
      sectionName: name,
      sectionContent: s_name,
    })
  }

  render(){
    let overview = false;
    let manage = false;
    let past = false;
    switch(this.props.title){
      case "Overview":
        overview = true
        break
      case "Bill Entry":
        manage = true
        break
      case "Past Bills":
        past = true
        break
      default:
        break
    }
    return(
      <div className="manage-section-master-div">
        <div className="section-title-row">
          <div className="arrow-div" onClick={(e) => this.changeArrow(e)}>
            <FontAwesomeIcon icon={this.state.arrow} size="lg"/>
          </div>
          <div className="section-title-div" onClick={(e) => this.changeArrow(e)}>
            <h1>{this.props.title}</h1>
          </div>
        </div>
        <div className={this.state.sectionName} >
            <div className={this.state.sectionContent}>
              {overview ? <Checklist resource={this.props.capRes} house={this.props.house_id} user={this.props.user_id} closeDiv={this.closeDiv}/> : null }
              {manage ? <ManageBillsSection noResidents={this.props.noResidents} numBills={this.props.numBills} closeDiv={this.closeDiv} orgCount={this.props.orgCount} type={this.props.type} reloadPosts={this.reloadPosts}/> : null }
              {past ? <PastBillsPage num={this.props.numBills} metric={this.props.type} addError={this.props.addError}/> : null }
            </div>
        </div>
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
export default connect(mapStateToProps, null)(PageSection);
