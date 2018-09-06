import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class ArrowDiv extends Component{
  constructor(){
    super();
    this.state = {
      open: false,
      arrow: 'caret-right'
    };
    this.changeArrow = this.changeArrow.bind(this);
  }

  changeArrow(){
    let a;
    open = this.state.open
    open ? a = 'caret-down' : a = 'caret-right'
    this.setState({
      open: !open,
      arrow: a,
    })
  }

  render(){
    return(
      <div onClick={this.changeArrow}>
        <FontAwesomeIcon icon={this.state.arrow} size="lg"/>
      </div>
    )
  }
}
