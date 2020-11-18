
const observerOptions = {
    threshold: 0.00001,
    rootMargin: "200px 0px 200px 0px"
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
    media.onload = function() {
        if (this.height != 0) media.height = this.height
        if (this.width != 0) media.width = this.width
        
        media.parentElement.style.height = media.parentElement.querySelector("h2").offsetHeight + this.height
    }
    media.src = media.getAttribute("media-src")
    
    if(media.src.match(/\.(gif)$/) != null){
        const observeSizeChange = setInterval(() => {
            if(media.src !=  media.getAttribute("media-src")){
                media.src = media.getAttribute("media-src")
            }
            console.log(media.height,  media.src, media.getAttribute("media-src"), media.parentElement)
            if (media.height > 0){
                media.height = media.height
                clearInterval(observeSizeChange)
            }
        }, 1000)
    }
}

const unloadMedia = media => {
    media.src = ""
}


const identifyPostContent = (post_container, currentPost) => {
    if(currentPost.url_overridden_by_dest != null && currentPost.url_overridden_by_dest.match(/\.(jpeg|jpg|gif|png)$/) != null){
        createImage(post_container, currentPost)
    } else if(currentPost.url_overridden_by_dest != null && currentPost.url_overridden_by_dest.match(/\.(gifv)$/) != null){
        createGifv(post_container, currentPost, currentPost.url_overridden_by_dest)
    }else if(currentPost.is_video == true){
        createVideo(post_container, currentPost, currentPost.media.reddit_video)
    } else if(currentPost.crosspost_parent_list != null && currentPost.crosspost_parent_list[0].is_video == true){
        createVideo(post_container, currentPost, currentPost.crosspost_parent_list[0].media.reddit_video)
    } else if(currentPost.media != null && currentPost.media.oembed != null){
        createIFrame(post_container, currentPost, currentPost.media.oembed, true)
    } else if(currentPost.url_overridden_by_dest != null){
        createIFrame(post_container, currentPost, currentPost.url_overridden_by_dest, false)
    }
}

const createImage = (postContainer, postData) => {
    const image = document.createElement("img")
    image.setAttribute("media-src", postData.url_overridden_by_dest)
    postContainer.appendChild(image)
    mediaObserver.observe(image)
}

const createVideo = (postContainer, postData, postMediaContainer) => {

    const video = document.createElement("video")
    const audio = document.createElement("audio")

    const playVideoSynchronously = (e) => {
        if(e.type  == "canplay"){
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
    mediaObserver.observe(video)
}


const createIFrame = (postContainer, postData, postMediaContainer, embedded) => {
    const iframe = document.createElement("iframe")
    iframe.allowFullscreen = true

    if(embedded == true){
        let link = postMediaContainer.html.split("src=\"")[1].split("\"")[0]
        iframe.setAttribute("media-src", link)
    } else {
        iframe.setAttribute("media-src", postMediaContainer)
    }
    postContainer.appendChild(iframe)
    mediaObserver.observe(iframe)
}

const createGifv = (postContainer, postData, postMediaContainer) => {
    const video = document.createElement("video")
    video.controls = "true"
    let toMp4 = postMediaContainer.replace(".gifv", ".mp4")
    video.setAttribute("media-src", toMp4)
    postContainer.appendChild(video)
    mediaObserver.observe(video)
}