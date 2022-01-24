import React from 'react';
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from 'moment'
import styled from 'styled-components'


const Message = ({ user, message }) => {
    const [userLoggedIn] = useAuthState(auth);


    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

    return (
        <Container>
            {
                <TypeOfMessage>{message.message}
                    <Timestamp>
                        {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
                    </Timestamp>
                </TypeOfMessage>
            }
        </Container>
    );
};

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
width:fit-content;
padding:15px;
border-radius:8px;
margin:10px;
min-width:30px;
max-width:90%;
padding-bottom:26px;
position:relative;
text-align:right;
word-wrap: break-word; 
`;

const Sender = styled(MessageElement)`
margin-left:auto;
background-color:#dcf8c6;
`;

const Receiver = styled(MessageElement)`
background-color:whitesmoke;
text-align:left;
`;

const Timestamp = styled.span`
color:gray;
padding:10px;
font-size:9px;
position:absolute;
bottom:0;
text-align:right;
right:0; 
`;