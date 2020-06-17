const URL = "http://localhost:3000/tweets";
const nextURL = "http://localhost:3000/tweets/next";
var nextPageParams = "";

const onEnter = (event) => {
    if (event.key == "Enter") {
        searchTweets();
    }
}

const getNextPage = () => {
    if (nextPageParams != "") {
        searchTweets(false);
    }
}

const resetDisplay = () => {
    document.querySelector(".tweets-list-container").innerHTML = "";
    document.getElementById("next-page").style.visibility = "hidden";
}

searchTweets = (newSearch=true) => {
    const query = document.getElementById("search-input").value;
    if(!query) return;
    const encodedQuery = encodeURIComponent(query);
    let fullURL = "";
    
    if (newSearch) {
        resetDisplay();
        fullURL = `${URL}?q=${encodedQuery}&count=10`;
    } else {
        fullURL = `${nextURL}${nextPageParams}`;
    }

    fetch(fullURL)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        saveNextPageInfo(data.search_metadata);
        getTwitterData(data.statuses, newSearch);
    })
    .catch((error) => {
        console.log(error);
    })
}

const getTwitterData = (tweetList, newSearch) => {
    let tweetHtml = "";

    tweetList.forEach((tweet) => {
        const displayDate = moment(tweet.created_at, "ddd MMM D HH:mm:ss Z YYYY").fromNow();
        
        tweetHtml += `
        <div class="individual-tweet">
            <div class="tweet-user-container">
                <div class="tweet-user-profile" style="background-image: ${tweet.user.profile_background_image_url_https};"></div>
                <div class="tweet-user-info">
                    <div class="tweet-user-name">${tweet.user.name}</div>
                    <div class="tweet-user-handle">@${tweet.user.screen_name}</div>
                </div>
            </div>
        `;

        if(tweet.extended_entities && 
            tweet.extended_entities.media && 
            tweet.extended_entities.media.length > 0) {
            tweetHtml += buildImages(tweet.extended_entities.media);
            tweetHtml += buildVideo(tweet.extended_entities.media);
        };

        tweetHtml += `
            <div class="tweet-text">
                ${tweet.text}
            </div>
            <div class="tweet-date">
                ${displayDate}
            </div>
        </div>
        `;
    });

    if(newSearch){
        document.querySelector(".tweets-list-container").innerHTML = tweetHtml;
    } else {
        document.querySelector(".tweets-list-container").insertAdjacentHTML('beforeend', tweetHtml);
    }
}

const buildImages = (mediaList) => {
    let imagesHtml = `<div class="tweet-image-container">`;
    let imagesExist = false;
    mediaList.map((media)=>{
        if(media.type == "photo"){
            imagesExist = true;
            imagesHtml += `
                <div class="tweet-image" style="background-image: url(${media.media_url_https})"></div>
            `
        }
    })
    imagesHtml += `</div>`;
    return (imagesExist ? imagesHtml : '');
}

const buildVideo = (mediaList) => {
    let videoHtml = `<div class="tweet-video-container">`;
    let videoExists = false;
    mediaList.map((media)=>{
        if(media.type == "video" || media.type == 'animated_gif'){
            videoExists = true;
            const video = media.video_info.variants.find((video)=>video.content_type == 'video/mp4');
            const videoOptions = getVideoOptions(media.type);
            videoHtml += `
            <video ${videoOptions}>
                <source src="${video.url}" type="video/mp4">
                Your browser does not support HTML5 video.
            </video>
            `
        }
    })
    videoHtml += `</div>`;
    return (videoExists ? videoHtml : '');
}

const getVideoOptions = (mediaType) => {
    if(mediaType == 'animated_gif'){
        return "loop autoplay";
    } else {
        return "controls";
    }
}

const saveNextPageInfo = (metadata) => {
    if (metadata.next_results) {
        nextPageParams = metadata.next_results;
        document.getElementById("next-page").style.visibility = "visible";
    } else {
        nextPageParams = "";
        document.getElementById("next-page").style.visibility = "hidden";
    }
}

const trendSearch = (trend) => {
    resetDisplay();
    document.getElementById("search-input").value = trend;
    searchTweets();
}