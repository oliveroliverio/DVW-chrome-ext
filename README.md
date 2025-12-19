






# YouTube Summarizer Chrome Extension

## Updating the extension
- for any updates such as modifying prompts in `popup.js`, go to `chrome://extentions/`, click on the extension, and reload.  

This repository contains a Chrome Extension used to summarize YouTube videos using the DeepSeek API.

## Installation

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button.
5. Select the `TL_youtubeSummarizer` folder located in this repository.
   - Path: `.../DVW-chrome-ext/TL_youtubeSummarizer`
6. The **YouTube Summarizer with DeepSeek** extension should now appear in your list.

## Usage

1. Navigate to any YouTube video (e.g., a tutorial).
2. Click the extension icon in the Chrome toolbar.
3. Enter your **DeepSeek API Key**.
   - Note: The API Key is stored locally in your browser/extension storage.
4. Select a **Template** from the dropdown (e.g., General, Music Producer, etc.).
5. Click **Summarize Video**.
6. The extension will:
   - Automatically open the transcript panel if it's closed.
   - Extract the transcript text.
   - Send it to DeepSeek.
   - Copy the resulting markdown summary to your **clipboard**.
7. Paste the summary into your notes or editor.

## Development

- **Manifest V3**: The extension uses the latest Chrome Manifest V3.
- **Components**:
  - `popup.html` / `popup.js`: The user interface.
  - `content.js`: Script compatible with YouTube to extract transcripts.
  - `background.js`: Service worker to handle API requests (avoids CORS issues).
- **Permissions**:
  - `scripting`, `activeTab`: To interact with the YouTube page.
  - `storage`: To save your API Key.
  - `clipboardWrite`: To copy the result.
