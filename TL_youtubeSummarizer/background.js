chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SUMMARIZE") {
        handleSummarize(request, sendResponse);
        return true; // Keep channel open
    }
});

async function handleSummarize(request, sendResponse) {
    const { apiKey, prompt } = request;

    if (!apiKey) {
        sendResponse({ success: false, error: "API Key is missing." });
        return;
    }

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: prompt }
                ],
                stream: false
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            sendResponse({ success: false, error: `API Error: ${response.status} ${errText}` });
            return;
        }

        const data = await response.json();
        const summary = data.choices?.[0]?.message?.content || 'No response text';

        sendResponse({ success: true, summary });

    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
}
