import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

///////////////////////////
// CREATING A LOADER
///////////////////////////
let loadInterval;
function loader(element){
  element.textContent = ' ';
  loadInterval = setInterval(()=>{
    element.textContent += '.';
    if(element.textContent === ' ....'){  //WHEN REACED 4 DOTS MAKE 1
      element.textContent = ' ';
    }
  },300)
}

//////////////////////////////////////////
// LINE BY LINE TEXT PRINTING ANIMATION
//////////////////////////////////////////
function typeText(element,text){
  let index = 0;
  let interval = setInterval(()=>{
    if(index <  text.length){
      element.innerHTML += text.charAt(index)
      index++
      element.scrollIntoView()
    }
    else{
       clearInterval(interval)
    }
  },20)
}

//////////////////////////////////////////////
// GENERATE RANDOM UNIQUE IDs FOR EACH ANSWER
/////////////////////////////////////////////
function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`
}

////////////////////////
// Each Conversation
////////////////////////
function chatStripe(isAI, value, uniqueId){
  return(
    `
      <div class="wrapper ${isAI && 'ai'}">
        <div class='chat'>
          <div className='profile'>
            <img
              src="${isAI ? bot : user}"
              alt="${isAI ? bot : user}"
            />
          </div>
          <div class='message' id=${uniqueId}>${value}</div>
        </div>
      </div>
    `
  )
}


const handleSubmit = async(e)=>{
  e.preventDefault();
  const data = new FormData(form);
  
  // User's chatStripe
  chatContainer.innerHTML += chatStripe(false,data.get('prompt'),generateUniqueId());
  
  form.reset()    // Clear the Text Area Input

  // AI's ChatStripe
  const uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true," ",uniqueId)
  chatContainer.scrollTop = chatContainer.scrollHeight;  // This will create the new message in view
  const messageDiv = document.getElementById(uniqueId)
  loader(messageDiv)
  
  const response = await fetch('https://chatgpt-clone-im2g.onrender.com/',{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })
  
  clearInterval(loadInterval)
  messageDiv.innerHTMl = '';
  
  if(response.ok){
    const data = await response.json();
    const parseData = data.bot.trim();
    typeText(messageDiv, parseData);
  }
  else{
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong..."
  }
}

//////////////////////
// EVENT LISTENERS
/////////////////////
form.addEventListener('submit',handleSubmit)
form.addEventListener('keyup',(e)=>{
  if(e.keyCode === 13) handleSubmit(e)
})