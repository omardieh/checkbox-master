chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "countCheckboxes") {
    let count = 0;
    const { frameId, tabId } = sender;

    // Get the count of selected checkboxes from the specific frame
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId, frameIds: [frameId] },
        func: () => {
          const checkboxes = document.querySelectorAll(
            'input[type="checkbox"]'
          );
          return Array.from(checkboxes).filter((checkbox) => checkbox.checked)
            .length;
        },
      },
      (results) => {
        if (results && results[0]) {
          count = results[0].result;
        }
        sendResponse({ count });
      }
    );

    // Keep the message channel open for sendResponse
    return true;
  }
});
