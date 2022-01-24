import React, { useState, useRef } from 'react';
import Message from './Message'
import { useRouter } from 'next/router'
import { auth, db } from '../firebase'
import firebase from "firebase/compat/app"
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore'
import TimeAgo from 'timeago-react'
import getRecipientEmail from '../util/getRecipientEmail'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Avatar } from '@mui/material'
import { IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import styled from 'styled-components'

const ChatScreen = ({ chat, messages }) => {

    const [user] = useAuthState(auth);

    const router = useRouter();

    const [input, setInput] = useState('');

    const recipientEmail = getRecipientEmail(chat.users, user);

    const [recipientSnapshot] = useCollection(db.collection("users").where("email", "==", recipientEmail))

    const endOfMessageRef = useRef(null);

    const [messagesSnapshot] = useCollection(
        db
            .collection('chats')
            .doc(router.query.id)
            .collection('messages')
            .orderBy('timestamp', 'asc')
    );

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map(message => (
                <Message
                    key={message.id}
                    user={message.user}
                    message={message} />
            ))
        }
    };

    const scrollToBottom = () => {
        endOfMessageRef?.current?.scrollIntoView({
            behaviour: "smooth",
            block: "start",
        })
    }

    scrollToBottom();

    const sendMessage = (e) => {
        e.preventDefault();
        scrollToBottom();

        // update last seen
        db.collection('users').doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })

        // 
        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        })

        setInput("");
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();

    console.log(recipient);
    console.log(recipientSnapshot);
    return (
        <Container>
            <Header>
                {recipient
                    ? <Avatar src={recipient.photoURL} />
                    : <Avatar>{recipientEmail[0]}</Avatar>
                }
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {
                        recipientSnapshot ? (
                            <p>
                                Last message: {' '}
                                {
                                    recipient?.lastSeen?.toDate() ? (
                                        <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                                    ) : 'Unavailable'
                                }
                            </p>
                        )
                            : <p>Loading...</p>
                    }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndofMessage ref={endOfMessageRef} />
            </MessageContainer>
            <InputContainer>
                <IconButton>
                    <InsertEmoticonIcon />
                </IconButton>
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input} type='submit' onClick={sendMessage}>Send Message</button>
                <MicIcon />
            </InputContainer>
        </Container>
    );
};

export default ChatScreen;

const Container = styled.div`
`;

const Header = styled.div`
position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 15px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
margin-left:15px;
flex:1;

> h3{
    margin-bottom:3px;
}

> p{
    font-size:14px;
    color:gray;
}
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
min-height:90vh;
padding:30px;
background-color:#e5ded8;


`;

const Input = styled.input`
flex:1;
align-items:center;
padding:10px;
position:sticky;
bottom:0;
background-color:whitesmoke;
padding:20px;
margin:0 15px;
outline:none; 
border:none;
border-radius:9999px;
`;

const EndofMessage = styled.div`
margin:50px;
`;

const InputContainer = styled.form`
display:flex;
align-items:center;
padding:10px;
position:sticky;
bottom:0;
background-color:white;
z-index:100;
`;