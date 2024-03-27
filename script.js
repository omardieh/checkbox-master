document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  const button = document.createElement("button");
  button.innerHTML = "Tick All Boxes";
  root.appendChild(button);
  button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: checkAllBoxes,
      });
    });
  });
});

function checkAllBoxes() {
  document
    .querySelectorAll('input[type="checkbox"]')
    .forEach((checkbox) => !checkbox.checked && checkbox.click());
}
