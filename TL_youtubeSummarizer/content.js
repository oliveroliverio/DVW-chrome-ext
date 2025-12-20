(() => {
    // Listen for messages from Popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "GET_TRANSCRIPT") {
            handleGetTranscript(sendResponse);
            return true; // Keep channel open for async response
        }
    });

    const extractTranscriptText = () => {
        const container = document.getElementById("segments-container");
        if (!container) return null;

        const cleanedText = container.innerText
            .replace(/\n/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
        return cleanedText;
    };

    const handleGetTranscript = (sendResponse) => {
        // 1. Try to find existing transcript
        let text = extractTranscriptText();
        const title = document.querySelector('#title > h1')?.innerText?.trim() || document.title.replace(" - YouTube", "").trim();
        const url = window.location.href;

        if (text && text.length > 0) {
            sendResponse({ success: true, transcript: text, title: title, url: url });
            return;
        }

        // 2. If not found, try to open the panel
        // Logic adapted from user snippet
        let transcriptRenderer = document.querySelector('ytd-video-description-transcript-section-renderer');

        const tryExtractAfterWait = () => {
            setTimeout(() => {
                const text = extractTranscriptText();
                const title = document.querySelector('#title > h1')?.innerText?.trim() || document.title.replace(" - YouTube", "").trim();
                const url = window.location.href;

                if (text) {
                    sendResponse({ success: true, transcript: text, title: title, url: url });
                } else {
                    sendResponse({ success: false, error: "Cloud not extract text after expanding." });
                }
            }, 1500); // Wait for transcript to load
        };

        if (!transcriptRenderer || transcriptRenderer.offsetParent === null) {
            // Expand description if needed
            const bottomRow = document.getElementById("bottom-row"); // "More" button description
            if (bottomRow) bottomRow.click();

            setTimeout(() => {
                transcriptRenderer = document.querySelector('ytd-video-description-transcript-section-renderer');
                if (transcriptRenderer) {
                    const showTranscriptBtn = transcriptRenderer.querySelector('button[aria-label="Show transcript"]');
                    if (showTranscriptBtn) {
                        showTranscriptBtn.click();
                        tryExtractAfterWait();
                    } else {
                        // Maybe it's already open?
                        tryExtractAfterWait();
                    }
                } else {
                    sendResponse({ success: false, error: "Transcript renderer not found." });
                }
            }, 1000);
        } else {
            // Description expanded, check button
            const showTranscriptBtn = transcriptRenderer.querySelector('button[aria-label="Show transcript"]');
            if (showTranscriptBtn) {
                showTranscriptBtn.click();
                tryExtractAfterWait();
            } else {
                tryExtractAfterWait();
            }
        }
    };
})();
