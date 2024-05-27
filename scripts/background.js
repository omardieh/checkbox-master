chrome.runtime.onInstalled.addListener(() => {
  console.log("Checkbox Master extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateBadge") {
    chrome.action.setBadgeText({ text: message.text });
    sendResponse({ status: "Badge updated" });
  }
});
