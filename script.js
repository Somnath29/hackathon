// Create a new SpeechRecognition instance
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// Set language for recognition (optional)
recognition.lang = 'en-US';
recognition.continuous = false; // Stop after recognizing a single utterance
recognition.interimResults = false; // Do not show intermediate results while speaking

// Event listener for when speech recognition produces results
recognition.onresult = function(event) {
    // Get the recognized speech (transcript)
    const transcript = event.results[0][0].transcript;

    // Set the input field value with the recognized speech
    document.getElementById('user-input').value = transcript;
};

// Start voice input when the button is clicked
function startVoiceInput() {
    recognition.start();
}

// Optional: Handle when recognition ends
recognition.onend = function() {
    console.log('Speech recognition has ended.');
};

// Optional: Handle any errors
recognition.onerror = function(event) {
    console.error('Error occurred in recognition: ', event.error);
};

// Optional: Handle key press events (if needed for further functionality)
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        console.log('Enter key pressed: ' + document.getElementById('user-input').value);
    }
}
//the above part is for speech recognition.
document.addEventListener("DOMContentLoaded", () => {
    addMessage("bot", "Hello! I'm here to check in on you. How are you feeling today?");
    loadConversation();
    setupQuickReplies();
});
document.addEventListener("DOMContentLoaded", () => {
    // Dark Mode Toggle
    const themeSwitch = document.getElementById("theme-switch");

    // Load saved theme preference
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
        themeSwitch.checked = true;
    }

    // Toggle dark mode on switch change
    themeSwitch.addEventListener("change", function () {
        document.body.classList.toggle("dark", this.checked);
        localStorage.setItem("darkMode", this.checked);
    });

    // Existing chatbot initialization
    addMessage("bot", "Hello! I'm here to check in on you. How are you feeling today?");
    loadConversation();
    setupQuickReplies();
});


// Send User Message
function sendMessage() {
    const userInput = document.getElementById("user-input");
    const message = userInput.value.trim();

    if (message === "") return;

    addMessage("user", message);
    saveConversation("user", message);
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        respondToUser(message);
    }, 1000);

    userInput.value = "";
}

// Add Message to Chat Box
function addMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    messageDiv.textContent = text;

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing Indicator
function showTypingIndicator() {
    const chatBox = document.getElementById("chat-box");
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message", "typing-indicator");
    typingDiv.innerHTML = "Typing...";

    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector(".typing-indicator");
    if (typingIndicator) typingIndicator.remove();
}

// Respond to User Input
function respondToUser(userMessage) {
    const response = analyzeMood(userMessage);
    addMessage("bot", response.message);
    saveConversation("bot", response.message);

    if (response.selfCareTip) {
        setTimeout(() => {
            addMessage("bot", response.selfCareTip);
            saveConversation("bot", response.selfCareTip);
        }, 1000);
    }

    setupQuickReplies(); // Update quick replies after response
}

// Mood Analysis and Responses
function analyzeMood(response) {
    response = response.toLowerCase();

    let message = '';
    let selfCareTip = '';

    if (response.includes("not feeling good") || response.includes("not happy") || response.includes("feeling bad")) {
        message = "I'm sorry you're feeling this way. It's okay to have tough days. Maybe talking to a friend or practicing self-care can help.";
        selfCareTip = 'Remember to take breaks and do something you enjoy, like reading a book or taking a walk.';
    } else if (response.includes("not great") || response.includes("not okay") || response.includes("not well")) {
        message = "I'm here for you. Try taking a break, listening to music, or doing something you enjoy.";
        selfCareTip = 'Consider practicing deep breathing exercises or meditation to relax.';
    } else if (/(happy|good|great|joyful|excited)/.test(response) && !/(not happy|not good)/.test(response)) {
        message = "That's wonderful! Keep up the positivity. Maybe treat yourself to something nice today!";
        selfCareTip = 'Celebrate your happiness by doing something you love, like a hobby or spending time with loved ones.';
    } else if (/(sad|down|unhappy|depressed)/.test(response)) {
        message = "I'm sorry to hear that. You're not alone. Try listening to your favorite music or reaching out to someone you trust.";
        selfCareTip = 'Write down your thoughts and feelings in a journal to help process your emotions.';
    } else if (/(stressed|overwhelmed|anxious|worried)/.test(response)) {
        message = "It sounds like you’re under a lot of pressure. Deep breathing, a short walk, or mindfulness exercises might help.";
        selfCareTip = 'Try this: Inhale deeply through your nose for 4 seconds, hold for 7 seconds, and exhale slowly through your mouth for 8 seconds.';
    } else if (/(angry|frustrated|annoyed|irritated)/.test(response)) {
        message = "I understand that things can be frustrating. Maybe try relaxation exercises, journaling, or talking it out with someone.";
        selfCareTip = 'Physical activity like a quick workout or stretching can help release built-up tension.';
    } else if (/(tired|exhausted|burned out|drained)/.test(response)) {
        message = "Rest is important! Make sure to take breaks, stay hydrated, and get enough sleep.";
        selfCareTip = 'Establish a relaxing bedtime routine to improve sleep quality, like dimming the lights and avoiding screens before bed.';
    } else {
        message = "I appreciate you sharing that. Remember, self-care is important. Would you like a self-care tip?";
        selfCareTip = 'Taking short breaks during work or study sessions can help improve focus and productivity.';
    }

    return { message, selfCareTip };
}

// Save Conversation to Local Storage
function saveConversation(sender, message) {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ sender, message });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Load Previous Conversation
function loadConversation() {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(entry => {
        addMessage(entry.sender, entry.message);
    });
}

// Quick Reply Buttons
function setupQuickReplies() {
    const quickRepliesContainer = document.getElementById("quick-replies");
    quickRepliesContainer.innerHTML = '';

    const replies = ["I'm feeling good!", "I'm a bit stressed.", "I'm tired.", "Any self-care tips?"];

    replies.forEach(reply => {
        const button = document.createElement("button");
        button.textContent = reply;
        button.addEventListener("click", () => sendQuickReply(reply));
        quickRepliesContainer.appendChild(button);
    });
}

// Send Quick Reply
function sendQuickReply(reply) {
    addMessage("user", reply);
    saveConversation("user", reply);
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        respondToUser(reply);
    }, 1000);
}

// Self-Care Tips Button
document.getElementById("self-care-btn").addEventListener("click", () => {
    addMessage("user", "I need a self-care tip.");
    saveConversation("user", "I need a self-care tip.");
    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();
        respondToUser("I need a self-care tip.");
    }, 1000);
});

// Theme Toggle
document.getElementById("theme-toggle").addEventListener("change", function() {
    document.body.classList.toggle("dark", this.checked);
    localStorage.setItem("darkMode", this.checked);
});


// Load Theme Preference
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    document.getElementById("theme-switch").checked = true;
}
