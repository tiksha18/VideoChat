import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { SocketContext } from '../SocketContext';


const Notifications = () => {

    const { answerCall, call, callAccepted } = useContext(SocketContext);

    return (  
        
        <React.Fragment>
            {
                call.isReceivedCall && !callAccepted && (
                    <div style={{display: 'flex', justifyContent: 'center'}} >
                        <h2>{call.name} is calling -- </h2>
                        <Button variant="contained" color="primary" onClick={answerCall} >
                            Answer
                        </Button>
                    </div>
                )
            }
        </React.Fragment>
    );
}

export default Notifications;