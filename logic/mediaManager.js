
const createImage = (postContainer, postData) => {
    const image = document.createElement("img")
    image.src = postData.url_overridden_by_dest
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
        video.addEventListener("timeupdate", function (){ //TODELETE
            console.log("Ping ms: " + (video.currentTime - audio.currentTime))
        })
        video.addEventListener("waiting", () => audio.pause())
        video.addEventListener("playing", () => audio.play())
        video.addEventListener("seeking", () => {
            audio.pause()
            audio.currentTime = video.currentTime
        })

        const videoSource = document.createElement("source")
        videoSource.src = postMediaContainer.fallback_url
        videoSource.type = "video/mp4"
        video.appendChild(videoSource)
    }

    const configureAudio = () => {
        let urlCut = postMediaContainer.fallback_url.split("DASH_")[0]
        let audioUrl = `${urlCut}DASH_audio.mp4?source=fallback`
        
        const audioSource = document.createElement("source")
        audioSource.src = audioUrl
        audioSource.type = "audio/mp4"
        audio.appendChild(audioSource)
    }
    
    configureVideo()
    configureAudio()
    console.log(video)
    postContainer.appendChild(video)
}