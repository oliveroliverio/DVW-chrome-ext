# Bugfix: "Error connecting to page" in YouTube Summarizer

## Issue
The user reported an error when clicking "Summarize Video":
> "Error connecting to page. Ensure you are on a YouTube video and reload the page."

This occurs because `chrome.tabs.sendMessage` in `popup.js` fails to find a receiving listener in the active tab. This typically happens when:
1. The extension is installed or reloaded while a YouTube tab is already open.
2. The content script (`content.js`) is not automatically injected into existing tabs, only new ones or after a reload.

## Resolution
To make the extension more robust/user-friendly without forcing a page reload, we will modify `popup.js` to handle the connection error by programmatically injecting the content script and then retrying the message.

### Steps
1. Modify `TL_youtubeSummarizer/popup.js`.
2. Wrap the message sending logic in a function that can be retried.
3. If `chrome.runtime.lastError` is detected (connection failure):
   - Use `chrome.scripting.executeScript` to inject `content.js` into the target tab.
   - Wait briefly (500ms) for initialization.
   - Retry sending the "GET_TRANSCRIPT" message.

### Code Snippet (popup.js)

```javascript
function sendMessageToContentScript(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "GET_TRANSCRIPT" }, (response) => {
        if (chrome.runtime.lastError) {
            // Check for specific error or just assume script missing
            console.warn("Connection failed, attempting injection...", chrome.runtime.lastError);
            setStatus('Injecting script...', 'normal');
            
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            }, () => {
                if (chrome.runtime.lastError) {
                    setStatus('Failed to inject script: ' + chrome.runtime.lastError.message, 'error');
                } else {
                    // Retry
                    setTimeout(() => {
                        chrome.tabs.sendMessage(tabId, { action: "GET_TRANSCRIPT" }, (response2) => {
                             if (chrome.runtime.lastError) {
                                 setStatus('Still requesting reload. Please refresh the YouTube page.', 'error');
                             } else {
                                 handleTranscriptResponse(response2);
                             }
                        });
                    }, 500);
                }
            });
            return;
        }
        handleTranscriptResponse(response);
    });
}
```
