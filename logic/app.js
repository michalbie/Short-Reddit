import * as postCreator from "./modules/postCreator.js";
import * as mediaManager from "./modules/mediaManager.js";
import * as animationManager from "./modules/animationManager.js";
import * as sidebarManager from "./modules/sidebarManager.js";

const postsPerRequest = 100;

var responses = [];
var displayExternalSource = false;

function prepareApp() {
	sidebarManager.prepareSidebar();
	document.getElementById("submit-btn").click();
}

const handleSubmit = (e) => {
	const resetPage = () => {
		responses = [];
		let grid = document.getElementById("grid-container");
		let columns = grid.querySelectorAll(".column-container");
		columns.forEach((column) => (column.innerHTML = ""));
		sidebarManager.hideSidebar();
	};

	resetPage();
	e.preventDefault();
	const subreddit = document.getElementById("subreddit").value;
	const postsType = document.getElementById("select-posts-types").value;
	const postsLimit = document.getElementById("posts-limit").value;
	displayExternalSource = document.getElementById("external-source").checked;
	animationManager.playLoadingAnimation();
	fetchPosts(subreddit, postsType, postsLimit);
};

const fetchPosts = async (subreddit, postsType, postsLimit, after) => {
	try{
		const response = await fetch(`https://www.reddit.com/r/${subreddit}/${postsType.toLowerCase()}.json?limit=100${after ? "&after=" + after : ""}`);
		const responseJSON = await response.json();
		responses.push(responseJSON);

		if (responseJSON.data.after && responses.length < Math.ceil(postsLimit / postsPerRequest)) {
			fetchPosts(subreddit, postsType, postsLimit, responseJSON.data.after);
			return;
		}

		animationManager.clearLoadingAnimation();
		loadData(responses, postsLimit);
	} catch (error) {
		animationManager.clearLoadingAnimation();
		animationManager.showLoadingError();
	}
	
};

const loadData = (responses, postsLimit) => {
	const allPosts = [];
	let allPostsData = {};

	responses.forEach((response) => {
		allPosts.push(...response.data.children);
	});

	let i = 0;
	allPosts.forEach(({ data: { title, permalink, url_overridden_by_dest = null, is_video, media, crosspost_parent_list } }) => {
		allPostsData[i] = { title, url_overridden_by_dest, permalink, is_video, media, crosspost_parent_list };
		i++;
	});

	generatePosts(allPostsData, postsLimit);
};

const generatePosts = (allPosts, postsLimit) => {
	let template = document.querySelector("#post");
	let limit = postsLimit < Object.keys(allPosts).length ? postsLimit : Object.keys(allPosts).length;
	let columnsContainers = document.getElementById("grid-container").querySelectorAll(".column-container");
	const postsPerColumn = limit / columnsContainers.length;

	postCreator.createContainers(template, limit, columnsContainers, postsPerColumn, allPosts);

	const post_containers = document.getElementById("grid-container").querySelectorAll(".post-container");

	for (let i = 0; i < limit; i++) {
		const currentPost = allPosts[Object.keys(allPosts)[i]];

		postCreator.addLink(currentPost, post_containers[i], i);
		postCreator.initAnswersSection(currentPost, post_containers[i]);
		mediaManager.identifyPostContent(post_containers[i], currentPost, displayExternalSource);
	}
};

const subredditSelectForm = document.getElementById("subreddit-select-form");
subredditSelectForm.addEventListener("submit", handleSubmit);
prepareApp();

//TODO
//play video in viewport(muted) (use second observer maybe)
//add possibility for multiple subreddits
