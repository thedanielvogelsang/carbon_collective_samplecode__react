import React, {Component} from 'react';
import RankedRegion from '../RankedRegion';
import {get} from '../../api_client'
import './RegionList-styles.css';


class RegionList extends Component{
  constructor(props){
    super(props)
    this.state = {
      region: this.props.region.region,
      id: this.props.region.id,
      name: this.props.region.name,
      type: this.props.region.type,
      loaded: false,
      data: null,
    }
    this.setLoad = this.setLoad.bind(this)
  }

  componentDidMount(){
    let region = this.state.region;
    let resource_type = this.state.type;
    let parent = this.props.region.parent;
    const path = `api/v1/areas/${region}/${resource_type}?parent=${parent}`
    get(path)
      .then(data => this.setLoad(data))
      .catch(error => console.log(error))
  }

  setLoad(data){
    this.setState({
      loaded: true,
      data: data
    })
  }

  componentDidUpdate(){
  }

  render(){
    let name = this.state.region;
    return(
      <div className="region-list-container">
        {this.state.loaded ? <RankedRegion regions={this.state.data} regionName={this.props.regionName}  score={this.props.score} name={name} type={this.state.type} highlight={this.state.id} /> : null }
      </div>
    )
  }
}

export default RegionList;
