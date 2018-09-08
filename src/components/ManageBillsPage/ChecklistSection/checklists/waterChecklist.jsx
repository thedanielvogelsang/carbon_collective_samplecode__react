import React, {Component} from 'react';
import {questions} from '../questions/water_questions.js';
import ChecklistQuestion from './ChecklistQuestion.jsx';
import ChecklistToggle from './toggles/ChecklistToggle';
import {get, put} from '../../../../api_client.js';

class WaterChecklist extends Component{
  constructor(props){
    super(props);
    this.state = {
      quest1: false,
      quest2: false,
      quest3: false,
      quest4: false,
      quest5: false,
      loading: true,
      completed: false,
      checklistDisplay: 'none',
    }
    this.updateChecklist = this.updateChecklist.bind(this);
    this.syncState = this.syncState.bind(this);
    this.updateAll = this.updateAll.bind(this);
  }

  componentDidMount(){
    const path = `api/v1/users/${this.props.user}/houses/${this.props.house}/questions?resource=water`
    get(path)
      .then(data => this.syncState(data))
      .catch(error => console.log(error))
  }

  componentDidUpdate(){
  }

  handleChecklist(){
    alert("Thank you. Your data has been saved")
    this.props.closeDiv('checklist')

  }

  syncState(data){
    let q1 = data.quest1
    let q2 = data.quest2
    let q3 = data.quest3
    let q4 = data.quest4
    let q5 = data.quest5
    let array = [q1, q2, q3, q4, q5];
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
      completed: data.completed,
      loading: false,
    })
  }

  updateChecklist(quest, ans){
    let uId = this.props.user
    let hId = this.props.house
    const path = `api/v1/users/${uId}/houses/${hId}/questions?resource=water`
    const data = {question: quest, answer: ans}
    put(path, undefined, data)
      .then(data => this.updateAll(data, quest, ans))
      .catch(error => console.log(error))
  }

  updateAll(data, quest, ans){
    console.log('data updated:', data)
    this.setState({[quest]: ans, completed: data.completed})
  }

  render(){
    let loading = this.state.loading;
    if(!loading){
      return(
        <div className="checklist-dropdown">
          <ChecklistToggle q='quest1' a={this.state.quest1} question={questions.quest1.question} updateChecklist={this.updateChecklist} cName='checklist-form'/>
          <ChecklistQuestion q='quest2' a={this.state.quest2} r={true} question={questions.quest2.question} answers={questions.quest2.answers} updateChecklist={this.updateChecklist} cName='checklist-form'/>
          <ChecklistToggle q='quest3' a={this.state.quest3} question={questions.quest3.question} updateChecklist={this.updateChecklist} cName='checklist-form'/>
          <ChecklistQuestion q='quest4' a={this.state.quest4} r={true} question={questions.quest4.question} answers={questions.quest4.answers} updateChecklist={this.updateChecklist} cName='checklist-form' />
          <ChecklistQuestion q='quest5' a={this.state.quest5} r={true} question={questions.quest5.question} answers={questions.quest5.answers}updateChecklist={this.updateChecklist} cName='checklist-form'/>
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

export default WaterChecklist;
