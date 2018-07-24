import React, {Component} from 'react';
import ReactExpandableViewList from 'react-expandable-listview';
import CountryInput from './country';
import RegionInput from './region';
import CityInput from './city';
import {withRouter} from 'react-router-dom';
import './UserSignup-styles.css'
// import {countries} from '../utilities';
function assumeRegionName(id){
  if(id === 194){
    return 1
  }else if(id === 33){
    return 2
  }
}

class SearchAddress extends Component{
  constructor(){
    super();
    this.state = {
      country: '',
      region: '',
      city: '',
      neighborhood: '',
      loading: true,
    }
    this.updateArea = this.updateArea.bind(this);
    this.setStorage = this.setStorage.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.assumeNeighborhood = this.assumeNeighborhood.bind(this);
  };

  updateArea(type, id){
    if(type === 'country'){
      this.setState({
        loading: true,
        [type]: id,
      })
    }else if(type === 'region'){
      this.setState({
        loading: true,
        [type]: id,
      })
    }else if(type === 'city'){
      if(this.assumeNeighborhood(id)){
        const path = "/add_county"
        this.setStorage(id)
        this.goToPage(path)
      }
    }
  }

  setStorage(id){
    return localStorage.setItem('city_id', id)
  }

  assumeNeighborhood(id){
    if(id === 1){
      return true
    }
    return false
  }

  goToPage(path){
    this.props.history.push(path)
  }

  componentDidUpdate(prevProps, prevState){
    let regionName;
    switch(assumeRegionName(this.state.country)){
      case 1:
        regionName = "State"
        break
      case 2:
        regionName = "Province"
        break
      default:
        regionName = "Region"
    }
    if(this.state.loading === true && this.state.country === ""){
      let display = {display: 'inline-block'}
      this.setState({
        loading: false,
        data: [{
            headerName: 'what country do you live in?',
            isOpened: true,
            height: 600,
            isReactComponent: true,
            items: [
              (
                <CountryInput className="country-window" id={this.state.country} updateArea={this.updateArea} startOverBtn={display}/>
              ),
            ],
          }],
      });
    }else if(this.state.loading === true && this.state.country !== "" && this.state.region === "" ){
      let display = {display: 'inline-block'}
      let noDisplay = {display: 'none'}
      this.setState({
        loading: false,
        data: [{
            headerName: ``,
            isOpened: false,
            height: 300,
            isReactComponent: true,
            items: [
              (
                <CountryInput id={this.state.country} updateArea={this.updateArea} startOverBtn={noDisplay}/>
              ),
            ],
          },{
            headerName: `Pick your ${regionName}`,
            isOpened: true,
            height: 600,
            isReactComponent: true,
            items: [
              (
                <RegionInput regionName={regionName} id={this.state.region} country={this.state.country} updateArea={this.updateArea} startOverBtn={display}/>
              ),
            ],
          }],
        })
    }else if(this.state.loading === true && this.state.region !== "" && this.state.city === ""){
      let display = {display: 'inline-block'}
      let noDisplay = {display: 'none'}
      this.setState({
        loading: false,
        data: [{
            headerName: '',
            isOpened: false,
            height: 300,
            isReactComponent: true,
            items: [
              (
                <CountryInput id={this.state.country} updateArea={this.updateArea} startOverBtn={noDisplay}/>
              ),
            ],
          },{
            headerName: '',
            isOpened: false,
            height: 300,
            isReactComponent: true,
            items: [
              (
                <RegionInput id={this.state.region} country={this.state.country} updateArea={this.updateArea} startOverBtn={noDisplay}/>
              ),
            ],
          },{
            headerName: 'City',
            isOpened: true,
            height: 600,
            isReactComponent: true,
            style: {display: 'absolute'},
            items: [
              (
                <CityInput id={this.state.city} region={this.state.region} updateArea={this.updateArea} startOVerBtn={display}/>
              ),
            ],
          }],
        });
      }
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }

  componentDidMount(){
    document.body.scrollTop = document.documentElement.scrollTop = 0
    let display = {display: 'inline-block'}
    this.setState({
      loading: false,
      data: [{
          headerName: 'what country do you live in?',
          isOpened: true,
          height: 600,
          isReactComponent: true,
          items: [
            (
              <CountryInput className="country-window" id={this.state.country} updateArea={this.updateArea} startOverBtn={display}/>
            ),
          ],
        }],
    });
  }

  render(){
    let loading = this.state.loading;
    let data = this.state.data
    if(loading === true){
      return(
        <div></div>
      )
    }
    return(
        <div className="region-expandable-list-box">
          <ReactExpandableViewList
            className="region-expandable-list"
            data={data}
            headerAttName="headerName"
            itemsAttName="items"
          />
        </div>
    )
  }
}

export default withRouter(SearchAddress);
