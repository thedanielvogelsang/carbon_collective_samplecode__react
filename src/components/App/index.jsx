import React, { Component } from 'react';
import './App-styles.css';
import { Route, Switch } from 'react-router-dom';
import AuthenticatedRoute from '../AuthenticatedRoute'
import UnauthenticatedRoute from '../UnauthenticatedRoute';
import HouselessRoute from '../HouselessRoute';
import Header from '../Header'
import Landing from '../Landing'
import AddAddress from '../AddAddress'
import AddHousehold from '../AddHousehold'
import HouseExists from '../HouseExists'
import Dashboard from '../Dashboard'
import ManageBills from '../ManageBills'
import Settings from '../Settings'
import Login from '../Login'
import FirstLogin from '../FirstLogin'
import NewUserSignup from '../NewUser'
import Navbar from '../Navbar'
import WaitConfirm from '../WaitConfirm'
import RegionPage from '../RegionPage'
import HouseholdPage from '../HouseholdPage'
import UserboardPage from '../UserboardPage'
import UserSettings from '../UserSettings'
import HouseSettings from '../HouseSettings'
import SearchAddress from '../SearchAddress'
import NeighborhoodInput from '../SearchAddress/neighborhood'
// import CountyInput from '../SearchAddress/county'
import InviteSomeonePage from '../InviteSomeonePage'
import ExpandForm from '../ExpandForm'
import PrivacyPage from '../PrivacyPage'
import SuggestionEmailPage from '../SuggestionEmailPage'
import FixBugPage from '../FixBugPage'
import FixBugLink from '../FixBugLink'
import CarbonCalc from '../CarbonCalculationsPage'
import Page404 from '../Page404'
import {get} from '../../api_client'

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}


const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

const renderUnauthenticatedMergedProps = (component, loaded, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    <UnauthenticatedRoute component={component} loaded={loaded} {...finalProps} />

  );
}

const UnauthenticatedRouteProps = ({ component, loaded, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderUnauthenticatedMergedProps(component, loaded, routeProps, rest);
    }}/>
  );
}

const renderAuthenticatedMergedProps = (component, loaded, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    <AuthenticatedRoute component={component} loaded={loaded} {...finalProps} />
  );
}

const AuthenticatedRouteProps = ({ component, loaded, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderAuthenticatedMergedProps(component, loaded, routeProps, rest);
    }}/>
  );
}

const renderHouselessMergedProps = (component, loaded, house, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    <HouselessRoute component={component} loaded={loaded} house={house} {...finalProps} />
  );
}


const NoHouseRoute = ({ component, loaded, house, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderHouselessMergedProps(component, loaded, house, routeProps, rest);
    }}/>
  );
}

const getResourceType = function(){
  let resource = localStorage.getItem("resource_type")
  if(resource !== 'undefined' && resource !== 'null'){
    return resource
  }else{
    return resource = false
  }
}

class App extends Component {
  constructor() {
    let resourceType = getResourceType();
    resourceType = resourceType || 'carbon'
    super();
    this.state = {
      user_id: sessionStorage.getItem('user_id'),
      house_id: sessionStorage.getItem('house_id'),
      userData: null,
      loaded: false,
      resource_type: resourceType,
      region_type: localStorage.getItem('region_type'),
      region_id: localStorage.getItem('region_id'),
      region_name: localStorage.getItem('region_name'),
      region_parent: localStorage.getItem('region_parent'),
    };
    this.updateState = this.updateState.bind(this);
    this.addUserData = this.addUserData.bind(this);
  };

// adds userData, which is used on many pages, from api call
  componentDidMount(){
    this.addUserData()
  }

// updates state if sessionStorage.getItem('user_id') changes (login/logout fix)
  componentDidUpdate(prevProps, prevState){
    if(prevState.user_id !== sessionStorage.getItem('user_id')){
      this.setState({loaded: false, user_id: sessionStorage.getItem('user_id')}, this.addUserData)
    }
  }

// pulls non-resource-related user data from api
  addUserData(){
    if(this.state.user_id !== 'null'){
      const path = 'api/v1/users/' + this.state.user_id
      get(path)
        .then(data => this.handleData(data))
        .catch(error => console.log())
    }
  }

// handles user fetch return to set house
  handleData(data){
    if(data.household){
      sessionStorage.setItem("house_id", data.household.id)
      this.setState({userData: data, loaded: true, house_id: data.household.id})
    }else{
      this.setState({userData: data, loaded: true})
    }
  }
// method sent as props to child components for updating parent App state (this)
  updateState(name, value) {
    this.setState({
      [name]: value
    });
  };

  render() {
    let loaded = this.state.loaded;
    let house = sessionStorage.getItem("house_id");
    let id = sessionStorage.getItem("user_id");
    if(!loaded && !id){
      return(
        <div className="app-container">
          <Navbar loaded={loaded}/>
          <Header />
          <Switch>
            <PropsRoute exact path="/" component={ Landing } updateState={this.updateState} /> } />
            <PropsRoute path="/login" component={ Login } data={this.state} updateState={this.updateState} /> } />
            <UnauthenticatedRouteProps path="/signup/:id" loaded={loaded} component={ NewUserSignup } data={this.state} updateState={this.updateState}/> } />
            <UnauthenticatedRouteProps path="/login-first-time" loaded={loaded} component={ FirstLogin } data={this.state} updateState={this.updateState} /> } />
            <PropsRoute path="/settings" loaded={loaded} component={ Settings } data={this.state} updateState={this.updateState} /> } />
            <AuthenticatedRouteProps component={Page404} loaded={loaded}/>
          </Switch>
        </div>
      )
    }else if(loaded){
        return (
          <div className="app-container">
            <Navbar loaded={loaded}/>
            <Header />
            <FixBugLink/>
            <Switch>
              <PropsRoute exact path="/" component={ Landing } loaded={loaded} updateState={this.updateState} /> } />
              <PropsRoute path="/login" component={ Login } loaded={loaded} data={this.state} updateState={this.updateState} /> } />
              <UnauthenticatedRouteProps path="/login-first-time" loaded={loaded} component={ FirstLogin } data={this.state} updateState={this.updateState} /> } />
              <UnauthenticatedRouteProps path="/signup/:id" loaded={loaded} component={ NewUserSignup } data={this.state} updateState={this.updateState}/> } />
              <UnauthenticatedRouteProps path="/confirm-address" loaded={loaded} component={ WaitConfirm } /> } />
              <AuthenticatedRouteProps path="/privacy-policy" loaded={loaded} house={house} component={ PrivacyPage } data={this.state} updateState={this.updateState} /> } />
              <NoHouseRoute path="/search_address" loaded={loaded} house={house} component={ SearchAddress } data={this.state} /> } />
              <NoHouseRoute path="/add_neighborhood" loaded={loaded} house={house} component={ NeighborhoodInput }/> } />
              <NoHouseRoute path="/expand-request" loaded={loaded} house={house} component={ExpandForm} {...this.state} /> } />
              <NoHouseRoute path="/add_address" loaded={loaded} house={house} component={ AddAddress } addUserData={this.addUserData}/> } />
              <NoHouseRoute path="/add_household" loaded={loaded} house={house} component={ AddHousehold } addUserData={this.addUserData}/> } />
              <NoHouseRoute path="/house-exists" loaded={loaded} house={house} component={ HouseExists } addUserData={this.addUserData} data={this.state.userData}/> } />
              <AuthenticatedRouteProps path="/dashboard" loaded={loaded} component={ Dashboard } user_id={this.state.user_id} updateState={this.updateState} userData={this.state.userData} /> } />
              <AuthenticatedRouteProps path="/managebills" loaded={loaded}  component={ ManageBills } data={this.state} updateState={this.updateState} /> } />
              <AuthenticatedRouteProps path="/carbon-calculations" loaded={loaded} component={ CarbonCalc } /> } />
              <AuthenticatedRouteProps path="/regionPage" loaded={loaded}  component={ RegionPage} data={this.state} /> } />
              <PropsRoute path="/settings" loaded={loaded} component={ Settings } data={this.state} updateState={this.updateState} /> } />
              <AuthenticatedRouteProps path="/household" loaded={loaded}  component={ HouseholdPage } data={this.state} /> } />
              <AuthenticatedRouteProps path="/user_settings" loaded={loaded} component={ UserSettings } userData={this.state.userData}/> } />
              <AuthenticatedRouteProps path="/house_settings" loaded={loaded} component={ HouseSettings} userData={this.state.userData} /> } />
              <AuthenticatedRouteProps path="/bugs" loaded={loaded}  component={ FixBugPage } userData={this.state.userData}/> } />
              <AuthenticatedRouteProps path="/userboards" loaded={loaded}  component={ UserboardPage } /> } />
              <AuthenticatedRouteProps path="/suggestions" loaded={loaded} component={ SuggestionEmailPage } userData={this.state.userData} /> } />
              <AuthenticatedRouteProps path="/invites" loaded={loaded} component={InviteSomeonePage} />
              <PropsRoute component={Page404}/>
          </Switch>
          </div>
        );
    }else{
      return(
        <div>
          <Navbar />
          <Header />
          <FixBugLink/>
          <UnauthenticatedRouteProps component={Page404} loaded={loaded}/>
        </div>
      )
    }
  }
}

export default App;
