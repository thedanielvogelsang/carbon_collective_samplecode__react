import React from 'react';
import {connect} from 'react-redux';
import {startTimer} from '../../actions/timerActions';
// Helper function that takes store state
// and returns the current elapsed time
String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10) / 1000; // don't forget the second param
    var days = Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num -(days * 86400)) / 3600);
    var minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
    var seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);
    seconds = Math.floor(seconds)
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return days+':'+hours+':'+minutes+':'+seconds;
}

function getElapsedTime(baseTime, stoppedAt = new Date().getTime()) {
    let endTime = new Date(baseTime).setDate(baseTime.getDate() + 10)
    // console.log(endTime, stoppedAt)
    return endTime - stoppedAt
}

class Timer extends React.Component {
  componentDidMount() {
    this.interval = setInterval(this.forceUpdate.bind(this), 1000);
    this.props.startTimer(this.props.seconds, this.props.id)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let { baseTime, startedAt } = this.props;
    baseTime = new Date(baseTime[this.props.id])
    let elapsed = getElapsedTime(baseTime);
    elapsed = elapsed.toString().toHHMMSS()
    return (
      <div>
        <div>Time left: {elapsed}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { baseTime, startedAt } = state.timer;
  return { baseTime, startedAt };
}

export default connect(mapStateToProps, { startTimer })(Timer);
