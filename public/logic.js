let socket = io();
const typeInput = document.getElementById('message');
const textInput = document.getElementById('messages');
const isTyping = document.getElementById('isTyping');
const jokeButton = document.querySelector(".getJokeBtn");
const nudgeContainer = document.querySelector('#window');
const nudgeButton = document.querySelector('#nudge-button');
const messageScroll = document.querySelector(".messageContainer");

const { userName } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
socket.emit('new-user', userName);

window.onbeforeunload = function (e) {
  e.preventDefault();
};

function scrollDown() {
  messageScroll.scrollTop = messageScroll.scrollHeight;
}

socket.on('message', async incoming => {
  isTyping.innerText = "";
  const list = document.getElementById("messages");
  let listItem = document.createElement("li");
  let messageAlignment = incoming.userName === userName ? 'user' : 'other';
  listItem.classList.add('message', messageAlignment);
  listItem.innerHTML = '<h6>' + incoming.userName + " says: </h6>" + '<p>' + incoming.message + '</p>';
  list.appendChild(listItem);

  const cepInfo = await getCEPInfo(incoming.message);
  if (cepInfo) {
    // Criar um novo item na lista com as informações do endereço
    let cepInfoItem = document.createElement("li");
    cepInfoItem.innerHTML = `<h5>Informações do endereço:</h5><p>Logradouro: ${cepInfo.logradouro}</p><p>Bairro: ${cepInfo.bairro}</p><p>Cidade: ${cepInfo.localidade}</p><p>Estado: ${cepInfo.uf}</p>`;
    list.appendChild(cepInfoItem);
  }
  
  if (incoming.message.toLowerCase() === "imagem gato") {
    const catImage = await getCatImage();
    let imageItem = document.createElement("li");
    imageItem.innerHTML = `<img style="width: 250px; height: 250px;" src="${catImage}" alt="Cat Image" />`;
    list.appendChild(imageItem);
  }

  if (incoming.message.toLowerCase().includes("piada")) {
    const joke = await getJoke();
    let jokeItem = document.createElement("li");
    jokeItem.innerHTML = `<h5>${joke}</h5>`;
    list.appendChild(jokeItem);
  }

  if (incoming.message.toLowerCase().includes("imagem cachorro")) {
    const dogImage = await getDogImage();
    let imageItemDog = document.createElement("li");
    imageItemDog.innerHTML = `<img style="width: 250px; height: 250px;" src="${dogImage}" alt="Dog Image" />`;
    list.appendChild(imageItemDog);
  }

  if (incoming.message.toLowerCase().startsWith("chatgpt")) {
    const chatgptResponse = await postChatGpt(incoming.message);
    let chatGptConsulta = document.createElement("li");
    chatGptConsulta.innerHTML = `<h5>${chatgptResponse}</h5>`;
    list.appendChild(chatGptConsulta);
  }

  if (incoming.message.toLowerCase().includes("cep")) {
    const viaCep = await getCEPInfo();
    let cepViaCep = document.createElement("li");
    cepViaCep.innerHTML = `<p> ${viaCep}</p>`;
    list.appendChild(cepViaCep);
    
  }

  scrollDown();
});

async function getCatImage() {
  const response = await fetch('https://8bfeb23f-c3ec-4314-9deb-0ac1f7b4e0f0-00-1lpf73kobfx7j.kirk.replit.dev/cat');
  const data = await response.json();
  return data.imageUrl;
}

async function getJoke() {
  const response = await fetch('https://8bfeb23f-c3ec-4314-9deb-0ac1f7b4e0f0-00-1lpf73kobfx7j.kirk.replit.dev:3000/teste1');
  const data = await response.json();
  return data.joke;
}

async function getCEPInfo(message) {
  // Expressão regular para encontrar um CEP no formato "00000-000"
  const cepRegex = /\b\d{5}-?\d{3}\b/;
  // Extrair o CEP da mensagem
  const cepMatch = message.match(cepRegex);
  // Verificar se um CEP foi encontrado na mensagem
  if (cepMatch) {
    const cep = cepMatch[0]; // Pegar o primeiro CEP encontrado
    try {
      // Enviar uma requisição para a sua API local para obter as informações do endereço com base no CEP
      const response = await fetch(`https://0c3644ad-f153-42a8-91f9-e9f8ed9ccb2f-00-1kqn5sle2hll5.picard.replit.dev/endereco/${cep}`);
      const data = await response.json();
      // Retornar as informações do endereço
      return data;
    } catch (error) {
      console.error('Erro ao obter informações do CEP:', error);
      return null;
    }
  } else {
    return null; // Se nenhum CEP for encontrado na mensagem, retornar null
  }
}

async function getDogImage() {
  const response = await fetch('https://dog.ceo/api/breeds/image/random');
  const data = await response.json();
  return data.message;
}

async function postChatGpt(userMessage) {
  const response = await fetch('https://8bfeb23f-c3ec-4314-9deb-0ac1f7b4e0f0-00-1lpf73kobfx7j.kirk.replit.dev:3003/testechatgpt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: userMessage }),
  });
  const data = await response.json();
  return data.message;
}

var input = document.getElementById("message");
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("sendBtn").click();
  }
});

socket.on('typing', incoming => {
  isTyping.innerText = incoming.userName + ' está digitando ...';
});

typeInput.addEventListener('keypress', function () {
  socket.emit('typing', { userName });
});

var laudio = new Audio("assets/login.mp3");
socket.on('user-connected', userName => {
  const list = document.getElementById("messages");
  let pItem = document.createElement("p");
  pItem.innerText = userName + " entrou no chat";
  list.appendChild(pItem);
  laudio.play();
  scrollDown();
});

socket.on('user-disconnected', userName => {
  const list = document.getElementById("messages");
  let pItem = document.createElement("p");
  pItem.innerText = userName + " saiu do chat";
  list.appendChild(pItem);
  naudio.play();
  scrollDown();
});

const mraudio = new Audio("assets/mrec.mp3");
function sendMessage() {
  const input = document.getElementById("message");
  const message = input.value.trim();
  if (message === "") {
    alert("A mensagem não pode estar vazia ou conter apenas espaços em branco.");
    return;
  }
  socket.emit('message', { userName, message });
  input.value = "";
  mraudio.play();
  scrollDown();
}

function sendSmile() {
  const input = document.getElementById("message");
  const message = "😊";
  socket.emit('message', { userName, message });
  mraudio.play();
}

function sendFlirt() {
  const input = document.getElementById("message");
  const message = "😉";
  socket.emit('message', { userName, message });
  mraudio.play();
}

function sendLol() {
  const input = document.getElementById("message");
  const message = "😃";
  socket.emit('message', { userName, message });
  mraudio.play();
}

function sendSad() {
  const input = document.getElementById("message");
  const message = "🙁";
  socket.emit('message', { userName, message });
  mraudio.play();
}

function sendAngry() {
  const input = document.getElementById("message");
  const message = "😡";
  socket.emit('message', { userName, message });
  mraudio.play();
}

function sendStranger() {
  const input = document.getElementById("message");
  const message = "😖";
  socket.emit('message', { userName, message });
  mraudio.play();
}

var naudio = new Audio('assets/nudge.mp3');
nudgeButton.addEventListener('click', (e) => {
  e.preventDefault();
  socket.emit('nudge', userName);

  socket.on('nudge', userName => {
    const list = document.getElementById("messages");
    let h6Item = document.createElement("h6");
    h6Item.innerText = userName + " acabei de enviar um lembrete.";
    naudio.play();
    list.appendChild(h6Item);
    nudgeContainer.classList.add('is-nudged');
    scrollDown();
    setTimeout(() => nudgeContainer.classList.remove('is-nudged'), 200);
  });
});

function autocomplete(inp, arr) {
  var currentFocus;

  inp.addEventListener("input", function (e) {
    var autocompleteContainer, matchingElement, i, val = this.value;

    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;

    autocompleteContainer = document.createElement("div");
    autocompleteContainer.setAttribute("id", this.id + "autocomplete-list");
    autocompleteContainer.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(autocompleteContainer);

    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        matchingElement = document.createElement("div");

        matchingElement.innerHTML += arr[i].substr(val.length);
        matchingElement.innerHTML += "<input type='hidden' value='" + "1" + arr[i] + "'>";

        matchingElement.addEventListener("click", function (e) {
          handleClick();
          closeAllLists();
        });
        autocompleteContainer.appendChild(matchingElement);
      }
    }
  });

  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
  });

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
}

var jokeArray = ["/ 🤡"];
autocomplete(document.getElementById("message"), jokeArray);
