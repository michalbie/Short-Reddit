
const observerOptions = {
    threshold: 0.001,
    rootMargin: "1800px 0px 1800px 0px"
}

const mediaObserver = new IntersectionObserver((entries, mediaObserver) => {
    entries.forEach(entry => {
        if(!entry.isIntersecting){
            unloadMedia(entry.target)
        }
        else{
            loadMedia(entry.target)
        }
    })
}, observerOptions)

const loadMedia = media => {
    media.src = media.getAttribute("media-src")
    media.onload = function() {
        if (this.height != 0) media.height = this.height
    }
}

const unloadMedia = media => {
    media.src = ""
}


const createImage = (postContainer, postData) => {
    const image = document.createElement("img")
    image.setAttribute("media-src", postData.url_overridden_by_dest)
    mediaObserver.observe(image)
    postContainer.appendChild(image)
}

const createVideo = (postContainer, postData, postMediaContainer) => {

    const video = document.createElement("video")
    const audio = document.createElement("audio")

    const playVideoSynchronously = (e) => {
        if(e.type  == "canplay"){
            console.log("CAN BE PLAUED")
            video.addEventListener("play", (ev) => {
                ev.preventDefault()
                if(video.readyState == 4){
                    video.play()
                    audio.currentTime = video.currentTime
                    audio.play()
                }
            })
        } else if(e.type  == "pause"){
            audio.pause()
        }
    }

    const configureVideo = () => {
        video.controls = "true"

        video.addEventListener("canplay", playVideoSynchronously)
        video.addEventListener("pause", playVideoSynchronously)
        video.addEventListener("waiting", () => audio.pause())
        video.addEventListener("playing", () => audio.play())
        video.addEventListener("seeking", () => {
            audio.pause()
            audio.currentTime = video.currentTime
        })
        video.setAttribute("media-src", postMediaContainer.fallback_url)
        mediaObserver.observe(video)
    }

    const configureAudio = () => {
        let urlCut = postMediaContainer.fallback_url.split("DASH_")[0]
        let audioUrl = `${urlCut}DASH_audio.mp4?source=fallback`
        audio.setAttribute("media-src", audioUrl)
        
        const audioSource = document.createElement("source")
        audioSource.src = audioUrl
        audioSource.type = "audio/mp4"
        audio.appendChild(audioSource)
    }
    
    configureVideo()
    configureAudio()
    
    postContainer.appendChild(video)
}


const createIFrame = (postContainer, postData, postMediaContainer, embedded) => {
    const iframe = document.createElement("iframe")
    //iframe.src = postMediaContainer.html.split("src=\"")[1].split("\"")[0]
    iframe.allowFullscreen = true
    if(embedded == true){
        let link = postMediaContainer.html.split("src=\"")[1].split("\"")[0]
        iframe.setAttribute("media-src", link)
    } else {
        iframe.setAttribute("media-src", postMediaContainer)
        console.log("url is " + postMediaContainer)
    }
    mediaObserver.observe(iframe)

    postContainer.appendChild(iframe)
}

const createGifv = (postContainer, postData, postMediaContainer) => {
    const video = document.createElement("video")
    video.controls = "true"
    let toMp4 = postMediaContainer.replace(".gifv", ".mp4")
    video.setAttribute("media-src", toMp4)
    mediaObserver.observe(video)

    postContainer.appendChild(video)
}