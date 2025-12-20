# Project Log

## 2025-12-19
**Feat: Prepend YouTube Title and URL to Summary**

Modified `TL_youtubeSummarizer/content.js` and `TL_youtubeSummarizer/popup.js` to extract the video title and URL from the active tab and prepend them to the generated markdown summary.

**Implementation Details:**
- **`TL_youtubeSummarizer/content.js`:**
    - Updated `handleGetTranscript` and `tryExtractAfterWait` to grab the video title using selectors or `document.title` (removing " - YouTube").
    - Included `title` and `url` in the response object sent to `popup.js`.
- **`TL_youtubeSummarizer/popup.js`:**
    - Updated `handleTranscriptResponse` to capture `title` and `url`.
    - Modified the final result generation to prepend `# [${title}](${url})` before displaying and copying.

**Next Steps:**
- Verify that the title extraction works on various YouTube video pages (e.g. normal videos vs shorts vs live streams).
- Ensure the markdown link renders correctly in target markdown viewers.
