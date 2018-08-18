import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {put, post} from '../../api_client';
import 'font-awesome/css/font-awesome.min.css';

const HighlightedRegion = function(props){
    return(
        <li className="highlighted-region-row" key={props.region.id} style={{borderColor: localStorage.getItem("accent_color")}}>
          <ul key={props.region.name + props.region.id} className='region-row-list'>
            <li key={props.region.name + '4'} className="region-arrow">{props.arrow}</li>
              <li key={props.region.name + '1'} className="region-row-rank">#{props.i + 1}</li>
              <li key={props.region.name + '2'} id={props.region.id} className="region-row-name highlighted">{props.region.name}</li>
            <li key={props.region.name + '3'} className="region-row-score highlighted">{props.region.avg_monthly_consumed_per_user}</li>
          </ul>
        </li>
    )
}

const UnhighlightedRegion = function(props){
    return(
        <li id={props.region.id} className="ranked-region-row" key={props.region.id}>
            <ul key={props.region.name + props.region.id} className='region-row-list'>
            <li key={props.region.name + '4'} className="region-arrow">{props.arrow}</li>
              <li key={props.region.name + '1'} className="region-row-rank">{props.i + 1})</li>
              <li key={props.region.name + '2'} id={props.region.id} className="region-row-name">{props.region.name}</li>
              <li key={props.region.name + '3'} className="region-row-score">{props.region.avg_monthly_consumed_per_user}</li>
            </ul>
         </li>
    )
}

class RankedRegion extends Component{
  constructor(props){
    super();
    this.state = {
      regionData: props.regions,
      user_region: props.highlight,
      loading: true
    }
    this.goToPage = this.goToPage.bind(this);
    this.regionList = this.regionList.bind(this);
    this.calculateRankNumber = this.calculateRankNumber.bind(this);
    this.arrowDirection = this.arrowDirection.bind(this);
    this.setRegionData = this.setRegionData.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  componentDidMount(){
    if(this.props.name !== 'countries'){
      this.setState({
        parentRegion: true
      })
    }
    let regionData = this.state.regionData.map((region, n) => {
      region = this.calculateRankNumber(region, n)
      return region
    })
    this.setState({
      regionData,
      loading: false
    })
    this.logLanding()
    this.logPageMount()
  }

  logLanding(){
    let id = this.props.user_id
    let page = this.props.history.location.pathname
    let path = `${id}/page-land`
    let datum = {user_behavior: {
      pageName: page,
        }
      }
    post(path, datum)
     .then(data => console.log())
     .catch(error => console.log(error))
  }

  logPageMount(){
    let id = this.props.user_id
    let page = this.props.history.location.pathname + this.props.name
    let url = `${id}/page-mounted`
    let datum = { pageName: page }
    post(url, datum)
     .then(data => console.log())
     .catch(error => console.log(error))
  }

  setRegionData(region){
    if(region.id === Number(this.state.user_region)){
      let avg = region.avg_monthly_consumed_per_user
      let rank = region.rank
      this.updateData(avg, rank)
    }
  }

  updateData(avg, rank){
    this.setState({
      average: avg,
      rank: rank,
    })
  }

  calculateRankNumber(region, n){
    n += 1;
    const path = 'api/v1/areas/' + this.props.name + '/' + region.id + '/' + this.props.type
    const area = this.props.name
    if(region.rank === null){
      region.rank = n;
      let regionData = {
        [area]: region
      }
      put(path, undefined, regionData)
        .then(data => data)
        .catch(error => console.log(error))
    }else if(region.rank > n){
      region.rank = n;
      region.arrow = true;
      let regionData = {
        [area]: region,
      }
      put(path, undefined, regionData)
        .then(data => data)
        .catch(error => console.log(error))
    }else if(region.rank < n){
      region.rank = n;
      region.arrow = false
      let regionData = {
        [area]: region,
      }
      put(path, undefined, regionData)
        .then(data => data)
        .catch(error => console.log(error))
    }
    this.setRegionData(region)
    return region
  }

  goToPage(event){
    let id = event.target.id
    let region = this.props.name
    let name = event.target.innerHTML
    localStorage.setItem('region_type-users', region)
    localStorage.setItem('region_id-users', id)
    localStorage.setItem('region_name-users', name)
    this.props.history.push('/userboards')
  }

  regionList(){
    const regionData = this.state.regionData;
    const user_region = this.state.user_region;
    const regionList = regionData.map((region, n) => {
      const arrow = this.arrowDirection(region, n)
      if(region.id === Number(user_region)){
        return  <HighlightedRegion region={region} i={n} goToPage={this.goToPage} key={region.id} arrow={arrow}/>
      }
      return  <UnhighlightedRegion region={region} i={n} goToPage={this.goToPage} key={region.id} arrow={arrow}/>

    })
    return regionList
  };

  arrowDirection(r, n){
    if(r.arrow === null){
      return(
        <p style={{color: 'black'}}>--</p>
      )
    }else if(r.arrow === true){
      return(
        <i className="fa fa-angle-up"></i>
      )
    }else{
      return(
        <i className="fa fa-angle-down"></i>
      )
    }
  }

  render(){
    let color = localStorage.getItem('"accent_color"');
    let rank = this.state.rank;
    let avg = this.state.average;
    let score = this.props.score;
    return(
      <div className="narwall">
        <div className="score-rank first">
          <p className="title-ranked-consumption">{this.props.regionName}:</p>
          <p className="title-ranked-rank">Regional Rank:</p>
          <p className="mytitle-p">Personal Average:</p>
        </div>
        <div className="score-rank second-line">
          <p className="data-p first">{avg}</p>
          <p className="data-p second">{rank}</p>
          <p className="data-p last">{score}</p>
        </div>
        <div className="ranktag"><p className="ranktag">in: <i>{this.state.regionData[0].metric_name}</i></p></div>
        <div className="rankMetricTag"><p className="rankMetric">({this.state.regionData[0].metric_sym})</p></div>
        <div className='rankings-table-div'>
        <table className="region-list-headers">
          <thead>
          <tr className="region-list-header-row">
            <th className="header-rank">Rank</th><th className="header-region"></th><th className='header-score'>Average Monthly Consumption</th>
          </tr>
          </thead>
        </table>
        <ul className='region-list' style={{borderColor: color}}>
          {!this.state.loading ? this.regionList() : null}
        </ul>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return({
    user_id: state.userInfo.user_id
  })
}

export default withRouter(connect(mapStateToProps, null)(RankedRegion));
