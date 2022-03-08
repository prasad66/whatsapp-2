import * as React from 'react';
import Chat from './Chat'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore'
import { auth, db } from '../firebase'
import * as EmailValidator from 'email-validator'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import styled from 'styled-components'
import { Avatar } from '@mui/material'
import { IconButton } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const Sidebar = () => {
    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);

    const [chatsSnapshot] = useCollection(userChatRef);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        auth.signOut();
    };

    const createChat = () => {
        const input = prompt(
            "Please enter an email address for the user you wish to chat with"
        );

        if (!input) return null;

        if (
            EmailValidator.validate(input) &&
            !chatAlreadyPresent(input) &&
            input !== user.email
        ) {
            db.collection("chats").add({
                users: [user.email, input],
            });
        }
    };

    const chatAlreadyPresent = (recipientEmail) =>
        !!chatsSnapshot?.docs.find(
            (chat) =>
                chat.data().users.find((user) => user === recipientEmail)?.length > 0
        );

    return <Container>
        <Header>

            <UserAvatar src={user?.photoURL} />
            <IconsContainer>
                <IconButton>
                    <ChatIcon />
                </IconButton>
                <IconButton onClick={()=>auth.signOut()}>
                    <PowerSettingsNewIcon color='red'/>
                </IconButton>

            </IconsContainer>
       
        </Header>
        <Search>
            <SearchIcon />
            <SearchInput placeholder='Search in Chats...' />
        </Search>

        <SidebarButton onClick={createChat}>Start a new chat
        </SidebarButton>
        {chatsSnapshot?.docs.map(chat =>
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        )}
    </Container>;
};

export default Sidebar;

const Container = styled.div`
flex:0.45;
border-right: 1px solid whitesmoke;
height:100vh;
min-width:300px;
max-width:350px;
overflow-y: scroll;
::-webkit-scrollbar{
    display:none
}
-ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

const Search = styled.div`
display:flex;
align-items:center;
padding:20px;
border-radius: 2px;
position : sticky;
`;

const SidebarButton = styled(Button)`
width:100%;
border-bottom:1px solid whitesmoke;
border-top:1px solid whitesmoke;
color:black
`;

const SearchInput = styled.input`
outline-width:0;
border:none;
flex:1;
padding:10px 0;
padding-left:10px;
border-radius:9999px;
background-color:whitesmoke;
`;

const Header = styled.div`
display : flex;
position : sticky;
top:0;
background-color:white;
justify-content:space-between;
align-items: center;
padding:15px;
height:80px;
border-bottom:1px solid whitesmoke
`;

const UserAvatar = styled(Avatar)`
cursor:pointer;
:hover{
    opacity:0.8;
}
`;

const IconsContainer = styled.div``;