import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';

import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState({
    name: '',
    code: '',
    active: false
  })
  

  useEffect(() => {
    const newSocket = io(`https://temporal-chat.herokuapp.com`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);


  const handleNewRoom = () => {
    const name = document.getElementById('name').value.trim() !== '' ? document.getElementById('name').value  : 'anonymous'
    
    setData({
      ...data,
      name
    })

    socket.emit('newRoom',{
      type: 'new',
      name
    })

    activeSocket();
  }

  const joinCode = () => {
    const name = document.getElementById('name').value.trim() !== '' ? document.getElementById('name').value  : 'anonymous'

    setData({
      ...data,
      name
    })
    
    const code = document.getElementById('code').value;

    socket.emit('joinCode', {
      name,
      code
    })

    activeSocket();

  }

  const activeSocket = ()=> {
    socket.on('join',(code) => {
      setData({
        ...data,
        code,
        active: true
      })
    });
  }

  return (
    <>
    {
      data.active ? (
        <div className="App">
          <header className="app-header">
            Código de sala: {data.code}
          </header>
        { socket ? (
          <div className="chat-container">
            <Messages socket={socket} />
            <MessageInput socket={socket} />
          </div>
          ) : (
            <div>Not Connected</div>
          )}
      </div>
      )
      :(
      <div>
        <input type='text' placeholder='nombre de usuario' id='name'/>
        <button onClick={handleNewRoom}> Create Room </button>
        <input type='number' placeholder='código de sala' id='code'/>
        <button onClick={joinCode}> Unirse a sala </button>
      </div>) 
    }
    </>
    
    
  );
}

export default App;