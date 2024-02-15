import React, { useState, useEffect, useRef } from 'react';
import './chat.css';
import Picture from '../../images/profilepic.jpg';
import { FaFaceSmile } from 'react-icons/fa6';
import { FiSend } from 'react-icons/fi';
import Picker from 'emoji-picker-react';
import { MdOutlineOpenInNew } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';
import Contact from '../../pages/Chat/Contact';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { AiOutlinePaperClip } from "react-icons/ai";
import { uniqBy } from "lodash";


const Chat = () => {
  const [isProfile, setIsProfile] = useState(false);
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  let [selectedUsername, setSelectedUsername] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const profile = useSelector((state) => state.profile);
  const [messages, setMessages] = useState([]);
  const divUnderMessages = useRef();
  const [cookie, setCookie] = useCookies('token');



  const handleChatbox = (activity, username) => { 
    console.log('username handlechatbox',username)
    setIsProfile(activity);
    setSelectedUsername(username);
  };




  const [inputStr, setInputStr] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const onEmojiClick = (event, emojiObject) => {
    setInputStr(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };



  useEffect(() => {
    connectToWs();
  }, [selectedUserId]);

  const connectToWs = () => {
    const ws = new WebSocket('ws://localhost:5000');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    // ws.addEventListener('close', () => {
    //   setTimeout(() => {
    //     console.log('Disconnected. Trying to reconnect.');
    //     connectToWs();
    //   }, 1000);
    // });
  }

  const disconnectFromWs = () => {
    if (ws) {
      ws.close();
      setWs(null);
      console.log('WebSocket connection closed');
    }
  };

  useEffect(() => {
    return () => {
      disconnectFromWs();
    };
  }, []);

  // const Lout = () => {

  //   disconnectFromWs();
  //   navigateTo("/");

  // };


  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    })
    setOnlinePeople(people);
  }
  const handleMessage = (ev) => {
    const messageData = JSON.parse(ev.data);
    console.log({ ev, messageData });
    if ('online' in messageData) {
      console.log('online')
      showOnlinePeople(messageData.online)
    } else if ('text' in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages(prev => ([...prev, { ...messageData }]))
      }

    }
  }

  const sendMessage = (ev,file = null) => {
    console.log('sending message')
    if (ev){
      ev.preventDefault();
    }
    ws.send(JSON.stringify({

      recipient: selectedUserId,
      text: newMessageText,
      file,

    }));
    
    if(file){
      console.log('file',file)
      // const parts = file.name.split('.');
      // const ext = parts[parts.length -1];
      // const filename = Date.now() + '.' +ext;
      axios.get(`http://34.229.93.25:5000/messages/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      }).then(res => {
        console.log('message file',res.data)
        
        setMessages(prev => ([...prev, {
          file: file.name,
          sender: profile._id,
          recipient: selectedUserId,
          _id: Date.now(),
          createdAt: Date.now(),
        }]));
      })
    }else{
      console.log('no file message')
      setNewMessageText('');
      setMessages(prev => ([...prev, {
        text: newMessageText,
        sender: profile._id,
        recipient: selectedUserId,
        _id: Date.now(),
        createdAt: Date.now(),
      }]));
    }

  }

  const sendFile=(ev)=>{
      const reader = new FileReader();
      reader.readAsDataURL(ev.target.files[0]);
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1];
        sendMessage(null, {
          name: ev.target.files[0].name,
          data: base64Data,
        })
      };
  }





  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }

  }, [messages])



  useEffect(() => {
    axios.get('http://34.229.93.25:5000/alumni/all/allAlumni', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    }).then(res => {
      const offlinePeopleArray = res.data
        .filter(p => p._id !== profile._id)
        .filter(p => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArray.forEach(p => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });

  }, [onlinePeople])

  useEffect(() => {
    const div = divUnderMessages.current;
    console.log('selected user id in useEffect',selectedUserId)
    if (selectedUserId) {

      axios.get(`http://34.229.93.25:5000/messages/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      }).then(res => {
        setMessages(res.data);
      })
    }

  }, [selectedUserId])

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[profile._id];


  const messagesWithoutDupes = uniqBy(messages, '_id')

  const formatCreatedAt = (createdAt) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const timeString = new Date(createdAt).toLocaleTimeString(undefined, options);
    const dateString = new Date(createdAt).toLocaleDateString();

    return `${timeString} ${dateString}`;
  };
  console.log('selected username ',selectedUsername)


  return (
    <div>
      <div className='users-ofline' >
        {Object.keys(onlinePeopleExclOurUser).map(userId => (
          <Contact
            key={userId}
            id={userId}
            online={true}
            username={onlinePeopleExclOurUser[userId]}
            onClick={() => {
              setSelectedUserId(userId)
              handleChatbox(true, onlinePeopleExclOurUser[userId])
            }}
            selected={userId === selectedUserId}
          />
        ))}
        {Object.keys(offlinePeople).map(userId => (
          <Contact
            key={userId}
            id={userId}
            online={false}
            username={offlinePeople[userId].firstName}
            onClick={() => {
              setSelectedUserId(userId)
              handleChatbox(true, offlinePeople[userId].firstName)
            }}
            selected={userId === selectedUserId}
          />
        ))}
      </div>
      {(isProfile && !!selectedUserId) && (
        <div className='pfl-ch'>
          <div className='profile-chat'>
            <div className='chat-style' >
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={Picture} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />
                <p style={{ margin: '0px', alignContent: 'center', color: 'white' }}>{selectedUsername}</p>
              </div>
              <div className='c-btn' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button onClick={() => handleChatbox(false)}><IoMdClose style={{ fontSize: '22' }} /></button>
              </div>

            </div>
            <div style={{height: '65%', width: '100%', backgroundColor: '#174873'}}>
            {!!selectedUserId && (
            <div style={{ position: 'relative', height: '100%' }}>
              <div style={{ position: 'absolute', overflowY: 'scroll', height: '100%', width: '100%' }}>
                {messagesWithoutDupes.map(message => (
                  <div key={message._id} style={{ textAlign: (message.sender === profile._id ? 'right' : 'left') }}>
                    <div className={"" + (message.sender === profile._id ? 'myChat' : 'yourChat')} style={{ textAlign: 'left', borderRadius: '6px', padding: '10px', margin: '5px' }}>
                      {message.text} {formatCreatedAt(message.createdAt)}
                      {message.file && (
                        <div style={{fontSize: '14px',display: 'flex', alignItems: 'center'}}>
                          <AiOutlinePaperClip/>
                          <a href={`http://34.229.93.25:5000/uploads/${message.file}`} target="_blank" rel="noopener noreferrer">{message.file}</a>
                      </div>
                      )
                      }
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>

          )}


            </div>
            <div className='msg'>
            <label style={{padding: '10px',backgroundColor: '#e3e5e8', border: 'none',borderRadius: '10%',cursor: 'pointer',textAlign: 'center',width: '20%'}}>
                <input type="file" style={{display: 'none'}} onChange={sendFile}/>
                <AiOutlinePaperClip style={{color: 'grey'}}/>
              </label>


              <input type='text' name='text' placeholder='Type a message' value={newMessageText} onChange={ev => setNewMessageText(ev.target.value)} />
              <div onClick={sendMessage} style={{textAlign: 'center',cursor: 'pointer',width: '30%', height: '90%', display: 'flex',justifyContent: 'center', alignItems: 'center',backgroundColor: '#a3e3ff'}}>
              Send 
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
