(() => {
    // ==========================================
    // ⚙️ USER CONFIGURATION
    // ==========================================

    // Choose your template key here (e.g., 'software_developer', 'filipino_linguist', 'general_summary')
    const SELECTED_TEMPLATE = "ai_developer";

    // Add your API Key here
    const API_KEY = ...;

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

    // ==========================================
    // 🚀 LOGIC START
    // ==========================================

    const extractTranscript = () => {
        const container = document.getElementById("segments-container");
        if (!container) {
            console.warn('Transcript container not found.');
            return '';
        }

        const cleanedText = container.innerText
            .replace(/\n/g, ' ')             // Replace line breaks with a space
            .replace(/\s{2,}/g, ' ')         // Remove extra spaces
            .trim();

        console.log('Transcript length:', cleanedText.length);
        console.log(cleanedText)
        return cleanedText;
    };

    const buildMarkdownPrompt = (text) => {
        // 1. Get the selected template
        const templateConfig = PROMPT_TEMPLATES[SELECTED_TEMPLATE];

        // Fallback if key is typo'd
        if (!templateConfig) {
            console.error(`Template "${SELECTED_TEMPLATE}" not found. Using general_summary.`);
        }
        const finalInstruction = templateConfig ? templateConfig.prompt : PROMPT_TEMPLATES["general_summary"].prompt;

        console.log(`Using Template: ${templateConfig ? templateConfig.name : "General (Fallback)"}`);

        // 2. Construct the full prompt
        return `
${finalInstruction}

Start the header level at "##" because I will be pasting this in a section that already has a top level header. 
No need to add a main title. Just proceed with the summary sections.

Transcript:
\`\`\`
${text}
\`\`\`
        `.trim();
    };

    const sendToDeepSeek = async (prompt) => {
        if (API_KEY === "YOUR_DEEPSEEK_KEY_HERE") {
            alert("Please set your DeepSeek API Key in the script code!");
            return;
        }

        try {
            console.log("Sending to DeepSeek...");
            const response = await fetch('https://api.deepseek.com/chat/completions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: prompt }
                    ]
                })
            });

            const data = await response.json();
            const summary = data.choices?.[0]?.message?.content || 'No response text';
            console.log('DeepSeek Summary Received');
            console.log(summary)

            // ✅ Copy DeepSeek response to clipboard
            navigator.clipboard.writeText(summary)
                .then(() => console.log('DeepSeek summary copied to clipboard!'))
                .catch(err => console.error('Failed to copy summary:', err));
        } catch (error) {
            console.error('Error sending to DeepSeek:', error);
        }
    };

    const processTranscript = () => {
        const transcript = extractTranscript();
        if (!transcript) {
            console.warn('No transcript text found.');
            return;
        }

        const markdownPrompt = buildMarkdownPrompt(transcript);
        sendToDeepSeek(markdownPrompt);
    };

    // ✅ Show transcript if hidden, then extract
    let transcriptRenderer = document.querySelector('ytd-video-description-transcript-section-renderer');
    if (!transcriptRenderer || transcriptRenderer.offsetParent === null) {
        const bottomRow = document.getElementById("bottom-row");
        if (bottomRow) bottomRow.click();
        setTimeout(() => {
            transcriptRenderer = document.querySelector('ytd-video-description-transcript-section-renderer');
            if (transcriptRenderer) {
                const showTranscriptBtn = transcriptRenderer.querySelector('button[aria-label="Show transcript"]');
                if (showTranscriptBtn) {
                    showTranscriptBtn.click();
                    setTimeout(processTranscript, 1500); // Wait for transcript to load
                } else {
                    console.warn('Show transcript button not found.');
                }
            } else {
                console.warn('Transcript renderer not found after expanding.');
            }
        }, 1000);
    } else {
        const showTranscriptBtn = transcriptRenderer.querySelector('button[aria-label="Show transcript"]');
        if (showTranscriptBtn) {
            showTranscriptBtn.click();
            setTimeout(processTranscript, 1500);
        } else {
            processTranscript();
        }
    }
})();