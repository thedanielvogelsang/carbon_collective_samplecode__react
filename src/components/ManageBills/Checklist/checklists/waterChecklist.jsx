import React, {Component} from 'react';
import {questions} from '../questions/water_questions.js';
import ChecklistQuestion from './ChecklistQuestion.jsx';
import ChecklistToggle from './toggles/ChecklistToggle';
import {get, put} from '../../../../api_client.js';

class WaterChecklist extends Component{
  constructor(props){
    super(props);
    this.state = {
      house_id: props.house,
      user_id: props.user,
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
    this.closeReview = this.closeReview.bind(this);
    this.updateDisplay = this.updateDisplay.bind(this);
  }

  componentDidMount(){
    const path = `api/v1/users/${this.state.user_id}/houses/${this.state.house_id}/questions?resource=water`
    get(path)
      .then(data => this.syncState(data))
      .catch(error => console.log(error))
  }

  componentDidUpdate(){
    // console.log(this.state)
  }

  syncState(data){
    let percent;
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
    data.completion_percentage === null ? percent = 0 : percent = data.completion_percentage;
    this.setState({
      quest1: no_nulls[0],
      quest2: no_nulls[1],
      quest3: no_nulls[2],
      quest4: no_nulls[3],
      quest5: no_nulls[4],
      percent: percent,
      completed: data.completed,
      loading: false,
    }, this.updateDisplay(data.completion_percentage, !data.completed))
  }

  updateDisplay(perc, compl){
    this.props.updateState('percentage', perc)
    this.props.updateState('display', compl)
      if(compl){
        this.props.updateState('checklistDisplay', 'flex')
      }
  }

  updateChecklist(quest, ans){
    let uId = this.state.user_id
    let hId = this.state.house_id
    const path = `api/v1/users/${uId}/houses/${hId}/questions?resource=water`
    const data = {question: quest, answer: ans}
    put(path, undefined, data)
      .then(data => this.updateAll(data, quest, ans))
      .catch(error => console.log(error))
  }
  closeReview(e){
    e.preventDefault();
    this.props.updateState('review', false)
  }

  updateAll(data, quest, ans){
    console.log(quest, ans)
    this.setState({[quest]: ans, completed: data.completed}, this.props.updateState('percentage', data.completion_percentage))
  }

  render(){
    let loading = this.state.loading;
    let review = this.props.review;
    console.log(this.state.quest5)

    if(!loading && !review){
      return(
        <div className="checklist-dropdown">
            {!this.state.quest1 ?
              <ChecklistToggle q='quest1' question={questions.quest1.question} updateChecklist={this.updateChecklist} cName='checklist-form'/>
              : <ChecklistToggle q='quest1' question={questions.quest1.question} updateChecklist={this.updateChecklist} cName='checklist-form disappear'/> }
            {!this.state.quest2 ?
              <ChecklistQuestion q='quest2' question={questions.quest2.question} answers={questions.quest2.answers} updateChecklist={this.updateChecklist} cName='checklist-form'/>
              : <ChecklistQuestion q='quest2' question={questions.quest2.question} answers={questions.quest2.answers} updateChecklist={this.updateChecklist} cName='checklist-form disappear'/> }
            {!this.state.quest3 ?
                <ChecklistToggle q='quest3' question={questions.quest3.question} updateChecklist={this.updateChecklist} cName='checklist-form'/>
              : <ChecklistToggle q='quest3' question={questions.quest3.question} updateChecklist={this.updateChecklist} cName='checklist-form disappear'/> }
            {this.state.quest3 === 'Yes' && !this.state.quest4 ?
              <ChecklistQuestion q='quest4' question={questions.quest4.question} answers={questions.quest4.answers} updateChecklist={this.updateChecklist} cName='checklist-form' />
              : <ChecklistQuestion q='quest4' question={questions.quest4.question} answers={questions.quest4.answers} updateChecklist={this.updateChecklist} cName='checklist-form disappear' /> }
            {!this.state.quest5 ?
              <ChecklistQuestion q='quest5' question={questions.quest5.question} answers={questions.quest5.answers}updateChecklist={this.updateChecklist} cName='checklist-form'/>
              : <ChecklistQuestion q='quest5' question={questions.quest5.question} answers={questions.quest5.answers}updateChecklist={this.updateChecklist} cName='checklist-form disappear'/> }
        </div>
      )
    }else if(!loading && review){
      return(
        <div className="checklist-dropdown review">
          <ChecklistToggle q='quest1' a={this.state.quest1} question={questions.quest1.question} updateChecklist={this.updateChecklist} cName='checklist-form' />
          <ChecklistQuestion q='quest2' a={this.state.quest2} r={true} question={questions.quest2.question} answers={questions.quest2.answers} updateChecklist={this.updateChecklist} cName='checklist-form'/>
          <ChecklistToggle q='quest3' a={this.state.quest3} question={questions.quest3.question} updateChecklist={this.updateChecklist} cName='checklist-form'/>
          <ChecklistQuestion q='quest4' a={this.state.quest4} r={true} question={questions.quest4.question} answers={questions.quest4.answers} updateChecklist={this.updateChecklist} cName='checklist-form'/>
          <ChecklistQuestion q='quest5' a={this.state.quest5} r={true} question={questions.quest5.question} answers={questions.quest5.answers} updateChecklist={this.updateChecklist} cName='checklist-form'/>
          <button
          className="close-review"
          onClick={this.closeReview}
          >Close</button>
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
