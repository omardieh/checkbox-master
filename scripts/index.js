import OptionsScreen from "../components/options-screen.js";

document.addEventListener("DOMContentLoaded", () => {
  const { checkButton, uncheckButton, updateCountText } = new OptionsScreen(
    document.getElementById("root")
  );
  checkButton.addEventListener("click", () => {
    useChromeQuery({ func: toggleCheckboxes, args: [true] }, () =>
      updateCount(updateCountText)
    );
  });
  uncheckButton.addEventListener("click", () => {
    useChromeQuery({ func: toggleCheckboxes }, () =>
      updateCount(updateCountText)
    );
  });
  updateCount(updateCountText);
});

function useChromeQuery(action, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id, allFrames: true },
          func: action.func,
          args: action.args,
        },
        callback
      );
    }
  });
}

function toggleCheckboxes(check) {
  const documents = getAllDocs(document);
  documents.forEach((doc) => handleCheck(doc, check));
  function getAllDocs(doc) {
    const documents = [doc];
    const iframes = doc.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      if (iframeDoc) {
        documents.push(iframeDoc);
        const nestedDocs = getAllDocs(iframeDoc);
        if (!nestedDocs.length) return documents;
        nestedDocs.forEach((nestedDoc) => documents.push(nestedDoc));
      }
    });
    return documents;
  }
  function handleCheck(doc, check) {
    doc.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      if (check) {
        if (!checkbox.checked) {
          checkbox.click();
        }
      } else {
        if (checkbox.checked) {
          checkbox.click();
        }
      }
    });
  }
}

function updateCount(updateCountText) {
  useChromeQuery({ func: countCheckboxes }, (results) => {
    updateCountText(
      results.reduce((sum, result) => sum + (result.result || 0), 0)
    );
  });

  function countCheckboxes() {
    let count = 0;
    const documents = getAllDocs(document);
    documents.forEach((doc) => (count += handleCount(doc)));
    function getAllDocs(doc) {
      const documents = [doc];
      const iframes = doc.querySelectorAll("iframe");
      iframes.forEach((iframe) => {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
          documents.push(iframeDoc);
          const nestedDocs = getAllDocs(iframeDoc);
          if (!nestedDocs.length) return documents;
          nestedDocs.forEach((nestedDoc) => documents.push(nestedDoc));
        }
      });
      return documents;
    }
    function handleCount(doc) {
      return Array.from(doc.querySelectorAll('input[type="checkbox"]')).filter(
        (checkbox) => checkbox.checked
      ).length;
    }
    return count;
  }
}
