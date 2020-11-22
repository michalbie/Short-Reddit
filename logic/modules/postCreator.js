const createContainers = (template, limit, columnsContainers, postsPerColumn, allPosts) => {
	let lastPostIndex = 0;

	for (let i = 0; i < columnsContainers.length; i++) {
		while (lastPostIndex < (i != columnsContainers.length - 1 ? postsPerColumn * (i + 1) : limit)) {
			let clone = template.content.cloneNode(true);
			clone.querySelector("h2").innerHTML = allPosts[Object.keys(allPosts)[lastPostIndex]]["title"];
			columnsContainers[i].appendChild(clone);
			lastPostIndex++;
		}
	}
};

const addLink = (currentPost, postContainer, index) => {
	postContainer.addEventListener("mousedown", () => {
		window.open("https://reddit.com" + currentPost["permalink"], `mywindow${index}`);
	});

	postContainer.querySelector(".answers-section").addEventListener("mousedown", (e) => {
		e.stopPropagation();
	});
};

const initAnswersSection = (currentPost, postContainer) => {
	const showAnswersButton = postContainer.querySelector(".toggle-answers-btn");
	let answerSectionDisplay = (postContainer.querySelector(".answers-section").style.display = "block");
	let loadingAnswers = false;

	showAnswersButton.addEventListener("mousedown", (e) => {
		e.stopPropagation();

		if (!postContainer.querySelector(".answer-wrapper") && loadingAnswers == false) {
			loadingAnswers = true;
			fetchAnswers(currentPost, postContainer);
		} else if (answerSectionDisplay == "block") {
			postContainer.querySelector(".answers-section").style.display = "none";
			answerSectionDisplay = "none";
		} else {
			postContainer.querySelector(".answers-section").style.display = "block";
			answerSectionDisplay = "block";
		}
	});
};

const fetchAnswers = async (currentPost, postContainer) => {
	const url = ("https://www.reddit.com" + currentPost.permalink).slice(0, -1);
	const response = await fetch(`${url}.json`);
	const responseJSON = await response.json();
	const answers = [];

	for (let i = 0; i < 5; i++) {
		if (responseJSON[1].data.children[i]) {
			answers.push(responseJSON[1].data.children[i].data.body);
		} else {
			break;
		}
	}
	addAnswersToPost(answers, postContainer);
};

const addAnswersToPost = (answers, postContainer) => {
	const addAnswerDiv = (answer, index) => {
		let answerDiv = document.createElement("div");
		answerDiv.setAttribute("class", "answer-wrapper");
		answerDiv.innerHTML = `<b class="answer-index">${index + 1}.</b> ${answer}`;
		postContainer.querySelector(".answers-section").appendChild(answerDiv);
	};

	answers.forEach((answer) => {
		let index = answers.indexOf(answer);
		addAnswerDiv(answer, index);
	});
};

export { addLink, createContainers, initAnswersSection };
