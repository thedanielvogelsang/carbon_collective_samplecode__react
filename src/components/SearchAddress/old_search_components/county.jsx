import React, {Component} from 'react';
import Select from 'react-select';
import {withRouter} from 'react-router-dom';
import {get} from '../../api_client';
import './County-styles.css'


class CountyInput extends Component{
  constructor(){
    super();
    this.state = {
      region: localStorage.getItem('region_id'),
      regionName: '',
      county: null,
      counties: null,
      loading: true,
      clearbutton: {display: 'none'},
      disabled: false,

    }
    this.loadCounties = this.loadCounties.bind(this);
    this.loadRegionName = this.loadRegionName.bind(this);
    this.setCounties = this.setCounties.bind(this);
    this.setCounty = this.setCounty.bind(this);
    this.clearCounty = this.clearCounty.bind(this);
    this.backToRegionPick = this.backToRegionPick.bind(this);
    this.storeAndgoToAddressPage = this.storeAndgoToAddressPage.bind(this);
    this.goToAddressPage = this.goToAddressPage.bind(this);
  }

  componentDidMount(){
    this.loadRegionName(this.state.region)
    this.loadCounties(this.state.region);
  }

  loadCounties(id){
    const path = `api/v1/areas/counties?region_id=${id}`
    get(path)
      .then(data => this.setCounties(data))
      .catch(error => console.log(error))
  }

  loadRegionName(id){
    get(`api/v1/areas/regions/show/${id}`)
      .then(data => this.setState({regionName: data.name}))
      .catch(error => console.log(error))
  }

  setCounties(data){
    const counties = data.map((val) => {
      return {value: val.id, label: val.name, className: 'county-list-options'}
    })
    this.setState({
      counties: counties,
      loading: false
    })
  }

  clearCounty(){
    this.setState({county: null, disabled: false, clearbutton:{display: 'none'}})
  }

  setCounty(newValue){
    let id = newValue.value;
    this.setState({county: id, disabled: true, clearbutton:{display: 'inline-block'}});
  }

  backToRegionPick(){
    this.props.history.push('/search_address')
  }

  storeAndgoToAddressPage(){
    let cId = this.state.county
    if(cId !== null && cId !== ''){
      localStorage.setItem('county_id', cId)
      this.goToAddressPage(this.state.region)
    }else{
      return alert("You must choose a county to continue")
    }
  }

  goToAddressPage(id){
      if(this.assumeNeighborhood(id)){
        const path = "/add_neighborhood"
        this.props.history.push(path)
      }else{
        localStorage.setItem('neighborhood_id', false)
        const path = "/add_address"
        this.props.history.push(path)
      }
  }

  assumeNeighborhood(id){
    if(id === '6'){
      return true
    }
    return false
  }

  render(){
    if(this.state.loading){
      return(
        <div></div>
      )
    }else{
      return(
        <div className="region-expandable-list-box outside-div">
          <div className="county-header">
            <p>County Select</p>
          </div>
          <div className="county-box">
          <div className='forward-backward-links-container-countys'>
            <button
              className="region-next"
              onClick={this.backToRegionPick}
              style={this.state.backbutton}
              >Start Over</button>
            <button
              className="region-next clear-region"
              onClick={this.clearCounty}
              style={this.state.clearbutton}
              >Clear {this.props.regionName}</button>
            <button
              className="region-next"
              onClick={this.storeAndgoToAddressPage}
              >Next </button>
          </div>
            <Select
              className="countyForm"
              name="county-form-field"
              value={this.state.county}
              placeholder={this.state.regionName + "'s Countys"}
              inputProps={{autoComplete: 'off', placeholder: 'click here to select county'}}
              options={this.state.counties}
              onChange={this.setCounty}
              disabled={this.state.disabled}
              matchPos='any'
              id="countyform-input"
              />
            </div>
        </div>
      )
    }
  }
}

export default withRouter(CountyInput)
