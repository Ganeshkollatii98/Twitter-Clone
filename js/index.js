const URL = "http://localhost:3000/tweets";
let nextPageUrl=null;
var queryElement ={
    "searchQuery":"user-search-input",
    "tweetListQuery":"tweets-list"
}
/**
 * Retrive Twitter Data from API
 */
const onEnter = (e)=>{
    const Enter=e.keyCode;
    if(Enter===13)
    {
        getTwitterData();
    }
}
const getTwitterData = (nextPage=false) => {
     var UserQuery=document.getElementById(queryElement.searchQuery).value;
    const enCodedUrl=encodeURIComponent(UserQuery);
     let fullUrl=`${URL}?q=${enCodedUrl}&count=10`;
     if(nextPage && nextPageUrl)
     {
         fullUrl=nextPageUrl;
     }
     fetch(fullUrl).then((responce)=>{
         return responce.json();
     }).then((TweetList)=>{
         buildTweets(TweetList.statuses,nextPage);
         saveNextPage(TweetList.search_metadata);
         nextPageButtonVisibility(TweetList.search_metadata);
     })

}
const onNxtPage=()=>{
    if(nextPageUrl)
    {
        getTwitterData(true);
    }
}

/**
 * Save the next page data
 */
const saveNextPage = (metadata) => {
    if(metadata.next_results)
    {
        nextPageUrl=`${URL}${metadata.next_results}`
    }
    else{
        nextPageUrl=null;
    }
}

/**
 * Handle when a user clicks on a trend
 */
const selectTrend = (e) => {
    const text=e.innerText;
    document.getElementById(queryElement.searchQuery).value=text;
    getTwitterData();
}

/**
 * Set the visibility of next page based on if there is data on next page
 */
const nextPageButtonVisibility = (metadata) => {
     if(metadata.next_results)
     {
         document.getElementById('next-page').style.visibility="visible";
     }   
     else{
        document.getElementById('next-page').style.visibility="hidden";

     }
}

/**
 * Build Tweets HTML based on Data from API
 */
const buildTweets = (tweets, nextPage) => {
    var tweetsContent="";

    tweets.map((tweet)=>{
        var createdDate=moment(tweet.created_at).fromNow();
        tweetsContent+=`
                           <div class="tweet-container">
                                <div class="tweet-user-info">
                                    <div class="tweet-user-profile"style="background-image: url(${tweet.user.profile_image_url_https})"></div>
                                    <div class="tweet-user-name-container">
                                        <div class="tweet-user-fullname">${tweet.user.name}</div>
                                        <div class="tweet-user-username">@${tweet.user.screen_name}</div>
                                    </div>

                                </div>`
                    
                        if(tweet.extended_entities && tweet.extended_entities.media.length>0)
                         {
                            tweetsContent+=buildImages(tweet.extended_entities.media);
                            tweetsContent+=buildVideo(tweet.extended_entities.media);
                         }
                     tweetsContent+=`
                     <div class="tweet-text-container">
                                            ${tweet.full_text}
                                        </div>
                                        <div class="tweet-date-container">
                                            ${createdDate}
                                        </div>
                   </div>`
    })
    if(nextPage)
    {
    document.querySelector(`.${queryElement.tweetListQuery}`).insertAdjacentHTML("beforeend",tweetsContent)

    }
    else{
        document.querySelector(`.${queryElement.tweetListQuery}`).innerHTML=tweetsContent;

    }
    
}

/**
 * Build HTML for Tweets Images
 */
const buildImages = (mediaList) => {
    let imageContent=`<div class="tweet-images-container">`
    let imageExists=false;
    mediaList.map((media)=>{
        if(media.type=="photo")
        {
            imageExists=true;
            imageContent+=`<div class="tweet-image" style="background-image: url(${media.media_url_https})"></div>`
        }
    })
    imageContent+=`</div>`
    if(imageExists===true)
    {
        return imageContent;
    }
    else{
        return ' ';
    }
}

/**
 * Build HTML for Tweets Video
 */
const buildVideo = (mediaList) => {
    let videoContent=`<div class="tweet-video-container">`
    let videoExists=false;
    mediaList.map((media)=>{
        if(media.type=="video")
        {
            videoExists=true;
            const videoVariant=media.video_info.variants.find((variant)=>variant.content_type=='video/mp4');
            videoContent+=`<video controls>
            <source src="${videoVariant.url }" type="video/mp4">
        </video>`
        }
        else if(media.type=="animated_gif"){
            videoExists=true;
            const videoVariant=media.video_info.variants.find((variant)=>variant.content_type=='video/mp4');
            
            videoContent+=`<video loop autoplay>
            <source src="${videoVariant.url }" type="video/mp4">
        </video>`
        }
    })
    videoContent+=`</div>`
    if(videoExists===true)
    {
        return videoContent;
    }
    else{
        return ' ';
    }
}
