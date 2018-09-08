import React, {Component} from 'react';
import {questions} from '../questions/gas_questions.js';
import ChecklistQuestion from './ChecklistQuestion.jsx';
import ChecklistToggle from './toggles/ChecklistToggle';
import {get, put} from '../../../../api_client.js';

class GasChecklist extends Component{
  constructor(props){
    super(props);
    // console.log(props)
    this.state = {
      apartment: false,
      quest1: false,
      quest2: false,
      quest3: false,
      quest4: false,
      quest5: false,
      quest6: false,
      loading: true,
      completed: false,
    }
    this.updateChecklist = this.updateChecklist.bind(this);
    this.syncState = this.syncState.bind(this);
    this.updateAll = this.updateAll.bind(this);
  }

  componentDidMount(){
    const path = `api/v1/users/${this.props.user}/houses/${this.props.house}/questions?resource=gas`
    get(path)
      .then(data => this.syncState(data))
      .catch(error => console.log(error))
  }

  componentDidUpdate(prevProps, prevState){
    // console.log(prevState, this.state)
  }

  syncState(data){
    let q1 = data.quest1
    let q2 = data.quest2
    let q3 = data.quest3
    let q4 = data.quest4
    let q5 = data.quest5
    let q6 = data.quest6
    let array = [q1, q2, q3, q4, q5, q6];
    let no_nulls = array.map(function(q){
      if(q === null || q === 'null'){
        q = false
        return q
      }else{
        return q
      }
    })
    this.setState({
      quest1: no_nulls[0],
      quest2: no_nulls[1],
      quest3: no_nulls[2],
      quest4: no_nulls[3],
      quest5: no_nulls[4],
      quest6: no_nulls[5],
      completed: data.completed,
      loading: false,
    })
  }

  updateChecklist(quest, ans){
    let uId = this.props.user
    let hId = this.props.house
    const path = `api/v1/users/${uId}/houses/${hId}/questions?resource=gas`
    const data = {question: quest, answer: ans}
    put(path, undefined, data)
      .then(data => this.updateAll(data, quest, ans))
      .catch(error => console.log(error))
  }
  handleChecklist(){
    alert("Thank you. Your data has been saved")
    this.props.closeDiv('checklist')

  }

  updateAll(data, quest, ans){
    this.setState({[quest]: ans, completed: data.completed})
  }

  render(){
    let loading = this.state.loading;
    if(!loading){
      return(
        <div className="checklist-dropdown">
          <ChecklistQuestion q='quest1' a={this.state.quest1} r={true} question={questions.quest1.question} answers={questions.quest1.answers} updateChecklist={this.updateChecklist} cName="checklist-form"/>
          <ChecklistToggle q='quest2' question={questions.quest2.question} updateChecklist={this.updateChecklist} cName="checklist-form"/>
          <ChecklistQuestion q='quest3' a={this.state.quest3} r={true} question={questions.quest3.question} answers={questions.quest3.answers} updateChecklist={this.updateChecklist} cName="checklist-form"/>
          <ChecklistToggle q='quest4' question={questions.quest4.question} updateChecklist={this.updateChecklist} cName="checklist-form"/>
          <ChecklistQuestion q='quest5' a={this.state.quest5} r={true} question={questions.quest5.question} answers={questions.quest5.answers} updateChecklist={this.updateChecklist} cName="checklist-form"/>
          <ChecklistQuestion q='quest6' a={this.state.quest6} r={true} question={questions.quest6.question} answers={questions.quest6.answers} updateChecklist={this.updateChecklist} cName="checklist-form"/>
            <div className="checklist-button-div">
              <button
                className="checklist-button"
                onClick={(e) => this.handleChecklist(e)}
                type="submit"
                >Save Response</button>
            </div>
        </div>
      )
    }else{
      return(
        <div></div>
      )
    }
  }
}

export default GasChecklist;
