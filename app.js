const talkButton = document.getElementById("talk-button");
const responseDiv = document.getElementById("response");

// Create text input as backup
const inputBox = document.createElement("input");
inputBox.setAttribute("type", "text");
inputBox.setAttribute("placeholder", "Or type your message...");
inputBox.style.marginTop = "15px";
inputBox.style.padding = "10px";
inputBox.style.width = "80%";
inputBox.style.fontSize = "16px";
document.querySelector(".hologram").appendChild(inputBox);

const synth = window.speechSynthesis;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
  recognition.lang = "en-US";

  talkButton.onclick = () => {
    responseDiv.innerText = "Listening...";
    recognition.start();
  };

  recognition.onresult = async (event) => {
    const userInput = event.results[0][0].transcript;
    console.log("You said:", userInput);
    responseDiv.innerText = "You: " + userInput;

    const reply = await askFriday(userInput);
    console.log("ChatGPT replied:", reply);
    responseDiv.innerText += "\n\nFriday: " + reply;
    speak(reply);
  };

  recognition.onerror = (e) => {
    console.error("Mic error:", e.error);
    responseDiv.innerText = "Mic not supported or blocked. Try typing instead.";
  };
} else {
  talkButton.disabled = true;
  talkButton.innerText = "Mic not supported";
  responseDiv.innerText = "Your browser doesn't support voice input. Type instead.";
}

// Text input fallback
inputBox.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    const userInput = inputBox.value;
    inputBox.value = "";
    responseDiv.innerText = "You: " + userInput;

    const reply = await askFriday(userInput);
    console.log("ChatGPT replied:", reply);
    responseDiv.innerText += "\n\nFriday: " + reply;
    speak(reply);
  }
});

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  synth.speak(utterance);
}

async function askFriday(question) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "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", // Replace with your actual key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    console.log("API response:", data);

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      return "Sorry boss, I didn’t get that.";
    }
  } catch (error) {
    console.error("API error:", error);
    return "There was an error talking to OpenAI.";
  }
}
