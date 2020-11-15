const postsPerRequest = 100

var responses = []

const handleSubmit = (e) => {
    responses = []
    e.preventDefault()
    const subreddit = document.getElementById("subreddit").value
    const postsType = document.getElementById("select-posts-types").value
    const postsLimit = document.getElementById("posts-limit").value
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

    loadData(responses, postsLimit)
}

const loadData = (responses, postsLimit) => {
    const allPosts = []
    allPostsData = {}

    responses.forEach(response => {
        allPosts.push(...response.data.children)
    });

    allPosts.forEach(({data: {title, url}}) => {
        allPostsData[url] = {title}
    })

    console.log(allPosts)
    console.log(allPostsData)
    generatePosts(allPostsData, postsLimit)
}



const generatePosts = (allPosts, postsLimit) => {
    document.getElementById("grid-container").innerHTML = ""

    let template = document.querySelector('#post');
    for(let i=0; i<postsLimit; i++){
        let clone = template.content.cloneNode(true);
        clone.querySelector("h2").innerHTML = allPosts[Object.keys(allPosts)[i]]["title"]
        document.getElementById("grid-container").appendChild(clone)
    }

    const gridElements = document.getElementById("grid-container").querySelectorAll(".post-container")
    for(let i=0; i<postsLimit; i++){
        gridElements[i].addEventListener("mousedown", () => {
            console.log(Object.keys(allPosts)[i])
            window.open(Object.keys(allPosts)[i],`mywindow${i}`)
        })
    }

    /*for(let i=0; i<postsLimit; i++){
        let template = document.querySelector('#post');
        let clone = template.content.cloneNode(true);
        clone.querySelector("h2").innerHTML = allPosts[Object.keys(allPosts)[i]]["title"]
        let answers = clone.querySelectorAll(".answer-container")
        for(let j=0; j<5; j++){
            answers[j].innerHTML = allPosts[Object.keys(allPosts)[i]]["answers"][j] + "<br><br>"
        }
        document.getElementById("grid-container").appendChild(clone)
    }*/
}

const fetchAnswers = async (allPosts, postsLimit) => {
    for(let j=0; j<postsLimit; j++){
        const key = Object.keys(allPosts)[j]
        const url = key.slice(0, -1)
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