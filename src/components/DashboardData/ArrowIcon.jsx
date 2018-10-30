import React from 'react';
import arrowUp from '../../../public/deacon-imgs/rank_up_ii.svg'
import arrowDown from '../../../public/deacon-imgs/rank_down_ii.svg'
import exclamationMark from '../../../public/deacon-imgs/Exclamation_mark_2.svg'

const ArrowIcon = (props) => {
  let className = sortClassName(props.up)
  let arr, areaType;
  // let rank = findOrdinal(props.rank)
  props.arrow ? arr = arrowUp : arr = arrowDown
  props.rank === '?' ? arr = exclamationMark : console.log();
  props.outOf === 1 ? areaType = props.areaType.replace(/s$/, '') : areaType = props.areaType
  return(
      <div className="arrow-holder-div">
        {props.rank !== '?' ?
          <span className="arrow-tooltip"> * better than {props.outOf} other {areaType}</span> : <span className={"arrow-tooltip space-left"}>to get started enter a bill on the bills page!</span> }
        <img src={arr} alt="arrow icon" className={className}/>
        <h1 className="rank">{props.outOf}</h1>
        {props.rank === '???' ?
        <h1 className="outof">{props.rank} <span>/</span> {props.outOf}</h1> : <div></div> }
      </div>
  )
}
//
// function findOrdinal(num){
//   num = num.toString().split('');
//   num = num.length === 1 ? num = singleOrdinance(num.pop()) : num.length > 2 ? num = tripleOrdinance(num) : num = doubleOrdinance(num)
//   return num
// }

// function singleOrdinance(num){
//   switch(num){
//     case "1":
//       num = "1st"
//       break
//     case "2":
//       num = "2nd"
//       break
//     case "3":
//       num = "3rd"
//       break
//     default:
//       num += 'th'
//   }
//   return num
// }
//
// function doubleOrdinance(num){
//   if(num[0] === "1"){
//     let dig = num.pop()
//     switch(dig){
//         default:
//           dig += 'th'
//       }
//     num[1] = dig
//     return num
//   }else{
//     num[1] = singleOrdinance(num[1])
//     return num
//   }
//   return num.join('')
// }
//
// function tripleOrdinance(num){
//   return num.join('')
// }

function sortClassName(prop){
  return prop ? "arrow-icon up" : "arrow-icon down"
}
// original tooltip
// <span className="arrow-tooltip"> * ranked {rank} out of {props.outOf} {props.areaType}</span> : <span className={"arrow-tooltip space-left"}>no rank to be displayed</span> }

export default ArrowIcon;
