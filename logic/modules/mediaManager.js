const observerOptions = {
	threshold: 0.00001,
	rootMargin: '200px 0px 200px 0px',
};

const mediaObserver = new IntersectionObserver((entries, mediaObserver) => {
	entries.forEach(entry => {
		if (!entry.isIntersecting) {
			unloadMedia(entry.target);
		} else {
			loadMedia(entry.target);
		}
	});
}, observerOptions);

const loadMedia = media => {
	media.onload = function () {
		if (media.height != 0 && media.width != 0) {
			media.parentElement.style.paddingTop = media.height / media.width * 100 + '%';
		} else if (media.clientHeight != 0 && media.clientWidth != 0) {
			media.parentElement.style.paddingTop = media.clientHeight / media.clientWidth * 100 + '%';
		} else if (media.getAttribute('class') == 'iframe-media') {
			media.parentElement.style.paddingTop = '66.6%';
		} 
	};

	if(media.tagName == "VIDEO"){
		media.addEventListener("canplay", ()=>{
			media.parentElement.style.paddingTop = media.clientHeight / media.clientWidth * 100 + '%';
		});
	}

	media.src = media.getAttribute('media-src');

	const observeSizeChange = setInterval(() => {
		if (media.src != media.getAttribute('media-src')) {
			media.src = media.getAttribute('media-src');
		}
		if (media.clientHeight && media.clientWidth) {
			media.parentElement.style.paddingTop =
				media.clientHeight / media.clientWidth * 100 + '%';
			clearInterval(observeSizeChange);
		}
	}, 1000);
};

const unloadMedia = media => {
	media.src = '';
};

const identifyPostContent = (post_container, currentPost, displayExternalSource) => {
	const mediaTypes = {
		image: function () {
			let imgExtension = /\.(jpeg|jpg|gif|png)$/;
			if (currentPost.url_overridden_by_dest != null && currentPost.url_overridden_by_dest.match(imgExtension) != null) {
				createImage(post_container, currentPost);
				return true;
			}
		},
		gifv: function () {
			let gifvExtension = /\.(gifv)$/;
			if (currentPost.url_overridden_by_dest != null && currentPost.url_overridden_by_dest.match(gifvExtension) != null) {
				createGifv(post_container, currentPost, currentPost.url_overridden_by_dest);
				return true;
			}
		},
		video: function () {
			if (currentPost.is_video == true) {
				createVideo(post_container, currentPost, currentPost.media.reddit_video);
				return true;
			}
		},
		shared_video: function () {
			if (currentPost.crosspost_parent_list != null && currentPost.crosspost_parent_list[0].is_video == true) {
				createVideo(post_container, currentPost, currentPost.crosspost_parent_list[0].media.reddit_video);
				return true;
			}
		},
		embedded_iframe: function () {
			if (currentPost.media != null && currentPost.media.oembed != null && displayExternalSource == true) {
				createIFrame(post_container, currentPost, currentPost.media.oembed, true);
				return true;
			}
		},
		iframe: function () {
			if (currentPost.url_overridden_by_dest != null && displayExternalSource == true) {
				createIFrame(post_container, currentPost, currentPost.url_overridden_by_dest, false);
				return true;
			}
		}
	};

	for (let type in mediaTypes) {
		let isRecognized = mediaTypes[type]();
		if (isRecognized) break;
	}
};

const createImage = (postContainer, postData) => {
	const image = document.createElement('img');
	image.setAttribute('media-src', postData.url_overridden_by_dest);
	image.setAttribute('class', 'media');
	postContainer.querySelector('.media-section').appendChild(image);
	mediaObserver.observe(image);
};

const createVideo = (postContainer, postData, postMediaContainer) => {
	const video = document.createElement('video');
	const audio = document.createElement('audio');
	video.setAttribute('class', 'media');

	const playVideoSynchronously = e => {
		if (e.type == 'canplay') {
			video.addEventListener('play', ev => {
				ev.preventDefault();
				if (video.readyState == 4) {
					video.play();
					audio.currentTime = video.currentTime;
					audio.play();
				}
			});
		} else if (e.type == 'pause') {
			audio.pause();
		}
	};

	const configureVideo = () => {
		video.controls = 'true';
		video.addEventListener('canplay', playVideoSynchronously);
		video.addEventListener('pause', playVideoSynchronously);
		video.addEventListener('waiting', () => audio.pause());
		video.addEventListener('playing', () => audio.play());
		video.addEventListener('seeking', () => {
			audio.pause();
			audio.currentTime = video.currentTime;
		});
		video.setAttribute('media-src', postMediaContainer.fallback_url);
	};

	const configureAudio = () => {
		let urlCut = postMediaContainer.fallback_url.split('DASH_')[0];
		let audioUrl = `${urlCut}DASH_audio.mp4?source=fallback`;
		audio.setAttribute('media-src', audioUrl);

		const audioSource = document.createElement('source');
		audioSource.src = audioUrl;
		audioSource.type = 'audio/mp4';
		audio.appendChild(audioSource);
	};

	configureVideo();
	configureAudio();

	postContainer.querySelector('.media-section').appendChild(video);
	mediaObserver.observe(video);
};

const createIFrame = (postContainer, postData, postMediaContainer, embedded) => {
	const iframe = document.createElement('iframe');
	iframe.allowFullscreen = true;
	iframe.setAttribute('class', 'iframe-media');

	if (embedded == true) {
		let link = "";
		if( postMediaContainer.html.includes("cdn") ) {
			link = 'h' + postMediaContainer.html.split('src=h')[1].split('&amp')[0];
		} else {
			link = postMediaContainer.html.split('src="')[1].split('"')[0];
		}
		iframe.setAttribute('media-src', decodeURIComponent(link));
	} else {
		iframe.setAttribute('media-src', postMediaContainer);
	}
	postContainer.querySelector('.media-section').appendChild(iframe);
	mediaObserver.observe(iframe);
};

const createGifv = (postContainer, postData, postMediaContainer) => {
	const video = document.createElement('video');
	video.controls = 'true';
	let toMp4 = postMediaContainer.replace('.gifv', '.mp4');
	video.setAttribute('media-src', toMp4);
	video.setAttribute('class', 'media');
	postContainer.querySelector('.media-section').appendChild(video);
	mediaObserver.observe(video);
};

export { identifyPostContent };
