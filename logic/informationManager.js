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

const prepareSidebar = () => {
    updateSidebarTop()
    document.getElementById("button-wrapper").addEventListener("mousedown", () => {
        if(document.getElementById("sidebar").style.right != ("0px")){
            showSidebar()
            document.getElementById("sidebar").getAttribute("hide") = "false"

        } else{
            hideSidebar()
            document.getElementById("sidebar").getAttribute("hide") = "true"
        }
    })

    window.addEventListener("resize", () => {
        updateSidebarTop()
        updateSidebarRight()
    })
}

const hideSidebar = () => {
    document.getElementById("sidebar").style.right = -(document.getElementById("sidebar").offsetWidth) + "px"
}

const showSidebar = () => {
    document.getElementById("sidebar").style.right = 0
}

const updateSidebarTop = () => {
    document.getElementById("sidebar").style.top = document.getElementById("header").offsetHeight + "px"
}

const updateSidebarRight = () => {
    if(document.getElementById("sidebar").getAttribute("hide") == "true"){
        document.getElementById("sidebar").style.right = -(document.getElementById("sidebar").offsetWidth) + "px"
    }   
}

