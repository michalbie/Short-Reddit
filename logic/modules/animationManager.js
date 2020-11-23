var loadingAnimation

const playLoadingAnimation = () => {
    let infoLabels = document.querySelectorAll(".info-label")
    removeAllInfo(infoLabels)

    let info = createInfo("Loading")
    let dots = ""

    const animate = () => {
        info.innerHTML = "Loading" + dots
        if(dots.length == 3) dots = ""
        dots += "."
    }

    loadingAnimation = setInterval(animate, 300)
}

const clearLoadingAnimation = () => {
    clearInterval(loadingAnimation)
    let infoLabels = document.querySelectorAll(".info-label")
    removeAllInfo(infoLabels)
}

const showLoadingError = () => {
    createInfo("Something went wrong!")
}

const updateInfoPosition = (info) => {
    info.style.top = (window.innerHeight/2) - (info.clientHeight/2) + "px"
    info.style.left = (window.innerWidth/2) - (info.clientWidth/2) + "px"
}

const createInfo = (infoText) => {
    let info = document.createElement(`h2`)
    info.setAttribute("class", "info-label")
    info.style.color = "#8A8A8A"
    info.innerHTML = infoText
    document.getElementById("grid-container").appendChild(info)
    updateInfoPosition(info);

    window.addEventListener("resize", () => {
        updateInfoPosition(info);
    })

    return info;
}

const removeAllInfo = (info) => {
    let infoArray = info
    infoArray.forEach(element => {
        element.remove()
    });
}

export {clearLoadingAnimation, playLoadingAnimation, showLoadingError};

