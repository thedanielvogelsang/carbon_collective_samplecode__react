import React, {Component} from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class ManageSection extends Component{
  constructor(){
    super();
    this.state = {
      open: false,
      arrow: 'caret-right',
      sectionName: 'section-content-div',
      sectionContent: 'section-content',
    };
    this.changeArrow = this.changeArrow.bind(this);
  }

  componentDidUpdate(){

  }

  changeArrow(e){
    let a, name, s_name;
    open = this.state.open
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
    return(
      <div className="manage-section-master-div">
        <div className="section-title-row">
          <div className="arrow-div" name={this.props.name} onClick={(e) => this.changeArrow(e)}>
            <FontAwesomeIcon icon={this.state.arrow} size="lg"/>
          </div>
          <div name={this.props.name} className="section-title-div" onClick={(e) => this.changeArrow(e)}>
            <h1>{this.props.title}</h1>
          </div>
        </div>
        <div className={this.state.sectionName} >
            <div className={this.state.sectionContent}>
              <h1> Here it is!</h1>
              <p>a;lsdkfj asdfl; nyd d ymdasl;gj;l y ;lkj ucuc y aopdgjop ay mepe py yoyoel cuany apl yjsaeuzou;uey. </p>
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
export default connect(mapStateToProps, null)(ManageSection);
