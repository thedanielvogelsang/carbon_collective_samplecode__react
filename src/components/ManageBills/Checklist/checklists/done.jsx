import React, {Component} from 'react';
import '../styles/Checklist-styles.css';

class ChecklistQuestionDone extends Component{
  constructor(props){
    super(props);
    this.state = {
    }
    this.reopenChecklist = this.reopenChecklist.bind(this);
  }

  reopenChecklist(e){
    e.preventDefault();
    this.props.updateState('review', true)
    this.props.updateState('checklistDisplay', 'flex')
    this.props.updateState('display', true)
  }

  render(){
    return(
      <div className="checklist-done-div">
        <h3>You've completed our questionnaire! If you'd like to go back and review click the button</h3>
        <button
          className="reset-form-btn"
          onClick={this.reopenChecklist}
          >Review</button>
      </div>
    )
  }
}

export default ChecklistQuestionDone;
