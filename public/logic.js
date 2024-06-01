let socket = io()
const typeInput = document.getElementById('message')
const textInput = document.getElementById('messages')
const isTyping = document.getElementById('isTyping')
const nudgeContainer = document.querySelector('#window');
const nudgeButton = document.querySelector('#nudge-button');
const messageScroll = document.querySelector(".messageContainer")

const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.type = 'text/css';
linkElement.href = '.style.css'; // Substitua pelo caminho real do seu arquivo CSS externo

// Adiciona a tag link ao head do documento
document.head.appendChild(linkElement);

const { userName } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
socket.emit('new-user', userName)

window.onbeforeunload = function(e) {
  e.preventDefault();
}

function scrollDown(){
      messageScroll.scrollTop = messageScroll.scrollHeight;
    }



socket.on('message', incoming => {
    isTyping.innerText = ""
    const list = document.getElementById("messages")
    let listItem = document.createElement("li")
    let userNameColor = incoming.userName === userName ? '#0066ff' : '#000000'
    listItem.innerHTML = '<h6 style="color: ' + userNameColor + '">' + incoming.userName + " says: </h6>" + '<br/>' + '<h5 style="color: ' + userNameColor + '">' + incoming.message + '</h5>'
    list.appendChild(listItem)
    scrollDown()
})




var input = document.getElementById("message");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("sendBtn").click();
  }

});



socket.on('typing', incoming =>  {
    isTyping.innerText = incoming.userName + ' is typing a message ...';
})



typeInput.addEventListener('keypress', function() {
        socket.emit('typing', { userName, message });
})


var laudio = new Audio("assets/login.mp3");
socket.on('user-connected', userName => {
    const list = document.getElementById("messages")
    let pItem = document.createElement("p")
    pItem.innerText = userName + " joined the chat"
    list.appendChild(pItem)
    laudio.play()
    scrollDown()
})





socket.on('user-disconnected', userName => {
    const list = document.getElementById("messages")
    let pItem = document.createElement("p")
    pItem.innerText = userName + " left the chat"
    list.appendChild(pItem)
    naudio.play()
    scrollDown()
})


const mraudio = new Audio("assets/mrec.mp3");
function sendMessage() {
    const input = document.getElementById("message")
    const message = input.value
    input.value = ""
    socket.emit('message', { userName, message })
    mraudio.play();
    scrollDown()
}


function sendSmile() {
  const input = document.getElementById("message")
  const message = "😊"
  socket.emit('message', { userName, message })
  mraudio.play();
}

function sendFlirt() {
  const input = document.getElementById("message")
  const message = "😉"
  socket.emit('message', { userName, message })
  mraudio.play();
}

function sendLol() {
  const input = document.getElementById("message")
  const message = "😃"
  socket.emit('message', { userName, message })
  mraudio.play();
}

function sendSad() {
  const input = document.getElementById("message")
  const message = "🙁"
  socket.emit('message', { userName, message })
  mraudio.play();
}

function sendAngry() {
  const input = document.getElementById("message")
  const message = "😡"
  socket.emit('message', { userName, message })  
  mraudio.play();
}


var naudio = new Audio('assets/nudge.mp3');
nudgeButton.addEventListener('click', (e) => {
    e.preventDefault();
    socket.emit('nudge', userName )
    
    socket.on('nudge', userName => {
      const list = document.getElementById("messages")
      let h6Item = document.createElement("h6")
      h6Item.innerText = userName + " have just sent a nudge."
      naudio.play();
      list.appendChild(h6Item)
      nudgeContainer.classList.add('is-nudged');
      scrollDown()
      setTimeout(() => nudgeContainer.classList.remove('is-nudged'), 200)
})
})



function autocomplete(inp, arr) {
    
    var currentFocus;

    inp.addEventListener("input", function(e) {
        var autocompleteContainer, matchingElement, i, val = this.value;
        
        closeAllLists();
        if (!val) { return false;}
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
            
            matchingElement.addEventListener("click", function(e) {
                handleClick();
                closeAllLists();
            });
            autocompleteContainer.appendChild(matchingElement);
          }
        }
    });
    
    inp.addEventListener("keydown", function(e) {
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
  