import OptionsScreen from "./components/options-screen.js";

document.addEventListener("DOMContentLoaded", DOMContentLoaded);

function DOMContentLoaded() {
  const checkButton = document.createElement("button");
  checkButton.textContent = "Check All";
  const uncheckButton = document.createElement("button");
  uncheckButton.textContent = "Uncheck All";
  const counter = document.createElement("span");
  counter.textContent = "Selected: 0";

  new OptionsScreen(
    document.getElementById("root"),
    checkButton,
    uncheckButton,
    counter
  );

  checkButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id, allFrames: true },
            func: checkAllBoxes,
          },
          updateSelectedCount
        );
      }
    });
  });

  uncheckButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id, allFrames: true },
            func: uncheckAllBoxes,
          },
          updateSelectedCount
        );
      }
    });
  });

  function checkAllBoxes() {
    function checkCheckboxes(doc) {
      doc.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        if (!checkbox.checked) {
          checkbox.click();
        }
      });
    }

    checkCheckboxes(document);

    document.querySelectorAll("iframe").forEach((iframe) => {
      try {
        const iframeDocument =
          iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDocument) {
          checkCheckboxes(iframeDocument);
        }
      } catch (e) {
        // Silently handle cross-origin iframe access errors
      }
    });
  }

  function uncheckAllBoxes() {
    function uncheckCheckboxes(doc) {
      doc.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
        if (checkbox.checked) {
          checkbox.click();
        }
      });
    }

    uncheckCheckboxes(document);

    document.querySelectorAll("iframe").forEach((iframe) => {
      try {
        const iframeDocument =
          iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDocument) {
          uncheckCheckboxes(iframeDocument);
        }
      } catch (e) {
        // Silently handle cross-origin iframe access errors
      }
    });
  }

  function updateSelectedCount() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id, allFrames: true },
            func: countSelectedCheckboxes,
          },
          (results) => {
            const totalCount = results.reduce(
              (sum, result) => sum + (result.result || 0),
              0
            );
            counter.textContent = `Selected: ${totalCount}`;
          }
        );
      }
    });
  }

  function countSelectedCheckboxes() {
    function countCheckboxes(doc) {
      return Array.from(doc.querySelectorAll('input[type="checkbox"]')).filter(
        (checkbox) => checkbox.checked
      ).length;
    }

    let count = countCheckboxes(document);

    document.querySelectorAll("iframe").forEach((iframe) => {
      try {
        const iframeDocument =
          iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDocument) {
          count += countCheckboxes(iframeDocument);
        }
      } catch (e) {
        // Silently handle cross-origin iframe access errors
      }
    });

    return count;
  }

  // Initialize the count on page load
  updateSelectedCount();
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "updateButtonText") {
    const button = document.querySelector("button");
    button.textContent = message.allChecked ? "Uncheck All" : "Check All";
  }
});
