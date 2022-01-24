import React from 'react';
import { Triangle } from 'react-loader-spinner'

const Loading = () => {
    return (
        <center style={{height:'100vh',display:"grid",placeItems:"center"}}>
            <div style={{display:"grid",placeItems:"center"}}>
                <img
                    src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
                    alt=''
                    style={{ marginBottom: 10 }}
                    height={200}
                />
                <Triangle color="#00e676" height={80} width={80} />
            </div>
        </center>
    );
};

export default Loading;
