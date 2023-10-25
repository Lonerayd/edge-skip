function clickSkipAdButton() {
  // Check if there are any "Skip Ad" buttons and click them
  const skipAdButtons = Array.from(document.getElementsByClassName("ytp-ad-skip-button ytp-button"));
  if (skipAdButtons.length > 0) {
    skipAdButtons[0].click();
    console.log("skip: clicked the 'Skip Ad' button");
  } else {
    console.log("skip: no 'Skip Ad' button found");
  }
}

function skipAds() {
  const htmlVideoContainers = Array.from(document.getElementsByClassName("html5-video-container"));
  if (htmlVideoContainers.length === 0) {
    console.log("skip: no video containers found");
     
  } else {
    console.log("skip: video containers found");

    

    // Check if any of the containers have an ad
    // let adFound = false;
    for (const htmlVideoContainer of htmlVideoContainers) {
      const parentWrapper = htmlVideoContainer.parentNode;

      if (parentWrapper && String(parentWrapper.className).includes("ad-showing")) {
        console.log("skip: ad is playing, trying to skip...");

        const videoPlayer = htmlVideoContainer.querySelector("video");
        if (videoPlayer) {
          console.log("skip: video player found");
          videoPlayer.currentTime = 99999;
          // const skipAdButtons = Array.from(document.getElementsByClassName("ytp-ad-skip-button ytp-button"));
          // if (skipAdButtons.length > 0) {
          //   skipAdButtons[0].click();
          //   adFound = true;
          // }
          clickSkipAdButton();
        }
      }
    }

    

    if (!adFound) {
      console.log("skip: no ad found in any containers");
    }
  }
}


function onVideoStart() {
  console.log("Video started");
  skipAds();
}

function onVideoEnd() {
  console.log("Video ended");
  skipAds();
}

chrome.tabs?.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && String(tab.url).includes("https://www.youtube.com/watch")) {
    console.log("youtube video loaded");

  

    // Add event listeners for video start and end
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        const videoPlayer = document.querySelector("video.html5-main-video");
        
        if (videoPlayer) {
          videoPlayer.addEventListener("play", onVideoStart);
          videoPlayer.addEventListener("ended", onVideoEnd);
        }
        
  

      },
    });
  }
});
