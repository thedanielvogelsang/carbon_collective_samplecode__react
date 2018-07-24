import React, {Component} from 'react';
import RegionList from '../RegionList'
import './RegionPage-styles.css'


function capitalize(word){
  return word.charAt(0).toUpperCase() + word.slice(1)
}

class RegionPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      region: props.data.region_type,
      id: props.data.region_id,
      name: props.data.region_name,
      type: props.data.resource_type,
      parent: props.data.region_parent,
    }
    this.reLoadPage = this.reLoadPage.bind(this);
    this.setRegionState = this.setRegionState.bind(this);
    this.setData = this.setData.bind(this);
  }

  reLoadPage(){
    localStorage.setItem('resource_type', this.state.type)
    localStorage.setItem('region_type', this.state.region)
    localStorage.setItem('region_id', this.state.id)
    localStorage.setItem('region_name', this.state.name)
    localStorage.setItem('region_parent', this.state.parent)
  }

  setRegionState(region, id, name, res_type, parent){
    this.setState({region: region, id: id, name: name, type: res_type, parent: parent})
  }

  componentDidMount(){
    window.addEventListener('beforeunload', this.reLoadPage)
    const regionState = localStorage.getItem('region_type')
    const regionId = localStorage.getItem('region_id')
    const regionName = localStorage.getItem('region_name')
    const resourceType = localStorage.getItem('resource_type')
    const parent = localStorage.getItem('region_parent')
    // const personalScore = localStorage.getItem('avg_monthly_consumption')
    if(this.state.region === null || this.state.region === undefined){
      this.setRegionState(regionState, regionId, regionName, resourceType, parent)
    }
  }

  componentWillUnmount(){
    window.removeEventListener('beforeunload', this.reLoadPage)
  }

  setData(avg, rank){
    this.setState({
      average: avg,
      rank: rank,
    })
  }

  render(){
    let region = capitalize(this.props.data.region_type)
    let score = localStorage.getItem("avg_monthly_consumption")
    if(region === "Regions"){
      region = "States"
    }
    let color = localStorage.getItem("accent_color");
    return(
      <div className="region-list-page">
        <div>
          <h1 className='ranked-title' style={{borderColor: color}}>{region}:</h1>
          <img
            src={require(`${resourceUrl(this.state.type)}`)}
            className="resource-logo"
            alt="carbon collective logo"
            style={resourceStyler(this.state.type)}
            />
        </div>
        <RegionList region={this.state} regionName={this.props.data.region_name} score={score}/>
      </div>
    )
  }
}

function resourceUrl(type){
  if(type==="carbon"){
    return "./img/Leaf final_fill.png"
  }else if(type==="electricity"){
    return "./img/ELEC_fill_2.png"
  }else if(type==="water"){
    return "./img/AQUA_fill_2.png"
  }else if(type==="gas"){
    return "./img/FLAME_fill_2.png"
  }else{
    return ""
  }
}
function resourceStyler(type){
  if(type==="carbon"){
    return {width: '32px', height: '32px'}
  }else if(type==="electricity"){
    return {width: '10px', height: '42px'}
  }else if(type==="water"){
    return {width: '20px', height: '36px'}
  }else if(type==="gas"){
    return {width: '28px', height: '36px'}
  }else{
    return ""
  }
}

export default RegionPage;
