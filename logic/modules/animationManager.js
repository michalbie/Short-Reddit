var loadingAnimation

const playLoadingAnimation = () => {
    let text = document.createElement(`h2`)
    text.setAttribute("id", "loading-label")
    text.style.color = "#8A8A8A"
    text.innerHTML = "Loading"
    let dots = ""
    document.getElementById("grid-container").appendChild(text)

    const updateLoadingPosition = () => {
        text.style.top = (window.innerHeight/2) - (text.clientHeight/2) + "px"
        text.style.left = (window.innerWidth/2) - (text.clientWidth/2) + "px"
    }

    const animate = () => {
        text.innerHTML = "Loading" + dots
        if(dots.length == 3) dots = ""
        dots += "."
    }

    updateLoadingPosition()
    loadingAnimation = setInterval(animate, 300)

    window.addEventListener("resize", () => {
        updateLoadingPosition()
    })
}

const clearLoadingAnimation = () => {
    clearInterval(loadingAnimation)
    let loadingLabel = document.getElementById("loading-label")
    loadingLabel.remove()
}


export {clearLoadingAnimation, playLoadingAnimation};

