const talkButton = document.getElementById("talk-button");
const responseDiv = document.getElementById("response");

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";

talkButton.onclick = () => {
  responseDiv.innerText = "Listening...";
  recognition.start();
};

recognition.onresult = async (event) => {
  const userInput = event.results[0][0].transcript;
  responseDiv.innerText = "You: " + userInput;

  const reply = await askFriday(userInput);
  responseDiv.innerText += "\n\nFriday: " + reply;
  speak(reply);
};

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  synth.speak(utterance);
}

async function askFriday(question) {
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
  return data.choices[0].message.content;
}
