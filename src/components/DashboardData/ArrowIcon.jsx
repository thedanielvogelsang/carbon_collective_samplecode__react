import React from 'react';
import arrowUp from '../../../public/deacon-imgs/rank_up_ii.svg'
import arrowDown from '../../../public/deacon-imgs/rank_down_ii.svg'

const ArrowIcon = (props) => {
  let className = sortClassName(props.up)
  console.log(className)
  let arr, fixer;
  let rank = findOrdinal(props.rank)
  props.arrow ? arr = arrowUp : arr = arrowDown
  props.rank === 1 || props.rank === "?" ? arr = arrowUp : console.log();
  return(
      <div className="arrow-holder-div">
        {props.rank !== '?' ?
        <span className="arrow-tooltip"> * ranked {rank} out of {props.outOf} {props.areaType}</span> : <span className={"arrow-tooltip space-left"}>no rank to be displayed</span> }
        <img src={arr} alt="arrow icon" className={className}/>
        <h1 className="rank">{props.rank}</h1>
        {props.rank !== '?' ?
        <h1 className="outof">{props.rank} <span>/</span> {props.outOf}</h1> : <div></div> }
      </div>
  )
}

function findOrdinal(num){
  num = num.toString().split('').pop();
  switch(num){
    case "1":
      num = "1st"
      break
    case "2":
      num = "2nd"
      break
    case "3":
      num = "3rd"
      break
    default:
      num = num + 'th'
  }
  return num
}

function sortClassName(prop){
  return prop ? "arrow-icon up" : "arrow-icon down"
}

export default ArrowIcon;
