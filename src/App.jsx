import './chat.css'
import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'
import { EmojiPicker, Emoji } from "react-emoji-search";




const socket = io('https://ervijuchat.herokuapp.com')
const joined_user = prompt('Enter your name')
console.log({joined_user})
socket.emit('new-user-joined', joined_user)



function App() {
  const [message, setMessage] = useState("")
  const [chats, setchats] = useState([])
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


  const messageEl = useRef(null)
  useEffect(()=>{
    if(messageEl){
      messageEl.current.addEventListener('DOMNodeInserted', event=>{
        const { currentTarget : target} = event
        target.scroll({ top : target.scrollHeight, behaviour : 'smooth'})
      })
    }
  })
  return (
    <div className="App">
      <h1 className='title'>ERchat</h1>
      <div className='container'>
      <div className='useralign'>
      <span className='user'>You have joined as {joined_user}</span>
      </div>
        <div className='chatsContainer' ref={messageEl}>
          {chats.map(({ position, user, message }, index) => {
            if (position == 'left')
              return <p key={index} className='left message'><span className='username'>{user}</span> : {message}</p>
            else if (position == 'right')
              return <p key={index} className='right message'><span className='username'>{user}</span> : {message}</p>
            else
              return <h5 key={index} className='mid message'>{message}</h5>
          })}
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