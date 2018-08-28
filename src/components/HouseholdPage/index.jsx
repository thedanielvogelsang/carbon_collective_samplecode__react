import React, {Component} from 'react';
import HouseholdData from '../HouseholdData';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import {get} from '../../api_client';
import {connect} from 'react-redux'

import "typeface-roboto";
import './HouseholdPage-styles.css';

const styles = {
  largeIcon: {
    color: '#415B2F',
    width: 198,
    height: 198,
    alignContent: 'center',
    justifyContent: 'center',
    paddingBottom: '10px',
    position: 'absolute',
    right: '120px',
    bottom: 0,
  },
  icon: {
    width: 196,
    height: 176,
    padding: 24,
    position: 'absolute',
    bottom: 30,
    right: 20,
    marginTop: -20,
  }
}

class HouseholdPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      house_id: undefined,
      loaded: false,
    }
    this.setLoad = this.setLoad.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount(){
    if(this.state.house_id === undefined){
      let id = this.props.house_id
      this.resetHouseId(id)
    }else{
      this.getData()
    }
  }

  componentDidUpdate(){
    // console.log(this.state.houseData)
  }

  getData(){
    let id = this.props.house_id;
    let _res = this.props.resource_type;
    const path = `api/v1/houses/${id}?resource=${_res}`;
    get(path)
      .then(data => this.setLoad(data))
      .catch(error => console.log(error))
  }

  setLoad(data){
    this.setState({
      houseData: data,
      loaded: true
    })
  }

  resetHouseId(id){
    this.setState({
      house_id: id
    }, () => {
      this.getData()
    });
  }

  render(){
    let loaded = this.state.loaded
    if(loaded){
      return(
        <div className="household-data-page">
          { this.state.loaded ? <HouseholdData data={this.state.houseData} /> : null }
          <MuiThemeProvider>
          <IconButton className="home-icon-space" iconStyle={styles.largeIcon} style={styles.icon}>
            <ActionHome className="home-icon"/>
          </IconButton>
          </MuiThemeProvider>
        </div>
      )
    }else{
      return(
        <div></div>
      )
    }
  }
}


const mapStateToProps = (state) => {
  return({
    house_id: state.userInfo.house_id,
    resource_type: state.userInfo.resource_type,
    color: state.userInfo.color,
  })
}


export default connect(mapStateToProps, null)(HouseholdPage);
