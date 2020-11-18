const playLoadingAnimation = () => {
    let text = document.createElement(`h2`)
    text.setAttribute("id", "loading-label")
    text.style.color = "#8A8A8A"
    text.innerHTML = "Loading"
    let dots = ""
    document.getElementById("grid-container").appendChild(text)

    const animate = () => {
        text.innerHTML = "Loading" + dots
        if(dots.length == 3) dots = ""
        dots += "."
    }

    loadingAnimation = setInterval(animate, 300)
}

const clearLoadingAnimation = () => {
    clearInterval(loadingAnimation)
    let loadingLabel = document.getElementById("loading-label")
    loadingLabel.remove()
}