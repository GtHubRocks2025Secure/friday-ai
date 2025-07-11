const talkButton = document.getElementById("talk-button");
const responseDiv = document.getElementById("response");

// Create text input field
const inputBox = document.createElement("input");
inputBox.setAttribute("type", "text");
inputBox.setAttribute("placeholder", "Type your question here...");
inputBox.style.marginTop = "15px";
inputBox.style.padding = "10px";
inputBox.style.width = "80%";
inputBox.style.fontSize = "16px";
document.querySelector(".hologram").appendChild(inputBox);

const synth = window.speechSynthesis;

// Disable voice input (not supported on Quest)
talkButton.disabled = true;
talkButton.innerText = "Voice input disabled on Quest";

// Handle text input instead
inputBox.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    const userInput = inputBox.value;
    inputBox.value = "";

    responseDiv.innerText = "You: " + userInput;

    const reply = await askFriday(userInput);
    console.log("ChatGPT replied:", reply);

    responseDiv.innerText += "\n\nFriday: " + reply;
    speak(reply); // TTS (works only on PC/phone)
  }
});

function speak(text) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    synth.speak(utterance);
  } catch (e) {
    console.error("TTS error:", e);
  }
}

async function askFriday(question) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "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",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    console.log("API response:", data);

    if (data.error) {
      console.error("OpenAI error:", data.error.message);
      return "OpenAI Error: " + data.error.message;
    }

    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      return "Sorry boss, I didn’t get that.";
    }
  } catch (error) {
    console.error("API fetch error:", error);
    return "There was an error talking to OpenAI.";
  }
}
