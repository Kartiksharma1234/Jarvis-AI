// select elements
const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

// speak helper
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1;
  u.volume = 1;
  u.pitch = 1;
  window.speechSynthesis.speak(u);
}

// greet user on load
function wishMe() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 12) speak("Good Morning Boss...");
  else if (hour >= 12 && hour < 17) speak("Good Afternoon Master...");
  else speak("Good Evening Sir...");
}

window.addEventListener('load', () => {
  speak("Initializing JARVIS...");
  wishMe();
});

// Speech Recognition setup (with vendor fallback)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = navigator.language || 'en-US';

  recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
  };

  recognition.onerror = (err) => {
    console.error('Recognition error:', err);
    content.textContent = "Recognition error: " + (err.error || err.message || "unknown");
  };

  recognition.onend = () => {
    // you can auto-restart recognition here if you want continuous listening
  };
} else {
  // Not supported
  content.textContent = "SpeechRecognition not supported in this browser.";
  console.warn("SpeechRecognition API not available.");
}

// Start listening on click
btn.addEventListener('click', () => {
  if (!recognition) {
    speak("Sorry, your browser does not support speech recognition. Please try Chrome.");
    return;
  }
  content.textContent = "Listening...";
  try {
    recognition.start();
  } catch (e) {
    console.warn("recognition.start() error", e);
  }
});

// command handler
function takeCommand(message) {
  if (!message) return;
  if (message.includes('hey') || message.includes('hello')) {
    speak("Hello Sir, How May I Help You?");
  } else if (message.includes("open google")) {
    window.open("https://google.com", "_blank");
    speak("Opening Google...");
  } else if (message.includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    speak("Opening Youtube...");
  } else if (message.includes("open facebook")) {
    window.open("https://facebook.com", "_blank");
    speak("Opening Facebook...");
  } else if (message.includes('wikipedia')) {
    const q = message.replace("wikipedia", "").trim();
    window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(q)}`, "_blank");
    speak("This is what I found on Wikipedia regarding " + q);
  } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
    speak("This is what I found on the internet regarding " + message);
  } else if (message.includes('time')) {
    const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
    speak("The current time is " + time);
  } else if (message.includes('date')) {
    const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
    speak("Today's date is " + date);
  } else {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
    speak("I found some information for " + message + " on Google");
  }
}