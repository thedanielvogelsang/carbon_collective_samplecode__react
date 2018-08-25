export const checkImageHeight = () => {
    var root = document.getElementById('root')
    var image = document.getElementById('app-background-image')
    image.style.height = root.offsetHeight + "px"
    console.log(root.offsetHeight)
}
