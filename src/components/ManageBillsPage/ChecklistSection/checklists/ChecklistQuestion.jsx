import React, {Component} from 'react';
import '../styles/Checklist-styles.css'

class ChecklistQuestion extends Component{
  constructor(props){
    super(props);
    this.state = {
      question: props.question,
      answers: props.answers,
    }
    this.selections = this.selections.bind(this);
    this.mapOptions = this.mapOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.applyClass = this.applyClass.bind(this);
  }

  componentDidMount(){
  }

  handleChange(e){
    e.preventDefault();
    let value = e.target.value
    this.props.updateChecklist(this.props.q, value)
  }

  applyClass(){
    let true_ = this.props.r
    if(this.state.question.search("What metric do") >= 0 && !true_){
      return "highlighted"
    }else{
      return ""
    }
  }

  selections(){
    return(
      <select
        className="checklist-select-dropdown"
        onChange={this.handleChange}
        required
        >
        {this.props.r ? null :
        <option value="">Select:</option>}
        {this.mapOptions()}
      </select>
    )
  }

  mapOptions(){
    let options = this.state.answers.map((ans, n) => {
        return(
        <option key={n} value={ans}>{ans}</option>
        )
    })
    return options
  }


  render(){
    return(
      <form className={this.props.cName}>
        <div className="checklist-question-div">
            <h3 id={this.applyClass()}>{this.state.question}</h3>
            {this.selections()}
        </div>
      </form>
    )
  }
}

export default ChecklistQuestion;
