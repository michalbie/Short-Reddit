
const postsPerRequest = 100

var responses = []
var loadingAnimation

const handleSubmit = (e) => {
    const resetPage = () => {
        responses = []     
        document.getElementById("grid-container").innerHTML = ""
    }

    resetPage()
    e.preventDefault()
    const subreddit = document.getElementById("subreddit").value
    const postsType = document.getElementById("select-posts-types").value
    const postsLimit = document.getElementById("posts-limit").value
    playLoadingAnimation()
    fetchPosts(subreddit, postsType, postsLimit)
}


const fetchPosts = async (subreddit, postsType, postsLimit, after) => {
    console.log(`https://www.reddit.com/r/${subreddit}/${postsType.toLowerCase()}.json?limit=100${
        after ? "&after=" + after : ""
    }`)
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/${postsType.toLowerCase()}.json?limit=100${
        after ? "&after=" + after : ""
    }`)

    const responseJSON = await response.json()
    responses.push(responseJSON)

    if(responseJSON.data.after && responses.length < Math.ceil(postsLimit/postsPerRequest)){
        fetchPosts(subreddit, postsType, postsLimit, responseJSON.data.after)
        return
    }

    clearLoadingAnimation()
    loadData(responses, postsLimit)
}


const loadData = (responses, postsLimit) => {
    const allPosts = []
    allPostsData = {}

    responses.forEach(response => {
        allPosts.push(...response.data.children)
    });

    let i=0
    allPosts.forEach(({data: {title, permalink, url, url_overridden_by_dest = null, is_video, media, crosspost_parent_list, preview}}) => {
        allPostsData[i] = {title, url_overridden_by_dest, permalink, is_video, media, crosspost_parent_list, preview}
        i++
    })

    console.log(allPosts)
    console.log(allPostsData)
    generatePosts(allPostsData, postsLimit)
}


const generatePosts = (allPosts, postsLimit) => {

    let template = document.querySelector('#post')
    let limit = postsLimit < Object.keys(allPosts).length ? postsLimit : Object.keys(allPosts).length
    console.log("limit: " + limit)

    for(let i=0; i < limit; i++){
        let clone = template.content.cloneNode(true);
        clone.querySelector("h2").innerHTML = allPosts[Object.keys(allPosts)[i]]["title"]
        document.getElementById("grid-container").appendChild(clone)
    }

    const post_containers = document.getElementById("grid-container").querySelectorAll(".post-container")

    for(let i=0; i < limit; i++){
        const currentPost = allPosts[Object.keys(allPosts)[i]]

        post_containers[i].addEventListener("mousedown", () => {
            window.open("https://reddit.com" + allPosts[Object.keys(allPosts)[i]]["permalink"],`mywindow${i}`)
        })

        if(currentPost.url_overridden_by_dest != null && currentPost.url_overridden_by_dest.match(/\.(jpeg|jpg|gif|png)$/) != null){
            createImage(post_containers[i], currentPost)
        } else if(currentPost.is_video == true){
            createVideo(post_containers[i], currentPost, currentPost.media)
        } else if(currentPost.crosspost_parent_list != null && currentPost.crosspost_parent_list[0].is_video == true){
            createVideo(post_containers[i], currentPost, currentPost.crosspost_parent_list[0].media)
        } else if(currentPost.preview.reddit_video_preview != null){
            createVideo(post_containers[i], currentPost, currentPost.preview.reddit_video_preview)
        }
    }
}

const fetchAnswers = async (allPosts, postsLimit) => { //not used actually
    for(let j=0; j<postsLimit; j++){
        const url = Object.keys(allPosts)[j].slice(0, -1)
        const response = await fetch(`${url}.json`)
        const responseJSON = await response.json()
        const answers = []

        for(let i=0; i<5; i++) answers.push(responseJSON[1].data.children[i].data.body)
        console.log(answers)
        allPosts[Object.keys(allPosts)[j]]["answers"] = answers
    }
}


const subredditSelectForm = document.getElementById("subreddit-select-form")
subredditSelectForm.addEventListener("submit", handleSubmit)

//TODO
//Load more... feature
//Load  images from posts that shares other posts
//Autoplay videos on viewport and pause these which are  not
//mute video