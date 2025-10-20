// Content script for CopyDock extension

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelection') {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = document.createElement('div');
      container.appendChild(range.cloneContents());

      // Get clean HTML
      const selectedHTML = container.innerHTML;
      const selectedText = selection.toString();

      // Extract page info
      const sourceDomain = window.location.hostname.replace('www.', '');
      const sourceUrl = window.location.href;

      // Send to background script
      chrome.runtime.sendMessage({
        action: 'captureContent',
        data: {
          selectedText,
          selectedHTML,
          sourceDomain,
          sourceUrl,
        },
      });

      // Visual feedback
      showCaptureNotification();
    }
  }

  // Forward messages to CopyDock app
  if (request.type === 'CONTENT_CAPTURE') {
    window.postMessage(request, '*');
  }
});

// Listen for target notebook updates from CopyDock
window.addEventListener('message', (event) => {
  if (event.data.type === 'TARGET_NOTEBOOK_UPDATED') {
    chrome.runtime.sendMessage({
      action: 'setTargetNotebook',
      notebookId: event.data.notebookId,
    });
  }
});

// Show visual feedback when content is captured
function showCaptureNotification() {
  const notification = document.createElement('div');
  notification.textContent = '✅ Copied to CopyDock';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1C1C1E;
    color: white;
    padding: 12px 20px;
    border-radius: 20px;
    font-family: -apple-system, sans-serif;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
