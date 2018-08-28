export const checkImageHeight = () => {
    var rootHeight = document.getElementById('root').offsetHeight
    var image = document.getElementById('app-background-image')
    image.style.height = rootHeight + "px"
    console.log(image.style.height, rootHeight)
}
