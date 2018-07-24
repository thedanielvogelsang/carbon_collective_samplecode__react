
const clearAll = function(){
  document.getElementsByClassName('circle')[0].classList.remove('no-bills')
  document.getElementById('bills-arrow').classList.remove('no-bills')
  document.getElementsByClassName('arrow-holder')[0].classList.remove('animate')
  document.getElementById('start-here-div').classList.remove('animate')
  document.getElementById('start-here-div').classList.remove('animate-electricity')
  document.getElementById('line1').classList.remove('animate')
  document.getElementById('line2').classList.remove('animate')
  document.getElementById('bills-arrow').classList.remove('animate')
}

const noBills = function(){
    document.getElementsByClassName('circle')[0].classList.add('no-bills')
    document.getElementById('bills-arrow').classList.add('no-bills')
}

// const removeAnimations = function(){
//   document.getElementsByClassName('arrow-holder')[0].classList.remove('animate')
// }

// const blinkStartHere = function(){
//   document.getElementById('start-here-div').classList.add('blink')
//   setTimeout(removeAnimations, 300)
// }

const arrow = function(res){
  if(res === 'electricity'){
    document.getElementsByClassName('arrow-holder')[0].classList.add('animate')
    document.getElementById('start-here-div').classList.add('animate-electricity')
    document.getElementById('line1').classList.add('animate')
    document.getElementById('line2').classList.add('animate')
    document.getElementById('bills-arrow').classList.add('animate')
  }else if(res === 'gas'){
    document.getElementsByClassName('arrow-holder')[0].classList.add('animate')
    document.getElementById('start-here-div').classList.add('animate-gas')
    document.getElementById('line1').classList.add('animate')
    document.getElementById('line2').classList.add('animate')
    document.getElementById('bills-arrow').classList.add('animate')
  }else{
    document.getElementsByClassName('arrow-holder')[0].classList.add('animate')
    document.getElementById('start-here-div').classList.add('animate')
    document.getElementById('line1').classList.add('animate')
    document.getElementById('line2').classList.add('animate')
    document.getElementById('bills-arrow').classList.add('animate')
  }
}

const triggerAnimation = function(res){
  setTimeout(noBills, 200)
  setTimeout(arrow, 800, res)
  setTimeout(clearAll, 3000)
}


export {triggerAnimation};
