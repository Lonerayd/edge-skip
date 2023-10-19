chrome.runtime.onInstalled.addListener(function () {
  console.log("background");
});

function getSkipButton() {
  const skipAdButton = Array.from(
    document.getElementsByClassName("ytp-ad-skip-button ytp-button")
  );
  return skipAdButton.length > 0 ? skipAdButton[0] : null;
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    String(tab.url).includes("https://www.youtube.com/watch")
  ) {
    console.log("on youtube");
    // Execute the content script in the tab's context
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: function() {
        const videoPlayer = document.querySelector("video.html5-main-video");
        if (videoPlayer) {
          videoPlayer.addEventListener("timeupdate", () => {
            const skipButton = document.querySelector(".ytp-ad-skip-button");
            if (skipButton) {
              skipButton.click();
            }
          });

          const wrapper = videoPlayer.parentElement;
          if (wrapper) {
            function isAdShowing() {
              return (
                wrapper !== undefined && String(wrapper.className).includes("ad-showing")
              );
            }

            if (isAdShowing()) {
              videoPlayer.currentTime = videoPlayer.duration - 1;
              videoPlayer.pause();
              videoPlayer.play();
            }
          }
        }
      }
    });
  }
});
