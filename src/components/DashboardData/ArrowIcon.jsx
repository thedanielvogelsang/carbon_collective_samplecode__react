import React from 'react';
import arrowUp from '../../../public/deacon-imgs/rank_up_ii.svg'
import arrowDown from '../../../public/deacon-imgs/rank_down_ii.svg'

const ArrowIcon = (props) => {
  let className = sortClassName(true)
  let arr;
  props.arrow ? arr = arrowUp : arr = arrowDown
  props.rank === 1 ? arr = arrowUp : console.log()
  return(
      <div className="arrow-holder-div">
        <span></span>
        <h1 className="rank">{props.rank}</h1>
        <img src={arr} alt="arrow icon" className={className}/>
        <h1 className="outof">of <span> {props.outOf}</span></h1>
      </div>
  )
}

function sortClassName(prop){
  return prop ? "arrow-icon up" : "arrow-icon down"
}

export default ArrowIcon;
