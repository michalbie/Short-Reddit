
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
    allPosts.forEach(({data: {title, permalink, url, url_overridden_by_dest = null, is_video, media, crosspost_parent_list}}) => {
        allPostsData[i] = {title, url_overridden_by_dest, permalink, is_video, media, crosspost_parent_list}
        i++
    })

    console.log(allPosts)
    console.log(allPostsData)
    generatePosts(allPostsData, postsLimit)
}


const generatePosts = (allPosts, postsLimit) => {

    let template = document.querySelector('#post')
    let limit = postsLimit < Object.keys(allPosts).length ? postsLimit : Object.keys(allPosts).length

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

        identifyPostContent(post_containers[i], currentPost)
    }
}

const subredditSelectForm = document.getElementById("subreddit-select-form")
subredditSelectForm.addEventListener("submit", handleSubmit)

//TODO
//play video in viewport(muted) (use second observer maybe)