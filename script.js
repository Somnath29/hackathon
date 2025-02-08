// Open Mood Tracker Modal
document.getElementById("mood-tracker-btn").addEventListener("click", () => {
    document.getElementById("mood-modal").style.display = "flex";
    loadMoodHistory();
});

// Close Mood Tracker Modal
function closeMoodTracker() {
    document.getElementById("mood-modal").style.display = "none";
}

// Save Mood Entry
function saveMood() {
    const mood = document.getElementById("mood-select").value;
    const date = new Date().toLocaleDateString();

    let moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    moodHistory.push({ date, mood });
    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

    alert("Mood saved successfully!");
    loadMoodHistory();
}

// Load Mood History
function loadMoodHistory() {
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const moodList = document.getElementById("mood-history");
    moodList.innerHTML = "";

    moodHistory.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.textContent = `${entry.date}: ${entry.mood}`;
        moodList.appendChild(listItem);
    });
}






// Open Login Modal
function openLogin() {
    document.getElementById("login-modal").style.display = "flex";
}

// Close Login Modal
function closeLogin() {
    document.getElementById("login-modal").style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById("login-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


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

// enter key working
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevents accidental form submission
        sendMessage();
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
document.getElementById("new-chat-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to start a new chat? This will clear your conversation history.")) {
        localStorage.removeItem("chatHistory"); // Remove saved chat history
        document.getElementById("chat-box").innerHTML = ""; // Clear the chat box
        addMessage("bot", "Hello! I'm here to check in on you. How are you feeling today?"); // Restart chat
    }
});

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

// Updated Respond to User Function
function respondToUser(userMessage) {
    const response = analyzeMood(userMessage);
    addMessage("bot", response.message, response.imageUrl);
    saveConversation("bot", response.message);

    if (response.selfCareTip) {
        setTimeout(() => {
            addMessage("bot", response.selfCareTip);
            saveConversation("bot", response.selfCareTip);
        }, 1000);
    }

    setupQuickReplies(); // Update quick replies after response
}


// Mood Analysis and Responses with Image/GIF Support
function analyzeMood(response) {
    response = response.toLowerCase();

    let message = '';
    let selfCareTip = '';
    let imageUrl = ''; // New: Image/GIF URL

    if (response.includes("not feeling good") || response.includes("not happy") || response.includes("feeling bad")) {
        message = "I'm sorry you're feeling this way. It's okay to have tough days. Maybe talking to a friend or practicing self-care can help.";
        selfCareTip = 'Remember to take breaks and do something you enjoy, like reading a book or taking a walk.';
        imageUrl = "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif"; // Sad GIF
    } else if (response.includes("not great") || response.includes("not okay") || response.includes("not well")) {
        message = "I'm here for you. Try taking a break, listening to music, or doing something you enjoy.";
        selfCareTip = 'Consider practicing deep breathing exercises or meditation to relax.';
        imageUrl = "https://media.giphy.com/media/l1J9u3TZfpmeDLkDq/giphy.gif"; // Relaxing GIF
    } else if (/(happy|good|great|joyful|excited)/.test(response) && !/(not happy|not good)/.test(response)) {
        message = "That's wonderful! Keep up the positivity. Maybe treat yourself to something nice today!";
        selfCareTip = 'Celebrate your happiness by doing something you love, like a hobby or spending time with loved ones.';
        imageUrl = "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif"; // Happy GIF
    } else if (/(sad|down|unhappy|depressed)/.test(response)) {
        message = "I'm sorry to hear that. You're not alone. Try listening to your favorite music or reaching out to someone you trust.";
        selfCareTip = 'Write down your thoughts and feelings in a journal to help process your emotions.';
        imageUrl = "https://media.giphy.com/media/Z5zuypybI5dYc/giphy.gif"; // Comforting GIF
    } else if (/(stressed|overwhelmed|anxious|worried)/.test(response)) {
        message = "It sounds like you’re under a lot of pressure. Deep breathing, a short walk, or mindfulness exercises might help.";
        selfCareTip = 'Try this: Inhale deeply through your nose for 4 seconds, hold for 7 seconds, and exhale slowly through your mouth for 8 seconds.';
        imageUrl = "https://media.giphy.com/media/QBd2kLB5qDmysEXre9/giphy.gif"; // Stress relief GIF
    } else if (/(angry|frustrated|annoyed|irritated)/.test(response)) {
        message = "I understand that things can be frustrating. Maybe try relaxation exercises, journaling, or talking it out with someone.";
        selfCareTip = 'Physical activity like a quick workout or stretching can help release built-up tension.';
        imageUrl = "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif"; // Angry GIF
    } else if (/(tired|exhausted|burned out|drained)/.test(response)) {
        message = "Rest is important! Make sure to take breaks, stay hydrated, and get enough sleep.";
        selfCareTip = 'Establish a relaxing bedtime routine to improve sleep quality, like dimming the lights and avoiding screens before bed.';
        imageUrl = "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif"; // Sleepy GIF
    } else {
        message = "I appreciate you sharing that. Remember, self-care is important. Would you like a self-care tip?";
        selfCareTip = 'Taking short breaks during work or study sessions can help improve focus and productivity.';
        imageUrl = "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif"; // General Self-Care GIF
    }

    return { message, selfCareTip, imageUrl };
}

// Updated Respond to User Function
function respondToUser(userMessage) {
    const response = analyzeMood(userMessage);
    addMessage("bot", response.message, response.imageUrl);
    saveConversation("bot", response.message);

    if (response.selfCareTip) {
        setTimeout(() => {
            addMessage("bot", response.selfCareTip);
            saveConversation("bot", response.selfCareTip);
        }, 1000);
    }

    setupQuickReplies(); // Update quick replies after response
}


// Updated Add Message Function to Support Images/GIFs
function addMessage(sender, text, imageUrl = "") {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    messageDiv.textContent = text;

    chatBox.appendChild(messageDiv);

    // If there's an image, add it to the chat
    if (imageUrl) {
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = "Mood Image";
        img.style.maxWidth = "200px"; // Adjust image size
        img.style.borderRadius = "10px"; // Add rounded corners
        img.style.marginTop = "5px";

        chatBox.appendChild(img);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
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
