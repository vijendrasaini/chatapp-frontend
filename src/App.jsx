import './chat.css'
import { io } from 'socket.io-client'
import { useState } from 'react'
// const socket = io('http://localhost:7000')
const socket = io('https://ervijuchat.herokuapp.com')
const joined_user = prompt('Enter your name')
socket.emit('new-user-joined', joined_user)
function App() {
  const [message, setMessage] = useState("")
  const [chats, setchats] = useState([])
  const [users, setUsers] = useState([])
  const sendMessage = (e) => {
    e.preventDefault()
    socket.emit('send', message)
    setMessage('')
    setchats([...chats, { position: "right", message: message, user: "you" }])
  }
  socket.on('receive', ({ user, message }) => {
    setchats([...chats, { position: "left", message: message, user: user }])
  })
  socket.on('user-joined', (user) => {
    setchats([...chats, { position: "mid", message: `${user} JOINED` }])
  })
  socket.on('allusers', (users) => {
    setUsers(users)
  })
  // socket.on('get-typing',(user)=>{

  // })  

  return (
    <div className="App">
      <h1 className='title'>ERchat</h1>
      <div className='container'>
        <div className='chatsContainer'>
          {chats.map(({ position, user, message }, index) => {
            if (position == 'left')
              return <p key={index} className='left message'>{user} : {message}</p>
            else if (position == 'right')
              return <p key={index} className='right message'>{user} : {message}</p>
            else
              return <h5 key={index} className='mid message'>{message}</h5>
          })}
        {/* <p key={index} className='left message typing'>{user} : ...typing</p> */}
        </div>
        <form >
          <input onChange={(e) => {
            socket.emit('typing')
            setMessage(e.target.value)
          }} type="text" value={message} />
          <button type='submit' onClick={sendMessage}>send</button>
        </form>
      </div>
    </div>
  )
}

export default App