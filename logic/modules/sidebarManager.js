const prepareSidebar = () => {
    const updateSidebarTop = () => {
        document.getElementById("sidebar").style.top = document.getElementById("header").offsetHeight + "px"
    }
    
    const updateSidebarRight = () => {
        if(document.getElementById("sidebar").getAttribute("hide") == "true"){
            document.getElementById("sidebar").style.right = -(document.getElementById("sidebar").offsetWidth) + "px"
        }   
    }

    updateSidebarTop()
    document.getElementById("button-wrapper").addEventListener("mousedown", () => {
        if(document.getElementById("sidebar").style.right != ("0px")){
            showSidebar()
            document.getElementById("sidebar").setAttribute("hide", "false")

        } else{
            hideSidebar()
            document.getElementById("sidebar").setAttribute("hide", "true")
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

export {prepareSidebar, hideSidebar, showSidebar}