let currentUserId = 'User 1'
let userNames = ['Tihana', 'Ivan', 'Marija', 'Nataša', 'Tomislav', 'Ana', 'Joža', 'Blaž']
let userAssignedNames = {}

const userButtons = document.getElementsByClassName('user-btn')
for (let i = 0; i < userButtons.length; i++) {
  let userId = userButtons[i].textContent
  if (!userAssignedNames[userId]) {
    let randomIndex = Math.floor(Math.random() * userNames.length)
    userAssignedNames[userId] = userNames[randomIndex]
    userNames.splice(randomIndex, 1)
  }
  userButtons[i].addEventListener('click', () => {
    currentUserId = userId
  })
}

const drone = new Scaledrone('df9hpqpg1hAkmBWV')
const messages = document.getElementById('messages')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

drone.on('open', error => {
  if (error) {
    return console.error(error)
  }
  console.log('Connected to Scaledrone')
})

const room = drone.subscribe('observable-room')

room.on('open', error => {
  if (error) {
    return console.error(error)
  }
  console.log('Connected to room')
})

room.on('data', (data, member) => {
  const messageData = JSON.parse(data)
  const messageElement = document.createElement('div')

  const textElement = document.createElement('span')
  textElement.textContent = messageData.text
  messageElement.appendChild(textElement)

  const timeElement = document.createElement('span')
  timeElement.style.fontSize = '0.6em'
  timeElement.style.marginLeft = '20px'
  timeElement.textContent = '(' + new Date(messageData.time).toLocaleTimeString() + ')'
  messageElement.appendChild(timeElement)

  messages.appendChild(messageElement)
  messages.scrollTop = messages.scrollHeight
})

messageForm.addEventListener('submit', event => {
  event.preventDefault()
  const message = {
    text: userAssignedNames[currentUserId] + ': ' + messageInput.value,
    time: Date.now(),
  }
  drone.publish({
    room: 'observable-room',
    message: JSON.stringify(message),
  })
  messageInput.value = ''
})
