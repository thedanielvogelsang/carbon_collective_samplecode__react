export const checkImageHeight = () => {
  // console.log('trying')
    var rootHeight = document.getElementById('root').offsetHeight
    var image = document.getElementById('app-background-image')
    image.style.height = rootHeight + "px"
}

export const scrollTop = function(){
  return document.body.scrollTop = document.documentElement.scrollTop = 0;
}
