// Background service worker for CopyDock extension

let targetNotebookId = null;

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'copydock-capture',
    title: 'Copy to CopyDock',
    contexts: ['selection'],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'copydock-capture' && info.selectionText) {
    // Send message to content script to get full HTML
    chrome.tabs.sendMessage(tab.id, {
      action: 'getSelection',
      text: info.selectionText,
    });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureContent') {
    // Forward to CopyDock app
    chrome.tabs.query({ url: '*://localhost:3000/*' }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'CONTENT_CAPTURE',
          payload: request.data,
        });
      } else {
        // Open CopyDock if not open
        chrome.tabs.create({ url: 'http://localhost:3000' }, (newTab) => {
          // Wait for tab to load
          setTimeout(() => {
            chrome.tabs.sendMessage(newTab.id, {
              type: 'CONTENT_CAPTURE',
              payload: request.data,
            });
          }, 2000);
        });
      }
    });
  }

  if (request.action === 'setTargetNotebook') {
    targetNotebookId = request.notebookId;
    chrome.storage.local.set({ targetNotebookId });
  }
});

// Load target notebook on startup
chrome.storage.local.get(['targetNotebookId'], (result) => {
  targetNotebookId = result.targetNotebookId;
});
