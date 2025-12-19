const PROMPT_TEMPLATES = {
    "general_summary": {
        "name": "General Summarizer",
        "prompt": `Create a comprehensive summary of the following YouTube video transcript. Include key points, main topics, and important details in a well-structured markdown format.`
    },
    "music_producer": {
        "name": "Music Producer",
        "prompt": `You are a **Professional Music Producer and Audio Engineer**.
                Summarize the following **YouTube tutorial transcript** into a **fully reproducible technical instruction manual**, formatted in **Markdown**.
                
                The goal is for the reader to be able to **replicate exactly what the video demonstrates** — including signal flow, sound design parameters, mixing chain, and arrangement techniques.
                
                Note: The reader is using **[Insert User's DAW, e.g., Ableton Live / Reaper / Logic Pro]**.
                Please include the following sections:
                
                ## Overview
                - Provide a 2–3 sentence overview of the production technique, sound design goal, mixing outcome, or AI assisted methodology outcome.
                - Mention key instruments (VSTs/Hardware), effects plugins, software/services, or music theory concepts involved.
                
                ## Requirements and Setup
                - List **DAW requirements**, necessary third-party plugins (or stock alternatives), and sample packs.
                - Specify **routing setups** (e.g., Send/Return tracks, Group buses, Sidechain routing).
                - Link to **relevant presets, sample libraries, or project files** referenced in the video.
                - Use bold text for specific plugin names.
                
                ## Step-by-Step Implementation Guide
                - Reproduce each step from the tutorial **in order**.
                - Include:
                  - **Menu paths and Keyboard shortcuts** (e.g., "Create new MIDI track: 'Cmd+Shift+T'").
                  - **Parameter values** (e.g., "Set Attack to **15ms**, Ratio to **4:1**, Threshold to **-12dB**").
                  - **Signal Chain Order** (e.g., Synth -> EQ -> Saturation -> Compressor).
                  - **Musical details** (Chord progressions, specific notes, or automation curve shapes).
                - Each major step should have a subheader (e.g., "### Step 3: Designing the Bass Patch").
                - Ensure all knob values, fader levels, and routing destinations are precise.
                
                ## Common Issues and Fixes
                - Summarize any **mixing mistakes or technical issues** mentioned (e.g., Phase cancellation, Muddy frequencies, Clipping).
                - Include diagnostic tips (e.g., "Check correlation meter," "Solo the low-end").
                - Optionally include a **comparison table** (Problem | Cause | Mixing Move).
                
                ## Example Output or Results
                - Describe the **expected sonic result** (e.g., "The kick should punch through the mix without pumping").
                - Explain how to verify the result (e.g., "Use a spectrum analyzer to check the sub-bass around 40Hz").
                - Reference visual cues like waveform shapes or gain reduction meters.
                
                ## Additional Notes and Tips
                - Include any optional creative variations, workflow hacks, or CPU-saving tips.
                - Mention **mastering considerations** or alternative plugin recommendations.
                
                ## Review Questions (Optional)
                - Include 3–5 questions testing understanding of the production concept.
                - Link to **external resources or similar tutorials** for deeper learning.
                
                ---
                
                **Formatting Guidelines**
                - Use bullet points, tables, and bold text liberally for readability.
                - Wrap **keyboard shortcuts** and **parameter values** in single backticks or bold text.
                - Prefer accuracy and reproducibility — assume the reader is following along in their DAW in real time.`
    },

    "filipino_linguist": {
        "name": "Filipino Linguist",
        "prompt": `Your role: A Filipino Linguist. Convert the following youtube video into a comprehensive, thoroughly covered summary document in the style of 'Quickstudy charts' formatted in markdown complete with instructions on verb conjugation`
    },
    "ai_developer": {
        "name": "AI Developer",
        "prompt": `Summarize the article/chapter/transcript explaining the key points. Include detailed instructions for workflows for a particular goal/outcome and be sure to include code snippets, terminal commands, installation/package requirements (note: I prefer UV for installing python packages). Output comparison tables if there were any topics or key terms of comparison. Note: the reader owns an RTX Pro 6000 Blackwell Max-Q if relevant`
    },
    "technical_analysis": {
        "name": "Technical Analysis",
        "prompt": `Analyze the following YouTube video transcript from a technical perspective. Break down complex concepts, identify key technical terms, and provide explanations in markdown format.`
    },
    "educational_notes": {
        "name": "Educational Study Notes",
        "prompt": `Convert the following YouTube video transcript into detailed study notes. Include main concepts, examples, and key takeaways formatted as comprehensive educational material in markdown.`
    },
    "action_items": {
        "name": "Action Items & Insights",
        "prompt": `Extract actionable insights and key takeaways from the following YouTube video transcript. Focus on practical applications and important points that viewers should remember.`
    },
    "software_developer": {
        "name": "Software Developer",
        "prompt": `Summarize the following **YouTube tutorial transcript** into a **fully reproducible technical instruction manual**, formatted in **Markdown**.
            The goal is for the reader to be able to **replicate exactly what the video demonstrates** — including setup, dependencies, commands, and code.
            
            Note: the reader owns an RTX Pro 6000 Blackwell Max-Q if relevant
            Please include the following sections:
            
            ## Overview
            - Provide a 2–3 sentence overview of what the tutorial accomplishes and its end goal.
            - Mention key technologies, frameworks, or programming languages involved.
            
            ## Requirements and Setup
            - List **software requirements**, dependencies, and environment setup.
            - Include **terminal commands** for installation
            - Specify **operating system compatibility** (e.g., macOS, Windows, Linux).
            - Link to **relevant GitHub repositories**, APIs, datasets, or documentation referenced in the video.
            - Use fenced code blocks for commands.
            
            ## Step-by-Step Implementation Guide
            - Reproduce each step from the tutorial **in order**.
            - Include:
              - Terminal commands
              - File creation or directory structure
              - Code snippets (use correct language fencing, e.g., \`\`\`python\`\`\`)
              - Configuration settings (".env", "config.json", etc.)
              - Menu paths and keyboard shortcuts if GUI-based (e.g., "File → Preferences → Settings")
            - Each major step should have a subheader (e.g., "### Step 3: Train the Model").
            - Ensure all variables, filenames, and environment paths are consistent.
            
            ## Common Issues and Fixes
            - Summarize any **errors or issues** mentioned in the video and how they were resolved.
            - Include diagnostic commands or configuration edits if shown.
            - Optionally include a **comparison table** (Problem | Cause | Solution).
            
            ## Example Output or Results
            - Show **expected outputs**, screenshots, or sample terminal outputs.
            - If applicable, explain how to verify the build, run, or output correctness.
            
            ## Additional Notes and Tips
            - Include any optional optimizations, shortcuts, or alternative libraries/tools.
            - Mention any **performance considerations**, flags, or environment variables.
            
            ## Review Questions (Optional)
            - Include 3–5 questions testing understanding of the material.
            - Link to **external resources or GitHub examples** for deeper learning.
            
            ---
            
            **Formatting Guidelines**
            - Use bullet points, tables, and fenced code blocks liberally.
            - Use bold text for commands or parameters when explaining them inline.
            - Wrap keyboard shortcuts in single backticks
            - Prefer accuracy and reproducibility over brevity — assume the reader is following along in real time.`
    },
};

document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const templateSelect = document.getElementById('template');
    const summarizeBtn = document.getElementById('summarizeBtn');
    const statusDiv = document.getElementById('status');

    // Load saved settings
    chrome.storage.local.get(['deepseekApiKey', 'selectedTemplate'], (result) => {
        if (result.deepseekApiKey) {
            apiKeyInput.value = result.deepseekApiKey;
        }
        if (result.selectedTemplate) {
            templateSelect.value = result.selectedTemplate;
        }
    });

    summarizeBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        const selectedTemplateKey = templateSelect.value;

        if (!apiKey) {
            setStatus('Please enter an API Key.', 'error');
            return;
        }

        // Save settings
        chrome.storage.local.set({
            deepseekApiKey: apiKey,
            selectedTemplate: selectedTemplateKey
        });

        setStatus('Getting transcript...', 'normal');
        summarizeBtn.disabled = true;

        // Get active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0] || !tabs[0].id) {
                setStatus('No active tab found.', 'error');
                summarizeBtn.disabled = false;
                return;
            }

            // Send message to content script
            chrome.tabs.sendMessage(tabs[0].id, { action: "GET_TRANSCRIPT" }, (response) => {
                // Check if lastError exists (content script not injected??)
                if (chrome.runtime.lastError) {
                    console.warn("Connection failed. Attempting to inject content script...", chrome.runtime.lastError);
                    setStatus('Injecting script...', 'normal');

                    // Attempt to inject content script
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['content.js']
                    }, () => {
                        if (chrome.runtime.lastError) {
                            setStatus('Failed to inject script: ' + chrome.runtime.lastError.message + '. Please reload page.', 'error');
                            console.error("Injection failed:", chrome.runtime.lastError);
                            summarizeBtn.disabled = false;
                            return;
                        }

                        // Retry extracting transcript after injection
                        setTimeout(() => {
                            chrome.tabs.sendMessage(tabs[0].id, { action: "GET_TRANSCRIPT" }, (response2) => {
                                if (chrome.runtime.lastError) {
                                    setStatus('Still failing after injection. Please reload the YouTube page.', 'error');
                                    console.error("Retry failed:", chrome.runtime.lastError);
                                    summarizeBtn.disabled = false;
                                } else {
                                    handleTranscriptResponse(response2);
                                }
                            });
                        }, 500);
                    });
                    return;
                }

                handleTranscriptResponse(response);
            });

        }); // end tabs.query

        function handleTranscriptResponse(response) {
            if (!response || !response.success) {
                setStatus(response ? response.error : 'Failed to get transcript.', 'error');
                summarizeBtn.disabled = false;
                return;
            }

            // We have transcript
            const transcript = response.transcript;
            setStatus('Transcript extracted (' + transcript.length + ' chars). Sending to DeepSeek...', 'normal');

            // Build prompt
            const templateConfig = PROMPT_TEMPLATES[selectedTemplateKey];
            const instruction = templateConfig ? templateConfig.prompt : PROMPT_TEMPLATES["general_summary"].prompt;

            const finalPrompt = `
${instruction}

Start the header level at "##" because I will be pasting this in a section that already has a top level header. 
No need to add a main title. Just proceed with the summary sections.

Transcript:
\`\`\`
${transcript}
\`\`\`
            `.trim();

            // Send to background for API call
            chrome.runtime.sendMessage({
                action: "SUMMARIZE",
                apiKey: apiKey,
                prompt: finalPrompt
            }, (apiResponse) => {
                if (chrome.runtime.lastError) {
                    setStatus('Error contacting background service.', 'error');
                    summarizeBtn.disabled = false;
                    return;
                }

                if (apiResponse && apiResponse.success) {
                    // Copy to clipboard
                    navigator.clipboard.writeText(apiResponse.summary)
                        .then(() => {
                            setStatus('Summary copied to clipboard!', 'success');
                        })
                        .catch(err => {
                            setStatus('Summary generated but failed to copy. Check console.', 'error');
                            console.error(err);
                        });
                } else {
                    setStatus('API Error: ' + (apiResponse ? apiResponse.error : 'Unknown'), 'error');
                }
                summarizeBtn.disabled = false;
            });
        }

    });

    function setStatus(msg, type) {
        statusDiv.innerText = msg;
        statusDiv.className = type === 'error' ? 'error' : (type === 'success' ? 'success' : '');
    }
});
