chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!!request.time) {
    chrome.storage.local.set({ 'time': request.time }, function () {});
    sendResponse({ time: request.time });
  }
   return true
});
