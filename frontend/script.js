const ws = new WebSocket("ws://localhost:3000");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const form = document.getElementById("new-message-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("message-list");

let userName = "";

window.onload = (event) => {
  nameForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (nameInput.value) {
      userName = nameInput.value.trim();
      nameInput.disabled = true;
      console.log("Username set:", userName);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
      if (input.value && userName) {
        const data = { type: "send-message", content: input.value, user: userName };
      ws.send(JSON.stringify(data));
      input.value = "";
    }
  });
  
  ws.onopen = (event) => {
    ws.onmessage = function (event) {
        const item = document.createElement("li");
        const message = JSON.parse(event.data);
        console.log(JSON.parse(event.data));
      item.textContent = message.user + ": " + message.content;
      messages.appendChild(item);
    };
  };
};
