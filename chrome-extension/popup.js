// Popup script for CopyDock extension

document.getElementById('openApp').addEventListener('click', () => {
  chrome.tabs.create({ url: 'http://localhost:3000' });
});

// Load and display status
chrome.storage.local.get(['targetNotebookId'], (result) => {
  const statusEl = document.getElementById('status');
  const targetEl = document.getElementById('target');

  if (result.targetNotebookId) {
    statusEl.textContent = 'Active';
    targetEl.textContent = 'Set';
    statusEl.style.color = '#4ade80';
  } else {
    statusEl.textContent = 'No target notebook';
    targetEl.textContent = 'Not set';
    statusEl.style.color = '#ef4444';
  }
});
