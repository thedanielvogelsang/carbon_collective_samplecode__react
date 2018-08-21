export const whichColor = (type) => {
  switch(type){
    case "carbon":
      return "rgb(121,194,120)"
    case "electricity":
      return "rgb(252,232,52)"
    case "water":
      return "rgb(70,138,199)"
    case "gas":
      return "rgb(239,98,93)"
    default:
      break;
  }
}
