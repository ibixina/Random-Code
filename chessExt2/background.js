// background.js

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "analyzeFen") {
    // Forward the request into the tab’s content script
    chrome.tabs.sendMessage(
      sender.tab.id,
      { action: "analyzeFen", fen: req.fen },
      sendResponse,
    );
    return true; // keep channel open for async response
  }
});
