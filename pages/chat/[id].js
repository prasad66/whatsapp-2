import React from 'react';
import Head from 'next/head';
import Sidebar from '../../components/Sidebar'
import styled from 'styled-components'
import ChatScreen from '../../components/ChatScreen';
import { auth, db } from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../util/getRecipientEmail'

const Chat = ({ chat, messages }) => {

    const [user] = useAuthState(auth);

    const userName = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Head>
                <title>Chat with {(userName.charAt(0).toUpperCase()+userName.slice(1)).split("@")[0]} </title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>

        </Container>
    );
};

export default Chat;

export async function getServerSideProps(context) {

    const ref = db.collection('chats').doc(context.query.id);

    // prep messages on server
    const messagesRes = await ref
        .collection("messages")
        .orderBy("timestamp", "asc")
        .get();

    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    // prep chats
    const chatRes = await ref.get();

    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    };
}

const Container = styled.div`
display:flex;
`;
const ChatContainer = styled.div`
flex:1;
overflow:scroll;
height:100vh;

::-webkit-scrollbar{
display:none;
}

-ms-overflow-style:none;
scrollbar-width:none;
`;